import os
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship

# ========== 配置 ==========
DATABASE_URL = "sqlite:///./likebox.db"
SECRET_KEY = "change-this-in-production"

# ========== 数据库 ==========
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    image_url = Column(String, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    category = relationship("Category", back_populates="products")
    likes = relationship("Like", back_populates="product")
    comments = relationship("Comment", back_populates="product")


class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    product = relationship("Product", back_populates="likes")


class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    product = relationship("Product", back_populates="comments")
    user = relationship("User")


Base.metadata.create_all(bind=engine)


# ========== 依赖 ==========
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ========== Schema ==========
class UserCreate(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class CategoryOut(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str
    description: str
    image_url: Optional[str] = None
    category_id: int


class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    image_url: Optional[str]
    category_id: int
    created_at: datetime
    like_count: int = 0
    is_liked: bool = False
    
    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    product_id: int
    content: str


class CommentOut(BaseModel):
    id: int
    content: str
    created_at: datetime
    username: str
    
    class Config:
        from_attributes = True


# ========== API ==========
app = FastAPI(title="LikeBox")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 简单静态文件服务
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")


def get_current_user(db: Session = Depends(get_db), username: Optional[str] = None):
    """简化版：直接用username作为用户标识"""
    if not username:
        return None
    user = db.query(User).filter(User.username == username).first()
    return user


@app.post("/api/register", response_model=UserOut)
def register(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="用户名已存在")
    
    user = User(username=data.username, password_hash=data.password)  # 生产环境要hash
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/api/login")
def login(data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or user.password_hash != data.password:
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    return {"username": user.username, "user_id": user.id}


@app.get("/api/categories", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@app.post("/api/categories", response_model=CategoryOut)
def create_category(name: str, db: Session = Depends(get_db)):
    cat = Category(name=name)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@app.get("/api/products", response_model=list[ProductOut])
def get_products(
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    sort: str = "latest",
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    username: Optional[str] = None
):
    from sqlalchemy import func
    
    # 子查询获取点赞数
    like_count_subq = (
        db.query(Like.product_id, func.count(Like.id).label('like_count'))
        .group_by(Like.product_id)
        .subquery()
    )
    
    query = db.query(Product, func.coalesce(like_count_subq.c.like_count, 0).label('like_count'))
    
    # 左连接点赞数
    query = query.outerjoin(like_count_subq, Product.id == like_count_subq.c.product_id)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if search:
        query = query.filter(Product.name.contains(search))
    
    if sort == "popular":
        query = query.order_by(func.coalesce(like_count_subq.c.like_count, 0).desc())
    else:
        query = query.order_by(Product.created_at.desc())
    
    # 分页
    offset = (page - 1) * limit
    results = query.offset(offset).limit(limit).all()
    
    # 获取当前用户点赞状态
    current_user = None
    user_liked_products = set()
    if username:
        current_user = db.query(User).filter(User.username == username).first()
        if current_user:
            liked = db.query(Like.product_id).filter(Like.user_id == current_user.id).all()
            user_liked_products = {l[0] for l in liked}
    
    product_outputs = []
    for p, like_count in results:
        product_outputs.append(ProductOut(
            id=p.id, name=p.name, description=p.description,
            image_url=p.image_url, category_id=p.category_id,
            created_at=p.created_at, like_count=like_count, 
            is_liked=p.id in user_liked_products
        ))
    return product_outputs


@app.post("/api/products", response_model=ProductOut)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return ProductOut(
        id=product.id, name=product.name, description=product.description,
        image_url=product.image_url, category_id=product.category_id,
        created_at=product.created_at, like_count=0, is_liked=False
    )


@app.post("/api/products/{product_id}/like")
def like_product(product_id: int, username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="请先登录")
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="产品不存在")
    
    existing = db.query(Like).filter(Like.user_id == user.id, Like.product_id == product_id).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"liked": False, "count": len(product.likes) - 1}
    else:
        like = Like(user_id=user.id, product_id=product_id)
        db.add(like)
        db.commit()
        return {"liked": True, "count": len(product.likes) + 1}


@app.get("/api/products/{product_id}/comments", response_model=list[CommentOut])
def get_comments(product_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.product_id == product_id).order_by(Comment.created_at.desc()).all()
    return [CommentOut(id=c.id, content=c.content, created_at=c.created_at, username=c.user.username) for c in comments]


@app.post("/api/comments", response_model=CommentOut)
def create_comment(data: CommentCreate, username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="请先登录")
    
    comment = Comment(user_id=user.id, product_id=data.product_id, content=data.content)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return CommentOut(id=comment.id, content=comment.content, created_at=comment.created_at, username=user.username)


# 初始化一些分类
def init_categories():
    db = SessionLocal()
    if db.query(Category).count() == 0:
        categories = ["数码", "生活", "食品", "服饰", "图书", "游戏", "其他"]
        for name in categories:
            db.add(Category(name=name))
        db.commit()
    db.close()


init_categories()
