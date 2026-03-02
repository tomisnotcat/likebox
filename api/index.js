const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const categories = [
  { id: 1, name: '数码', children: [{ id: 101, name: '手机' }, { id: 102, name: '电脑' }, { id: 103, name: '耳机' }] },
  { id: 2, name: '运动', children: [{ id: 201, name: '跑鞋' }] },
  { id: 3, name: '食品', children: [{ id: 301, name: '咖啡' }] },
  { id: 4, name: '服饰', children: [{ id: 401, name: 'T恤' }, { id: 402, name: '外套' }] },
  { id: 5, name: '图书', children: [{ id: 501, name: '小说' }] },
  { id: 6, name: '电子产品', children: [{ id: 601, name: '配件' }] },
  { id: 7, name: '美妆', children: [{ id: 701, name: '护肤品' }] },
  { id: 8, name: '家居', children: [{ id: 801, name: '家具' }] }
];

const fakeStoreProducts = [
  {id: 1, title: "Fjallraven - Foldsack No. 1 Backpack", category: "men's clothing", image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.png", price: 109.95, rating: {rate: 3.9, count: 120}},
  {id: 2, title: "Mens Casual Premium Slim Fit T-Shirts", category: "men's clothing", image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.png", price: 22.3, rating: {rate: 4.1, count: 259}},
  {id: 3, title: "Mens Cotton Jacket", category: "men's clothing", image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.png", price: 55.99, rating: {rate: 4.7, count: 500}},
  {id: 4, title: "Mens Casual Slim Fit", category: "men's clothing", image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.png", price: 15.99, rating: {rate: 2.1, count: 430}},
  {id: 5, title: "John Hardy Women's Legends Naga Bracelet", category: "jewelery", image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.png", price: 695, rating: {rate: 4.6, count: 400}},
  {id: 6, title: "Solid Gold Petite Micropave", category: "jewelery", image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.png", price: 168, rating: {rate: 3.9, count: 70}},
  {id: 7, title: "White Gold Plated Princess", category: "jewelery", image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.png", price: 9.99, rating: {rate: 3, count: 400}},
  {id: 8, title: "Pierced Owl Rose Gold Plated Earrings", category: "jewelery", image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.png", price: 10.99, rating: {rate: 1.9, count: 100}},
  {id: 9, title: "WD 2TB Elements Portable Hard Drive", category: "electronics", image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.png", price: 64, rating: {rate: 3.3, count: 203}},
  {id: 10, title: "SanDisk SSD PLUS 1TB Internal SSD", category: "electronics", image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.png", price: 109, rating: {rate: 2.9, count: 470}},
  {id: 11, title: "Silicon Power 256GB SSD 3D NAND", category: "electronics", image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.png", price: 109, rating: {rate: 4.8, count: 319}},
  {id: 12, title: "WD 4TB Gaming Drive PS4", category: "electronics", image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.png", price: 114, rating: {rate: 4.8, count: 400}},
  {id: 13, title: "Acer SB220Q bi 21.5 inches Full HD IPS", category: "electronics", image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.png", price: 599, rating: {rate: 2.9, count: 250}},
  {id: 14, title: "Samsung 49-Inch CHG90 Curved Gaming Monitor", category: "electronics", image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.png", price: 999.99, rating: {rate: 2.2, count: 140}},
  {id: 15, title: "BIYLACLESEN Women's Snowboard Jacket", category: "women's clothing", image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.png", price: 56.99, rating: {rate: 2.6, count: 235}},
  {id: 16, title: "Lock and Love Women's Removable Hooded Jacket", category: "women's clothing", image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.png", price: 29.95, rating: {rate: 2.9, count: 340}},
  {id: 17, title: "Rain Jacket Women Windbreaker", category: "women's clothing", image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.png", price: 39.99, rating: {rate: 3.8, count: 679}},
  {id: 18, title: "MBJ Women's Solid Short Sleeve Boat Neck", category: "women's clothing", image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.png", price: 9.85, rating: {rate: 4.7, count: 130}},
  {id: 19, title: "Opna Women's Short Sleeve Moisture", category: "women's clothing", image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.png", price: 7.95, rating: {rate: 4.5, count: 146}},
  {id: 20, title: "DANVOUY Womens T Shirt Casual Cotton", category: "women's clothing", image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.png", price: 12.99, rating: {rate: 3.6, count: 145}}
];

function generateUsers() {
  const users = [{ id: 1, username: 'demo', password: '123456', is_admin: true, avatar: '', bio: '演示账号', created_at: '2024-01-01T00:00:00.000Z', points: 0, last_checkin: null, checkin_days: 0 }];
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐'];
  const names = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀英', '华', '鑫', '宇', '鹏', '辉', '波', '峰', '龙', '凤', '梅', '兰'];
  const nicks = ['星辰', '追风', '漫步', '独行', '追梦', '小米', '温暖', '静待', '岁月', '时光', '北极', '阳光', '快乐', '自由', '青春'];
  for (let i = 0; i < 1000; i++) {
    const surname = surnames[i % surnames.length];
    const name = names[i % names.length];
    const nick = nicks[i % nicks.length];
    const username = (i % 3 === 0) ? nick + (i + 100) : surname + name;
    users.push({
      id: i + 2,
      username: username,
      password: '123456',
      is_admin: false,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      bio: `我是用户${i+1}`,
      created_at: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      points: Math.floor(Math.random() * 500),
      last_checkin: Math.random() > 0.5 ? new Date().toDateString() : null,
      checkin_days: Math.floor(Math.random() * 30)
    });
  }
  return users;
}

const categoryMap = { "men's clothing": 401, "women's clothing": 402, "jewelery": 701, "electronics": 601 };
const products = fakeStoreProducts.map((p, i) => ({
  id: i + 1,
  name: p.title,
  description: `$${p.price} - Rating: ${p.rating.rate}/5 (${p.rating.count} reviews)`,
  image_url: p.image,
  category_id: categoryMap[p.category] || 401,
  tags: p.category,
  price: p.price,
  created_at: new Date(2024, 0, 1 + i).toISOString()
}));

const users = generateUsers();

const likes = [];
const comments = [];
const favorites = [];
const follows = []; // 用户关注关系

users.forEach((user) => {
  if (user.is_admin) return;
  const numLikes = 5 + Math.floor(Math.random() * 15);
  for (let i = 0; i < numLikes; i++) {
    likes.push({ id: likes.length + 1, user_id: user.id, product_id: 1 + Math.floor(Math.random() * products.length), created_at: new Date().toISOString() });
  }
  if (Math.random() > 0.7) favorites.push({ id: favorites.length + 1, user_id: user.id, product_id: 1 + Math.floor(Math.random() * products.length), created_at: new Date().toISOString() });
  if (Math.random() > 0.8) {
    const texts = ['很棒！', '非常喜欢', '质量不错', '推荐购买', '性价比高'];
    comments.push({ id: comments.length + 1, user_id: user.id, product_id: 1 + Math.floor(Math.random() * products.length), content: texts[Math.floor(Math.random() * texts.length)], created_at: new Date().toISOString() });
  }
});

const brands = [
  { id: 1, name: 'Apple', category_id: 601, logo: 'https://logo.clearbit.com/apple.com' },
  { id: 2, name: 'Samsung', category_id: 601, logo: 'https://logo.clearbit.com/samsung.com' },
  { id: 3, name: 'Sony', category_id: 601, logo: 'https://logo.clearbit.com/sony.com' },
  { id: 4, name: 'WD', category_id: 601, logo: 'https://logo.clearbit.com/wd.com' },
  { id: 5, name: 'SanDisk', category_id: 601, logo: 'https://logo.clearbit.com/sandisk.com' },
  { id: 6, name: 'Acer', category_id: 601, logo: 'https://logo.clearbit.com/acer.com' },
  { id: 7, name: 'Nike', category_id: 401, logo: 'https://logo.clearbit.com/nike.com' },
  { id: 8, name: 'Adidas', category_id: 401, logo: 'https://logo.clearbit.com/adidas.com' },
  { id: 9, name: 'Uniqlo', category_id: 401, logo: 'https://logo.clearbit.com/uniqlo.com' },
  { id: 10, name: 'Fjallraven', category_id: 401, logo: 'https://logo.clearbit.com/fjallraven.com' },
  { id: 11, name: 'John Hardy', category_id: 701, logo: 'https://logo.clearbit.com/johnhardy.com' },
  { id: 12, name: 'BIYLACLESEN', category_id: 402, logo: '' },
  { id: 13, name: 'Lock and Love', category_id: 402, logo: '' },
  { id: 14, name: 'MBJ', category_id: 402, logo: '' },
  { id: 15, name: 'Opna', category_id: 402, logo: '' },
  { id: 16, name: 'DANVOUY', category_id: 402, logo: '' }
];

const defaultData = {
  brands: brands,
  users: users,
  categories: categories,
  products: products,
  likes: likes,
  comments: comments,
  favorites: favorites,
  follows: follows,
  nextIds: { users: users.length + 1, products: products.length + 1 }
};

let db = { ...defaultData };

// 简单内存缓存
const cache = new Map();
const CACHE_TTL = 5000; // 5秒缓存

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Test route
app.get('/api/test-route', (req, res) => {
  res.json({ success: true, message: 'Route works!' });
});

app.get('/api/products', (req, res, next) => {
  try {
    const cacheKey = JSON.stringify(req.query);
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);
    
    // 预处理：建立点赞和评论计数缓存 O(n)
    const likeCountMap = {};
    const commentCountMap = {};
    db.likes.forEach(l => { likeCountMap[l.product_id] = (likeCountMap[l.product_id] || 0) + 1; });
    db.comments.forEach(c => { commentCountMap[c.product_id] = (commentCountMap[c.product_id] || 0) + 1; });
    
    let result = db.products.map(p => ({ 
      ...p, 
      price: p.price || 0,
      like_count: likeCountMap[p.id] || 0, 
      comment_count: commentCountMap[p.id] || 0
    }));
    
    // 搜索
    if (req.query.search) { 
      const s = req.query.search.toLowerCase(); 
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.tags?.toLowerCase().includes(s)); 
    }
    
    // 分类筛选
    if (req.query.category_id) result = result.filter(p => p.category_id === parseInt(req.query.category_id));
    
    // 价格筛选
    if (req.query.min_price) result = result.filter(p => (p.price || 0) >= parseFloat(req.query.min_price));
    if (req.query.max_price) result = result.filter(p => (p.price || 0) <= parseFloat(req.query.max_price));
    
    // 评分筛选 (从description中提取)
    if (req.query.min_rating) {
      result = result.filter(p => {
        const match = p.description?.match(/Rating: ([\d.]+)/);
        const rating = match ? parseFloat(match[1]) : 0;
        return rating >= parseFloat(req.query.min_rating);
      });
    }
    
    // Tags筛选
    if (req.query.tags) {
      const tags = req.query.tags.split(',').map(t => t.trim().toLowerCase());
      result = result.filter(p => tags.some(t => p.tags?.toLowerCase().includes(t)));
    }
    
    // 排序
    const sort = req.query.sort;
    if (sort === 'price_asc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === 'price_desc') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sort === 'likes') result.sort((a, b) => b.like_count - a.like_count);
    else if (sort === 'comments') result.sort((a, b) => b.comment_count - a.comment_count);
    else if (sort === 'newest') result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // 分页
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);
    
    const response = {
      data: paginated,
      pagination: {
        page,
        limit,
        total: result.length,
        total_pages: Math.ceil(result.length / limit)
      }
    };
    
    setCache(cacheKey, response);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = db.products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: '产品不存在' });
    // 预处理计数
    const likeCount = db.likes.filter(l => l.product_id === product.id).length;
    const productComments = db.comments.filter(c => c.product_id === product.id).map(c => { const user = db.users.find(u => u.id === c.user_id); return { ...c, username: user?.username }; });
    res.json({ ...product, like_count: likeCount, comments: productComments });
  } catch (err) {
    next(err);
  }
});

app.post('/api/products/:id/like', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    const pid = parseInt(req.params.id);
    const existing = db.likes.find(l => l.user_id === user.id && l.product_id === pid);
    if (existing) { db.likes = db.likes.filter(l => l !== existing); res.json({ liked: false }); }
    else { db.likes.push({ id: db.likes.length + 1, user_id: user.id, product_id: pid, created_at: new Date().toISOString() }); res.json({ liked: true }); }
  } catch (err) {
    next(err);
  }
});

app.get('/api/favorites', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.query.username);
    if (!user) return res.json([]);
    res.json(db.favorites.filter(f => f.user_id === user.id).map(f => db.products.find(p => p.id === f.product_id)).filter(p => p));
  } catch (err) {
    next(err);
  }
});

app.post('/api/favorites', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    const pid = parseInt(req.body.product_id);
    const existing = db.favorites.find(f => f.user_id === user.id && f.product_id === pid);
    if (existing) { db.favorites = db.favorites.filter(f => f !== existing); res.json({ favorited: false }); }
    else { db.favorites.push({ id: db.favorites.length + 1, user_id: user.id, product_id: pid, created_at: new Date().toISOString() }); res.json({ favorited: true }); }
  } catch (err) {
    next(err);
  }
});

app.get('/api/products/:id/comments', (req, res, next) => {
  try {
    res.json(db.comments.filter(c => c.product_id === parseInt(req.params.id)).map(c => { const user = db.users.find(u => u.id === c.user_id); return { ...c, username: user?.username }; }));
  } catch (err) {
    next(err);
  }
});

app.post('/api/comments', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    const comment = { id: db.comments.length + 1, user_id: user.id, product_id: parseInt(req.body.product_id), content: req.body.content, created_at: new Date().toISOString() };
    db.comments.push(comment);
    res.json({ ...comment, username: user.username });
  } catch (err) {
    next(err);
  }
});

app.post('/api/register', (req, res, next) => {
  try {
    const username = (req.body.username || '').trim();
    const password = req.body.password || '';
    
    if (!username) return res.status(400).json({ error: '用户名不能为空' });
    if (!password) return res.status(400).json({ error: '密码不能为空' });
    if (username.length < 2) return res.status(400).json({ error: '用户名至少2个字符' });
    if (password.length < 6) return res.status(400).json({ error: '密码至少6个字符' });
    if (username.length > 20) return res.status(400).json({ error: '用户名最多20个字符' });
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) return res.status(400).json({ error: '用户名只能包含字母、数字、下划线和中文' });
    
    if (db.users.find(u => u.username === username)) return res.status(400).json({ error: '用户名已存在' });
    
    const user = { id: db.users.length + 1, username: username, password: password, is_admin: false, avatar: '', bio: '', created_at: new Date().toISOString() };
    db.users.push(user);
    res.json({ success: true, username: user.username });
  } catch (err) {
    next(err);
  }
});

app.post('/api/login', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username && u.password === req.body.password);
    if (!user) return res.status(401).json({ error: '用户名或密码错误' });
    res.json({ username: user.username, is_admin: user.is_admin, avatar: user.avatar });
  } catch (err) {
    next(err);
  }
});

app.get('/api/categories', (req, res, next) => {
  try {
    res.json(categories);
  } catch (err) {
    next(err);
  }
});
app.get('/api/brands', (req, res, next) => {
  try {
    // 支持按分类筛选
    if (req.query.category_id) {
      const categoryId = parseInt(req.query.category_id);
      res.json(brands.filter(b => b.category_id === categoryId));
    } else {
      res.json(brands);
    }
  } catch (err) {
    next(err);
  }
});

app.get('/api/brands/:id', (req, res, next) => {
  try {
    const brand = brands.find(b => b.id === parseInt(req.params.id));
    if (!brand) return res.status(404).json({ error: '品牌不存在' });
    res.json(brand);
  } catch (err) {
    next(err);
  }
});

app.get('/api/categories/:id', (req, res, next) => {
  try {
    const cid = parseInt(req.params.id);
    // 预处理点赞计数
    const likeCountMap = {};
    db.likes.forEach(l => { likeCountMap[l.product_id] = (likeCountMap[l.product_id] || 0) + 1; });
    const products = db.products.filter(p => p.category_id === cid).map(p => ({ ...p, like_count: likeCountMap[p.id] || 0 }));
    res.json({ id: cid, products });
  } catch (err) {
    next(err);
  }
});

app.get('/api/weekly', (req, res, next) => {
  try {
    res.json(db.products.slice(0, 6));
  } catch (err) {
    next(err);
  }
});

app.get('/api/leaderboard', (req, res, next) => {
  try {
    // 预处理用户点赞和评论计数
    const userLikeCount = {};
    const userCommentCount = {};
    db.likes.forEach(l => { userLikeCount[l.user_id] = (userLikeCount[l.user_id] || 0) + 1; });
    db.comments.forEach(c => { userCommentCount[c.user_id] = (userCommentCount[c.user_id] || 0) + 1; });
    
    const lb = db.users.filter(u => !u.is_admin).map(u => ({ 
      username: u.username, 
      score: (userLikeCount[u.id] || 0) + (userCommentCount[u.id] || 0) * 2 
    })).sort((a, b) => b.score - a.score).slice(0, 20);
    res.json(lb);
  } catch (err) {
    next(err);
  }
});

app.get('/api/ranking', (req, res, next) => {
  try {
    // 预处理：建立点赞计数缓存
    const likeCountMap = {};
    db.likes.forEach(l => { likeCountMap[l.product_id] = (likeCountMap[l.product_id] || 0) + 1; });
    res.json(db.products.map(p => ({ ...p, like_count: likeCountMap[p.id] || 0 })).sort((a, b) => b.like_count - a.like_count));
  } catch (err) {
    next(err);
  }
// ==================== 用户画像/数据分析面板 ====================

// 获取用户画像统计
app.get('/api/my-stats-v4', (req, res, next) => {
  try {
    const username = req.query.username;
    console.log('[PROFILE-DATA] Looking for:', username);
    const user = db.users.find(u => u.username === username);
    if (!user) return res.status(404).json({ error: '用户不存在', v:3 });
    
    const userLikes = db.likes.filter(l => l.user_id === user.id);
    const userComments = db.comments.filter(c => c.user_id === user.id);
    const userFavorites = db.favorites.filter(f => f.user_id === user.id);
    const userFollowing = db.follows ? db.follows.filter(f => f.follower_id === user.id) : [];
    const userFollowers = db.follows ? db.follows.filter(f => f.following_id === user.id) : [];
    
    res.json({
      user: { id: user.id, username: user.username, avatar: user.avatar, bio: user.bio, points: user.points, checkin_days: user.checkin_days },
      stats: { total_likes: userLikes.length, total_comments: userComments.length, total_favorites: userFavorites.length, following_count: userFollowing.length, followers_count: userFollowers.length }
    });
  } catch (err) {
    next(err);
  }
});

});

// 用户画像统计
app.get('/api/user/profile', (req, res, next) => {
  try {
    const username = req.query.username;
    const user = db.users.find(u => u.username === username);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    const userLikes = db.likes.filter(l => l.user_id === user.id);
    const userComments = db.comments.filter(c => c.user_id === user.id);
    const userFavorites = db.favorites.filter(f => f.user_id === user.id);
    const userFollowing = db.follows ? db.follows.filter(f => f.follower_id === user.id) : [];
    const userFollowers = db.follows ? db.follows.filter(f => f.following_id === user.id) : [];
    res.json({
      user: { id: user.id, username: user.username, avatar: user.avatar, bio: user.bio, points: user.points, checkin_days: user.checkin_days },
      stats: { total_likes: userLikes.length, total_comments: userComments.length, total_favorites: userFavorites.length, following_count: userFollowing.length, followers_count: userFollowers.length }
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/user/:username', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.params.username);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    res.json({ id: user.id, username: user.username, avatar: user.avatar, bio: user.bio, is_admin: user.is_admin, points: user.points, checkin_days: user.checkin_days });
  } catch (err) {
    next(err);
  }
});
// 更新用户头像
app.put('/api/user/avatar', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    
    const avatar = req.body.avatar;
    if (!avatar) return res.status(400).json({ error: '头像不能为空' });
    
    // 验证是否为有效的图片URL (data URL)
    if (!avatar.startsWith('data:image/')) {
      return res.status(400).json({ error: '无效的图片格式' });
    }
    
    user.avatar = avatar;
    res.json({ success: true, avatar: user.avatar });
  } catch (err) {
    next(err);
  }
});

// 更新用户资料
app.put('/api/user/profile', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    
    if (req.body.bio !== undefined) {
      if (req.body.bio.length > 200) return res.status(400).json({ error: '简介最多200个字符' });
      user.bio = req.body.bio;
    }
    
    res.json({ success: true, bio: user.bio });
  } catch (err) {
    next(err);
  }
});

app.post('/api/checkin', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    if (user.last_checkin === new Date().toDateString()) return res.json({ success: false, message: '今日已签到' });
    user.points = (user.points || 0) + 10;
    user.last_checkin = new Date().toDateString();
    user.checkin_days = (user.checkin_days || 0) + 1;
    res.json({ success: true, points: 10, total: user.points, days: user.checkin_days });
  } catch (err) {
    next(err);
  }
});

