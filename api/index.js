const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const defaultData = {
  brands: [],
  users: [
    { id: 1, username: 'demo', password: '123456', is_admin: true, avatar: '', bio: '演示账号', created_at: '2024-01-01T00:00:00.000Z' }
  ],
  categories: [
    { id: 1, name: '数码', children: [
      { id: 101, name: '手机', children: [{ id: 10101, name: '智能手机' }, { id: 10102, name: '老人机' }] },
      { id: 102, name: '电脑', children: [{ id: 10201, name: '笔记本电脑' }, { id: 10202, name: '台式机' }] },
      { id: 103, name: '耳机', children: [{ id: 10301, name: '蓝牙耳机' }, { id: 10302, name: '头戴式耳机' }] }
    ]},
    { id: 2, name: '运动', children: [
      { id: 201, name: '跑步', children: [{ id: 20101, name: '跑鞋' }, { id: 20102, name: '运动服' }] },
      { id: 202, name: '瑜伽', children: [{ id: 20201, name: '瑜伽垫' }, { id: 20202, name: '瑜伽服' }] }
    ]},
    { id: 3, name: '食品', children: [
      { id: 301, name: '饮料', children: [{ id: 30101, name: '咖啡' }, { id: 30102, name: '茶' }] }
    ]},
    { id: 4, name: '服饰', children: [
      { id: 401, name: 'T恤', children: [{ id: 40101, name: '纯棉T恤' }] },
      { id: 402, name: '裤子', children: [{ id: 40201, name: '牛仔裤' }] }
    ]},
    { id: 5, name: '图书', children: [
      { id: 501, name: '小说', children: [] },
      { id: 502, name: '教育', children: [{ id: 50201, name: '英语' }] }
    ]},
    { id: 6, name: '游戏', children: [
      { id: 601, name: '主机', children: [{ id: 60101, name: 'Switch' }, { id: 60102, name: 'PS5' }] }
    ]},
    { id: 7, name: '美妆', children: [
      { id: 701, name: '护肤品', children: [{ id: 70101, name: '面霜' }] }
    ]},
    { id: 9, name: '家居', children: [
      { id: 901, name: '家具', children: [{ id: 90101, name: '床' }] },
      { id: 902, name: '小家电', children: [{ id: 90201, name: '香薰机' }] }
    ]},
    { id: 10, name: '汽车', children: [] }
  ],
  products: [],
  likes: [],
  comments: [],
  comment_likes: [],
  ratings: [],
  favorites: [],
  reports: [],
  notifications: [],
  follows: [],
  history: [],
  nextIds: { users: 2, brands: 1, products: 1, likes: 1, comments: 1 }
};

let db = { ...defaultData };

function genId(type) {
  const id = db.nextIds[type]++;
  return id;
}

function flattenCategories(categories, parentId = null) {
  let result = [];
  categories.forEach(cat => {
    result.push({ id: cat.id, name: cat.name, parent_id: parentId });
    if (cat.children && cat.children.length > 0) {
      result = result.concat(flattenCategories(cat.children, cat.id));
    }
  });
  return result;
}

// Products
app.get('/api/products', (req, res) => {
  let products = db.products.map(p => ({
    ...p,
    like_count: db.likes.filter(l => l.product_id === p.id).length,
    comment_count: db.comments.filter(c => c.product_id === p.id).length,
    is_liked: false,
    is_favorited: false
  }));
  const { search, category_id, brand_id } = req.query;
  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(s) || p.tags?.toLowerCase().includes(s));
  }
  if (category_id) {
    const targetId = parseInt(category_id);
    const getChildIds = (cats, pid) => {
      let ids = [pid];
      cats.forEach(c => {
        if (c.id === pid && c.children) {
          c.children.forEach(child => ids = ids.concat(getChildIds(cats, child.id)));
        }
        if (c.children) c.children.forEach(child => { if (child.id === pid) ids = ids.concat(getChildIds(c.children, child.id)); });
      });
      return ids;
    };
    const allIds = getChildIds(db.categories, targetId);
    products = products.filter(p => allIds.includes(p.category_id));
  }
  if (brand_id) products = products.filter(p => p.brand_id === parseInt(brand_id));
  res.json(products.sort((a, b) => b.like_count - a.like_count));
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: '产品不存在' });
  const likes = db.likes.filter(l => l.product_id === product.id);
  const comments = db.comments.filter(c => c.product_id === product.id).map(c => {
    const user = db.users.find(u => u.id === c.user_id);
    return { ...c, username: user?.username, like_count: 0, is_liked: false, replies: [] };
  });
  res.json({ ...product, like_count: likes.length, comment_count: comments.length, comments });
});

app.post('/api/products', (req, res) => {
  const { username, name, description, image_url, product_url, category_id, tags } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const product = { id: genId('products'), user_id: user.id, name, description, image_url, product_url, category_id: parseInt(category_id), tags, created_at: new Date().toISOString() };
  db.products.push(product);
  res.json(product);
});

