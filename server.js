const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('static'));

// JSON 文件存储
const DB_FILE = path.join(__dirname, 'db.json');

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) {}
  return { users: [], categories: [], products: [], likes: [], comments: [] };
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

let db = loadDB();

// 初始化分类
if (db.categories.length === 0) {
  db.categories = [
    { id: 1, name: '数码' },
    { id: 2, name: '生活' },
    { id: 3, name: '食品' },
    { id: 4, name: '服饰' },
    { id: 5, name: '图书' },
    { id: 6, name: '游戏' },
    { id: 7, name: '其他' }
  ];
  saveDB(db);
}

// 辅助函数
function genId(arr) {
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}

// ========== API ==========

// 注册
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ error: '用户名已存在' });
  }
  const user = { id: genId(db.users), username, password, created_at: new Date().toISOString() };
  db.users.push(user);
  saveDB(db);
  res.json({ id: user.id, username: user.username });
});

// 登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  res.json({ user_id: user.id, username: user.username });
});

// 分类列表
app.get('/api/categories', (req, res) => {
  res.json(db.categories);
});

// 产品列表
app.get('/api/products', (req, res) => {
  const { category_id, search, sort, username } = req.query;
  
  let products = [...db.products];
  
  if (category_id) {
    products = products.filter(p => p.category_id == category_id);
  }
  if (search) {
    products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }
  
  // 添加点赞数
  products = products.map(p => {
    const like_count = db.likes.filter(l => l.product_id === p.id).length;
    return { ...p, like_count };
  });
  
  // 排序
  if (sort === 'popular') {
    products.sort((a, b) => b.like_count - a.like_count);
  } else {
    products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  
  // 添加点赞状态
  let userId = null;
  if (username) {
    const user = db.users.find(u => u.username === username);
    if (user) userId = user.id;
  }
  
  const result = products.map(p => ({
    ...p,
    is_liked: userId ? db.likes.some(l => l.user_id === userId && l.product_id === p.id) : false
  }));
  
  res.json(result);
});

// 添加产品
app.post('/api/products', (req, res) => {
  const { name, description, image_url, category_id } = req.body;
  const product = {
    id: genId(db.products),
    name,
    description,
    image_url: image_url || null,
    category_id,
    created_at: new Date().toISOString()
  };
  db.products.push(product);
  saveDB(db);
  res.json({ ...product, like_count: 0, is_liked: false });
});

// 点赞/取消点赞
app.post('/api/products/:id/like', (req, res) => {
  const { username } = req.body;
  const productId = parseInt(req.params.id);
  
  const user = db.users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: '请先登录' });
  }
  
  const existingIndex = db.likes.findIndex(l => l.user_id === user.id && l.product_id === productId);
  
  if (existingIndex >= 0) {
    db.likes.splice(existingIndex, 1);
    saveDB(db);
    const count = db.likes.filter(l => l.product_id === productId).length;
    res.json({ liked: false, count });
  } else {
    db.likes.push({ id: genId(db.likes), user_id: user.id, product_id: productId, created_at: new Date().toISOString() });
    saveDB(db);
    const count = db.likes.filter(l => l.product_id === productId).length;
    res.json({ liked: true, count });
  }
});

// 评论列表
app.get('/api/products/:id/comments', (req, res) => {
  const productId = parseInt(req.params.id);
  const comments = db.comments
    .filter(c => c.product_id === productId)
    .map(c => {
      const user = db.users.find(u => u.id === c.user_id);
      return { ...c, username: user?.username || '未知' };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(comments);
});

// 添加评论
app.post('/api/comments', (req, res) => {
  const { product_id, content, username } = req.body;
  
  const user = db.users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: '请先登录' });
  }
  
  const comment = {
    id: genId(db.comments),
    user_id: user.id,
    product_id,
    content,
    created_at: new Date().toISOString()
  };
  db.comments.push(comment);
  saveDB(db);
  res.json({ ...comment, username: user.username });
});

app.listen(PORT, () => {
  console.log(`LikeBox 运行在 http://localhost:${PORT}`);
});