app.get('/api/checkin', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.query.username);
    if (!user) return res.json({ checked: false, days: 0 });
    res.json({ checked: user.last_checkin === new Date().toDateString(), days: user.checkin_days || 0 });
  } catch (err) {
    next(err);
  }
});

app.get('/api/points', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.query.username);
    if (!user) return res.json({ points: 0, level: 1 });
    res.json({ points: user.points || 0, level: Math.floor((user.points || 0) / 100) + 1 });
  } catch (err) {
    next(err);
  }
});

app.get('/api/compare', (req, res, next) => {
  try {
    if (!req.query.ids) return res.json([]);
    const ids = req.query.ids.split(',').map(id => parseInt(id));
    res.json(ids.map(id => db.products.find(p => p.id === id)).filter(p => p));
  } catch (err) {
    next(err);
  }
});

app.get('/api/admin/stats', (req, res, next) => {
  try {
    res.json({ total_users: db.users.length, total_products: db.products.length, total_likes: db.likes.length, total_comments: db.comments.length });
  } catch (err) {
    next(err);
  }
});

// ==================== 错误处理中间件 ====================
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: '服务器内部错误', message: err.message });
});

// ==================== 用户关注功能 ====================

// 获取关注状态
app.get('/api/follow', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.query.username);
    const targetUser = db.users.find(u => u.username === req.query.target_username);
    if (!user || !targetUser) return res.status(404).json({ error: '用户不存在' });
    
    if (!db.follows) db.follows = [];
    const isFollowing = db.follows.some(f => f.follower_id === user.id && f.following_id === targetUser.id);
    
    res.json({ following: isFollowing });
  } catch (err) {
    next(err);
  }
});

