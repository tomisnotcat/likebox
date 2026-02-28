const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 内存存储（服务器less环境数据不持久，重启会丢失）
let db = {
  users: [],
  categories: [
    { id: 1, name: '数码' }, { id: 2, name: '生活' }, { id: 3, name: '食品' },
    { id: 4, name: '服饰' }, { id: 5, name: '图书' }, { id: 6, name: '游戏' },
    { id: 7, name: '其他' }
  ],
  products: [],
  likes: [],
  comments: []
};

function genId(arr) {
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ error: '用户名已存在' });
  }
  const user = { id: genId(db.users), username, password, created_at: new Date().toISOString() };
  db.users.push(user);
  res.json({ id: user.id, username: user.username });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: '用户名或密码错误' });
  res.json({ user_id: user.id, username: user.username });
});

app.get('/api/categories', (req, res) => res.json(db.categories));

app.get('/api/products', (req, res) => {
  const { category_id, search, sort, username } = req.query;
  let products = [...db.products];
  if (category_id) products = products.filter(p => p.category_id == category_id);
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  
  products = products.map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length }));
  if (sort === 'popular') products.sort((a, b) => b.like_count - a.like_count);
  else products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  let userId = username ? db.users.find(u => u.username === username)?.id : null;
  res.json(products.map(p => ({ ...p, is_liked: userId ? db.likes.some(l => l.user_id === userId && l.product_id === p.id) : false })));
});

app.post('/api/products', (req, res) => {
  const { name, description, image_url, category_id } = req.body;
  const product = { id: genId(db.products), name, description, image_url: image_url || null, category_id, created_at: new Date().toISOString() };
  db.products.push(product);
  res.json({ ...product, like_count: 0, is_liked: false });
});

app.post('/api/products/:id/like', (req, res) => {
  const { username } = req.body;
  const productId = parseInt(req.params.id);
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const idx = db.likes.findIndex(l => l.user_id === user.id && l.product_id === productId);
  if (idx >= 0) db.likes.splice(idx, 1);
  else db.likes.push({ id: genId(db.likes), user_id: user.id, product_id: productId, created_at: new Date().toISOString() });
  
  res.json({ liked: idx < 0, count: db.likes.filter(l => l.product_id === productId).length });
});

app.get('/api/products/:id/comments', (req, res) => {
  const productId = parseInt(req.params.id);
  res.json(db.comments.filter(c => c.product_id === productId).map(c => ({ ...c, username: db.users.find(u => u.id === c.user_id)?.username || '未知' })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

app.post('/api/comments', (req, res) => {
  const { product_id, content, username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const comment = { id: genId(db.comments), user_id: user.id, product_id, content, created_at: new Date().toISOString() };
  db.comments.push(comment);
  res.json({ ...comment, username: user.username });
});

module.exports = app;