// Like
app.post('/api/products/:id/like', (req, res) => {
  const { username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const productId = parseInt(req.params.id);
  const existing = db.likes.find(l => l.user_id === user.id && l.product_id === productId);
  if (existing) {
    db.likes = db.likes.filter(l => l !== existing);
    res.json({ liked: false });
  } else {
    db.likes.push({ id: genId('likes'), user_id: user.id, product_id: productId, created_at: new Date().toISOString() });
    res.json({ liked: true });
  }
});

// Favorites
app.get('/api/favorites', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json([]);
  const favs = db.favorites.filter(f => f.user_id === user.id).map(f => {
    const p = db.products.find(p => p.id === f.product_id);
    return p ? { ...p, like_count: db.likes.filter(l => l.product_id === p.id).length } : null;
  }).filter(p => p);
  res.json(favs);
});

app.post('/api/favorites', (req, res) => {
  const { username, product_id } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const existing = db.favorites.find(f => f.user_id === user.id && f.product_id === parseInt(product_id));
  if (existing) {
    db.favorites = db.favorites.filter(f => f !== existing);
    res.json({ favorited: false });
  } else {
    db.favorites.push({ id: 1, user_id: user.id, product_id: parseInt(product_id), created_at: new Date().toISOString() });
    res.json({ favorited: true });
  }
});

// Comments
app.get('/api/products/:id/comments', (req, res) => {
  const comments = db.comments.filter(c => c.product_id === parseInt(req.params.id)).map(c => {
    const user = db.users.find(u => u.id === c.user_id);
    return { ...c, username: user?.username };
  });
  res.json(comments);
});

app.post('/api/comments', (req, res) => {
  const { product_id, content, username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const comment = { id: genId('comments'), user_id: user.id, product_id: parseInt(product_id), content, created_at: new Date().toISOString() };
  db.comments.push(comment);
  res.json({ ...comment, username: user.username, like_count: 0, is_liked: false, replies: [] });
});

// Auth
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (db.users.find(u => u.username === username)) return res.status(400).json({ error: '用户名已存在' });
  const user = { id: genId('users'), username, password, is_admin: false, avatar: '', bio: '', created_at: new Date().toISOString() };
  db.users.push(user);
  res.json({ success: true, username: user.username });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: '用户名或密码错误' });
  res.json({ username: user.username, is_admin: user.is_admin, avatar: user.avatar });
});

// Categories
app.get('/api/categories', (req, res) => res.json(db.categories));

app.get('/api/categories/:id', (req, res) => {
  const targetId = parseInt(req.params.id);
  const findCategory = (cats, id) => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children) { const found = findCategory(cat.children, id); if (found) return found; }
    }
    return null;
  };
  const category = findCategory(db.categories, targetId);
  if (!category) return res.status(404).json({ error: '分类不存在' });
  const getAllProductIds = (cat) => { let ids = [cat.id]; if (cat.children) cat.children.forEach(child => ids = ids.concat(getAllProductIds(child))); return ids; };
  const allIds = getAllProductIds(category);
  const products = db.products.filter(p => allIds.includes(p.category_id)).map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length }));
  res.json({ ...category, products });
});

// Brands
app.get('/api/brands', (req, res) => res.json(db.brands));

// Weekly top
app.get('/api/weekly', (req, res) => {
  const products = db.products.map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length })).sort((a, b) => b.like_count - a.like_count).slice(0, 6);
  res.json(products);
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const users = db.users.map(u => ({
    username: u.username,
    products: db.products.filter(p => p.user_id === u.id).length,
    likes: db.likes.filter(l => l.user_id === u.id).length,
    comments: db.comments.filter(c => c.user_id === u.id).length,
    score: db.products.filter(p => p.user_id === u.id).length * 2 + db.likes.filter(l => l.user_id === u.id).length + db.comments.filter(c => c.user_id === u.id).length
  })).sort((a, b) => b.score - a.score).slice(0, 20);
  res.json(users);
});

// Ranking
app.get('/api/ranking', (req, res) => {
  const products = db.products.map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length })).sort((a, b) => b.like_count - a.like_count);
  res.json(products);
});

// User
app.get('/api/user/:username', (req, res) => {
  const user = db.users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json({ id: user.id, username: user.username, avatar: user.avatar, bio: user.bio, created_at: user.created_at, is_admin: user.is_admin, points: user.points || 0 });
});

// Check-in
app.post('/api/checkin', (req, res) => {
  const { username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const today = new Date().toDateString();
  if (user.last_checkin === today) return res.json({ success: false, message: '今日已签到', points: user.points || 0 });
  user.points = (user.points || 0) + 10;
  user.last_checkin = today;
  user.checkin_days = (user.checkin_days || 0) + 1;
  res.json({ success: true, points: 10, total: user.points, days: user.checkin_days });
});

app.get('/api/checkin', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json({ checked: false, days: 0 });
  const today = new Date().toDateString();
  res.json({ checked: user.last_checkin === today, days: user.checkin_days || 0 });
});

// Points
app.get('/api/points', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json({ points: 0, level: 1 });
  res.json({ points: user.points || 0, level: Math.floor((user.points || 0) / 100) + 1 });
});

// Compare
app.get('/api/compare', (req, res) => {
  const { ids } = req.query;
  if (!ids) return res.json([]);
  const productIds = ids.split(',').map(id => parseInt(id));
  const products = productIds.map(id => db.products.find(p => p.id === id)).filter(p => p).map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length }));
  res.json(products);
});

// Admin stats
app.get('/api/admin/stats', (req, res) => {
  res.json({ total_users: db.users.length, total_products: db.products.length, total_likes: db.likes.length, total_comments: db.comments.length });
});

module.exports = app;