// 关注用户
app.post('/api/follow', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    
    const targetUser = db.users.find(u => u.username === req.body.target_username);
    if (!targetUser) return res.status(404).json({ error: '目标用户不存在' });
    if (user.id === targetUser.id) return res.status(400).json({ error: '不能关注自己' });
    
    const existing = db.follows?.find(f => f.follower_id === user.id && f.following_id === targetUser.id);
    if (!db.follows) db.follows = [];
    
    if (existing) {
      db.follows = db.follows.filter(f => f !== existing);
      res.json({ success: true, following: false, message: '已取消关注' });
    } else {
      db.follows.push({ id: db.follows.length + 1, follower_id: user.id, following_id: targetUser.id, created_at: new Date().toISOString() });
      res.json({ success: true, following: true, message: '关注成功' });
    }
  } catch (err) {
    next(err);
  }
});

// 获取关注列表
app.get('/api/following/:username', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.params.username);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    
    if (!db.follows) db.follows = [];
    const followingIds = db.follows.filter(f => f.follower_id === user.id).map(f => f.following_id);
    const followingUsers = followingIds.map(id => db.users.find(u => u.id === id)).filter(u => u);
    
    res.json(followingUsers.map(u => ({ id: u.id, username: u.username, avatar: u.avatar, bio: u.bio })));
  } catch (err) {
    next(err);
  }
});

// 获取粉丝列表
app.get('/api/followers/:username', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.params.username);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    
    if (!db.follows) db.follows = [];
    const followerIds = db.follows.filter(f => f.following_id === user.id).map(f => f.follower_id);
    const followerUsers = followerIds.map(id => db.users.find(u => u.id === id)).filter(u => u);
    
    res.json(followerUsers.map(u => ({ id: u.id, username: u.username, avatar: u.avatar, bio: u.bio })));
  } catch (err) {
    next(err);
  }
});

// 检查关注状态
app.get('/api/follow/status', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.query.username);
    const targetUser = db.users.find(u => u.username === req.query.target_username);
    if (!user || !targetUser) return res.status(404).json({ error: '用户不存在' });
    
    if (!db.follows) db.follows = [];
    const isFollowing = db.follows.some(f => f.follower_id === user.id && f.following_id === targetUser.id);
    
    res.json({ following: isFollowing });
  } catch (err) {
    next(err);
  }
});

// 获取用户关注数量
app.get('/api/follow/count/:username', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.params.username);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    
    if (!db.follows) db.follows = [];
    const followingCount = db.follows.filter(f => f.follower_id === user.id).length;
    const followerCount = db.follows.filter(f => f.following_id === user.id).length;
    
    res.json({ following: followingCount, followers: followerCount });
  } catch (err) {
    next(err);
  }
});

// ==================== 产品搜索优化 ====================

// 增强的产品搜索 - 支持更多筛选条件
app.get('/api/products/search', (req, res, next) => {
  try {
    let { q, category_id, min_price, max_price, sort, page, limit } = req.query;
    let result = [...db.products];
    
    // 预处理点赞和评论计数
    const likeCountMap = {};
    const commentCountMap = {};
    db.likes.forEach(l => { likeCountMap[l.product_id] = (likeCountMap[l.product_id] || 0) + 1; });
    db.comments.forEach(c => { commentCountMap[c.product_id] = (commentCountMap[c.product_id] || 0) + 1; });
    
    // 关键字搜索 - 支持中英文和拼音模糊匹配
    if (q) {
      const searchTerm = q.toLowerCase().trim();
      result = result.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchTerm);
        const descMatch = p.description?.toLowerCase().includes(searchTerm);
        const tagMatch = p.tags?.toLowerCase().includes(searchTerm);
        const categoryMatch = p.category_id === parseInt(searchTerm);
        return nameMatch || descMatch || tagMatch || categoryMatch;
      });
    }
    
    // 分类筛选
    if (category_id) {
      result = result.filter(p => p.category_id === parseInt(category_id));
    }
    
    // 价格区间筛选
    if (min_price) {
      result = result.filter(p => p.price >= parseFloat(min_price));
    }
    if (max_price) {
      result = result.filter(p => p.price <= parseFloat(max_price));
    }
    
    // 排序
    const sortKey = sort || 'default';
    switch (sortKey) {
      case 'price_asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        result.sort((a, b) => (likeCountMap[b.id] || 0) - (likeCountMap[a.id] || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }
    
    // 分页
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;
    const total = result.length;
    const start = (pageNum - 1) * pageSize;
    const paginatedResult = result.slice(start, start + pageSize);
    
    // 添加喜欢数和评论数 (使用预处理缓存)
    const resultWithCounts = paginatedResult.map(p => ({
      ...p,
      like_count: likeCountMap[p.id] || 0,
      comment_count: commentCountMap[p.id] || 0
    }));
    
    res.json({
      data: resultWithCounts,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        total_pages: Math.ceil(total / pageSize)
      }
    });
  } catch (err) {
    next(err);
  }
});

// 获取搜索建议
app.get('/api/products/suggestions', (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 1) return res.json([]);
    
    const searchTerm = q.toLowerCase();
    const suggestions = new Set();
    
    // 从产品名称中提取建议
    db.products.forEach(p => {
      if (p.name.toLowerCase().includes(searchTerm)) {
        suggestions.add(p.name);
      }
    });
    
    // 从分类中提取建议
    categories.forEach(c => {
      if (c.name.toLowerCase().includes(searchTerm)) {
        suggestions.add(c.name);
      }
      if (c.children) {
        c.children.forEach(child => {
          if (child.name.toLowerCase().includes(searchTerm)) {
            suggestions.add(child.name);
          }
        });
      }
    });
    
    res.json(Array.from(suggestions).slice(0, 10));
  } catch (err) {
    next(err);
  }
});

// 获取热门搜索词
app.get('/api/products/hot-searches', (req, res, next) => {
  try {
    // 预处理点赞计数
    const likeCountMap = {};
    db.likes.forEach(l => { likeCountMap[l.product_id] = (likeCountMap[l.product_id] || 0) + 1; });
    
    // 基于产品点赞数确定热门搜索词
    const productWithLikes = db.products.map(p => ({
      ...p,
      like_count: likeCountMap[p.id] || 0
    }));
    
    const hotProducts = productWithLikes
      .sort((a, b) => b.like_count - a.like_count)
      .slice(0, 10);
    
    res.json(hotProducts.map(p => p.name));
  } catch (err) {
    next(err);
  }
});
// 获取全局数据分析（管理员）
app.get('/api/admin/analytics', (req, res, next) => {
  try {
    // 预处理数据
    const userLikeCount = {};
    const userCommentCount = {};
    const productLikeCount = {};
    const productCommentCount = {};
    
    db.likes.forEach(l => {
      userLikeCount[l.user_id] = (userLikeCount[l.user_id] || 0) + 1;
      productLikeCount[l.product_id] = (productLikeCount[l.product_id] || 0) + 1;
    });
    db.comments.forEach(c => {
      userCommentCount[c.user_id] = (userCommentCount[c.user_id] || 0) + 1;
      productCommentCount[c.product_id] = (productCommentCount[c.product_id] || 0) + 1;
    });
    
    // 用户活跃度分布
    const activeUsers = Object.keys(userLikeCount).length;
    const activeCommenters = Object.keys(userCommentCount).length;
    const inactiveUsers = db.users.length - activeUsers;
    
    // 产品热度排行
    const productHeat = db.products.map(p => ({
      id: p.id,
      name: p.name,
      likes: productLikeCount[p.id] || 0,
      comments: productCommentCount[p.id] || 0,
      engagement: (productLikeCount[p.id] || 0) + (productCommentCount[p.id] || 0) * 2
    })).sort((a, b) => b.engagement - a.engagement).slice(0, 10);
    
    // 分类热度
    const categoryHeat = {};
    db.products.forEach(p => {
      if (!categoryHeat[p.category_id]) {
        categoryHeat[p.category_id] = { products: 0, likes: 0, comments: 0 };
      }
      categoryHeat[p.category_id].products++;
      categoryHeat[p.category_id].likes += productLikeCount[p.id] || 0;
      categoryHeat[p.category_id].comments += productCommentCount[p.id] || 0;
    });
    
    // 用户排行榜
    const topUsers = db.users.filter(u => !u.is_admin).map(u => ({
      username: u.username,
      likes: userLikeCount[u.id] || 0,
      comments: userCommentCount[u.id] || 0,
      score: (userLikeCount[u.id] || 0) + (userCommentCount[u.id] || 0) * 2
    })).sort((a, b) => b.score - a.score).slice(0, 10);
    
    // 时间分布（按小时）
    const hourDistribution = Array(24).fill(0);
    db.likes.forEach(l => {
      const hour = new Date(l.created_at).getHours();
      hourDistribution[hour]++;
    });
    db.comments.forEach(c => {
      const hour = new Date(c.created_at).getHours();
      hourDistribution[hour]++;
    });
    
    res.json({
      overview: {
        total_users: db.users.length,
        active_users: activeUsers,
        active_commenters: activeCommenters,
        inactive_users: inactiveUsers,
        total_products: db.products.length,
        total_likes: db.likes.length,
        total_comments: db.comments.length,
        total_favorites: db.favorites.length,
        avg_likes_per_user: (db.likes.length / db.users.length).toFixed(2),
        avg_comments_per_user: (db.comments.length / db.users.length).toFixed(2)
      },
      top_products: productHeat,
      top_users: topUsers,
      category_heatmap: categoryHeat,
      hour_distribution: hourDistribution.map((count, hour) => ({ hour, count }))
    });
  } catch (err) {
    next(err);
  }
});

// ==================== 分享链接追踪 ====================

const shareLinks = []; // 分享链接追踪数据
const SHARE_CODE_LENGTH = 8;

// 生成分享码
function generateShareCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < SHARE_CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 创建分享链接
app.post('/api/share', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    
    const { product_id, type = 'product' } = req.body;
    const shareCode = generateShareCode();
    
    const shareLink = {
      id: shareLinks.length + 1,
      code: shareCode,
      user_id: user.id,
      username: user.username,
      product_id: product_id ? parseInt(product_id) : null,
      type: type,
      created_at: new Date().toISOString(),
      clicks: 0,
      conversions: 0
    };
    
    shareLinks.push(shareLink);
    
    const baseUrl = req.headers.origin || 'https://likebox.vercel.app';
    res.json({
      success: true,
      code: shareCode,
      url: `${baseUrl}/share/${shareCode}`,
      short_code: shareCode
    });
  } catch (err) {
    next(err);
  }
});

// 解析分享链接
app.get('/api/share/:code', (req, res, next) => {
  try {
    const code = req.params.code;
    const shareLink = shareLinks.find(s => s.code === code);
    
    if (!shareLink) {
      // 尝试作为产品ID处理
      const productId = parseInt(code);
      if (!isNaN(productId)) {
        const product = db.products.find(p => p.id === productId);
        if (product) {
          return res.json({
            type: 'product',
            product: {
              id: product.id,
              name: product.name,
              image_url: product.image_url,
              description: product.description
            }
          });
        }
      }
      return res.status(404).json({ error: '分享链接不存在' });
    }
    
    // 增加点击数
    shareLink.clicks++;
    
    const result = {
      type: shareLink.type,
      shared_by: shareLink.username,
      created_at: shareLink.created_at,
      clicks: shareLink.clicks
    };
    
    if (shareLink.product_id) {
      const product = db.products.find(p => p.id === shareLink.product_id);
      if (product) {
        result.product = {
          id: product.id,
          name: product.name,
          image_url: product.image_url,
          description: product.description
        };
      }
    }
    
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 追踪转化（点赞/收藏/评论）
app.post('/api/share/:code/track', (req, res, next) => {
  try {
    const code = req.params.code;
    const shareLink = shareLinks.find(s => s.code === code);
    
    if (!shareLink) {
      return res.status(404).json({ error: '分享链接不存在' });
    }
    
    const { action, product_id } = req.body;
    
    // 记录转化
    if (action === 'like' || action === 'favorite' || action === 'comment') {
      shareLink.conversions++;
    }
    
    res.json({
      success: true,
      code: code,
      action: action,
      total_clicks: shareLink.clicks,
      total_conversions: shareLink.conversions
    });
  } catch (err) {
    next(err);
  }
});

// 获取我的分享统计
app.get('/api/share/stats', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.query.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    
    const myShares = shareLinks.filter(s => s.user_id === user.id);
    const totalClicks = myShares.reduce((sum, s) => sum + s.clicks, 0);
    const totalConversions = myShares.reduce((sum, s) => sum + s.conversions, 0);
    
    res.json({
      total_shares: myShares.length,
      total_clicks: totalClicks,
      total_conversions: totalConversions,
      conversion_rate: totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) + '%' : '0%',
      shares: myShares.map(s => ({
        code: s.code,
        type: s.type,
        product_id: s.product_id,
        clicks: s.clicks,
        conversions: s.conversions,
        created_at: s.created_at
      }))
    });
  } catch (err) {
    next(err);
  }
});

// ==================== 批量导入产品 ====================

// 批量添加产品（管理员）
app.post('/api/admin/products/batch', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    if (!user.is_admin) return res.status(403).json({ error: '需要管理员权限' });
    
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: '产品列表格式错误' });
    }
    
    if (products.length === 0) {
      return res.status(400).json({ error: '产品列表不能为空' });
    }
    
    if (products.length > 100) {
      return res.status(400).json({ error: '单次最多导入100个产品' });
    }
    
    const addedProducts = [];
    const errors = [];
    
    products.forEach((p, index) => {
      try {
        // 验证必填字段
        if (!p.name || !p.name.trim()) {
          errors.push({ index, error: '产品名称不能为空' });
          return;
        }
        
        const newProduct = {
          id: db.products.length + 1 + addedProducts.length,
          name: p.name.trim(),
          description: p.description || '',
          image_url: p.image_url || '',
          category_id: p.category_id || 401,
          tags: p.tags || '',
          price: parseFloat(p.price) || 0,
          created_at: new Date().toISOString()
        };
        
        db.products.push(newProduct);
        addedProducts.push(newProduct);
      } catch (e) {
        errors.push({ index, error: e.message });
      }
    });
    
    res.json({
      success: true,
      added_count: addedProducts.length,
      products: addedProducts,
      errors: errors
    });
  } catch (err) {
    next(err);
  }
});

// 批量删除产品（管理员）
app.delete('/api/admin/products/batch', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    if (!user.is_admin) return res.status(403).json({ error: '需要管理员权限' });
    
    const { product_ids } = req.body;
    if (!Array.isArray(product_ids) || product_ids.length === 0) {
      return res.status(400).json({ error: '产品ID列表格式错误' });
    }
    
    const idsToDelete = product_ids.map(id => parseInt(id));
    const originalCount = db.products.length;
    
    db.products = db.products.filter(p => !idsToDelete.includes(p.id));
    
    // 同时删除相关的点赞、评论、收藏
    db.likes = db.likes.filter(l => !idsToDelete.includes(l.product_id));
    db.comments = db.comments.filter(c => !idsToDelete.includes(c.product_id));
    db.favorites = db.favorites.filter(f => !idsToDelete.includes(f.product_id));
    
    const deletedCount = originalCount - db.products.length;
    
    res.json({
      success: true,
      deleted_count: deletedCount,
      remaining_products: db.products.length
    });
  } catch (err) {
    next(err);
  }
});

// 批量更新产品（管理员）
app.put('/api/admin/products/batch', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.body.username);
    if (!user) return res.status(401).json({ error: '请先登录' });
    if (!user.is_admin) return res.status(403).json({ error: '需要管理员权限' });
    
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: '更新列表格式错误' });
    }
    
    const updatedProducts = [];
    const errors = [];
    
    updates.forEach((u, index) => {
      try {
        if (!u.id) {
          errors.push({ index, error: '产品ID不能为空' });
          return;
        }
        
        const product = db.products.find(p => p.id === parseInt(u.id));
        if (!product) {
          errors.push({ index, error: '产品不存在' });
          return;
        }
        
        // 更新字段
        if (u.name !== undefined) product.name = u.name;
        if (u.description !== undefined) product.description = u.description;
        if (u.image_url !== undefined) product.image_url = u.image_url;
        if (u.category_id !== undefined) product.category_id = parseInt(u.category_id);
        if (u.tags !== undefined) product.tags = u.tags;
        if (u.price !== undefined) product.price = parseFloat(u.price);
        
        updatedProducts.push(product);
      } catch (e) {
        errors.push({ index, error: e.message });
      }
    });
    
    res.json({
      success: true,
      updated_count: updatedProducts.length,
      products: updatedProducts,
      errors: errors
    });
  } catch (err) {
    next(err);
  }
});

// ==================== 统一错误处理 ====================

// 数据验证错误处理
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: '数据验证失败', details: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: '无效的数据格式' });
  }
  next(err);
});

// ==================== 新增功能 ====================

// 热门产品 (Trending)
app.get('/api/trending', (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const likeCountMap = {};
    const commentCountMap = {};
    db.likes.forEach(l => { likeCountMap[l.product_id] = (likeCountMap[l.product_id] || 0) + 1; });
    db.comments.forEach(c => { commentCountMap[c.product_id] = (commentCountMap[c.product_id] || 0) + 1; });
    
    const trending = db.products.map(p => ({
      id: p.id,
      name: p.name,
      image_url: p.image_url,
      price: p.price,
      like_count: likeCountMap[p.id] || 0,
      comment_count: commentCountMap[p.id] || 0,
      score: ((likeCountMap[p.id] || 0) * 2) + ((commentCountMap[p.id] || 0) * 3)
    })).sort((a, b) => b.score - a.score).slice(0, limit);
    
    res.json(trending);
  } catch (err) {
    next(err);
  }
});

// 产品推荐 (基于分类热度)
app.get('/api/recommend', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.query.username);
    const limit = parseInt(req.query.limit) || 10;
    
    let preferredCategories = [];
    if (user) {
      const userLikes = db.likes.filter(l => l.user_id === user.id);
      const likedProducts = userLikes.map(l => db.products.find(p => p.id === l.product_id)).filter(p => p);
      const catCount = {};
      likedProducts.forEach(p => { catCount[p.category_id] = (catCount[p.category_id] || 0) + 1; });
      preferredCategories = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([cat]) => parseInt(cat));
    }
    
    const likeCountMap = {};
    db.likes.forEach(l => { likeCountMap[l.product_id] = (likeCountMap[l.product_id] || 0) + 1; });
    
    let products = db.products;
    if (preferredCategories.length > 0) {
      const preferred = products.filter(p => preferredCategories.includes(p.category_id));
      const others = products.filter(p => !preferredCategories.includes(p.category_id));
      const scored = others.map(p => ({ ...p, score: (likeCountMap[p.id] || 0) })).sort((a, b) => b.score - a.score);
      products = [...preferred, ...scored];
    }
    
    res.json(products.slice(0, limit).map(p => ({
      id: p.id, name: p.name, image_url: p.image_url, price: p.price,
      like_count: likeCountMap[p.id] || 0
    })));
  } catch (err) {
    next(err);
  }
});

// 用户活动时间线
app.get('/api/user/timeline', (req, res, next) => {
  try {
    const user = db.users.find(u => u.username === req.query.username);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    
    const userLikes = db.likes.filter(l => l.user_id === user.id).map(l => {
      const product = db.products.find(p => p.id === l.product_id);
      return { type: 'like', product, created_at: l.created_at };
    });
    
    const userComments = db.comments.filter(c => c.user_id === user.id).map(c => {
      const product = db.products.find(p => p.id === c.product_id);
      return { type: 'comment', product, content: c.content, created_at: c.created_at };
    });
    
    const timeline = [...userLikes, ...userComments]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);
    
    res.json(timeline);
  } catch (err) {
    next(err);
  }
});

// 每日精选
app.get('/api/daily', (req, res, next) => {
  try {
    const today = new Date().toDateString();
    const seed = today.split(' ').reduce((a, b) => a + b.charCodeAt(0), 0);
    const likeCountMap = {};
    db.likes.forEach(l => { likeCountMap[l.product_id] = (likeCountMap[l.product_id] || 0) + 1; });
    
    const products = db.products.map(p => ({ ...p, score: (likeCountMap[p.id] || 0) + Math.random() * 100 }));
    products.sort((a, b) => b.score - a.score);
    
    res.json({
      date: today,
      picks: products.slice(0, 5).map(p => ({ id: p.id, name: p.name, image_url: p.image_url, price: p.price }))
    });
  } catch (err) {
    next(err);
  }
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'API路由不存在' });
});

module.exports = app;
