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
  created_at: new Date(2024, 0, 1 + i).toISOString()
}));

const users = generateUsers();

const likes = [];
const comments = [];
const favorites = [];

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

const defaultData = {
  brands: [],
  users: users,
  categories: categories,
  products: products,
  likes: likes,
  comments: comments,
  favorites: favorites,
  nextIds: { users: users.length + 1, products: products.length + 1 }
};

let db = { ...defaultData };

app.get('/api/products', (req, res) => {
  let result = db.products.map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length, comment_count: db.comments.filter(c => c.product_id === p.id).length }));
  if (req.query.search) { const s = req.query.search.toLowerCase(); result = result.filter(p => p.name.toLowerCase().includes(s)); }
  if (req.query.category_id) result = result.filter(p => p.category_id === parseInt(req.query.category_id));
  res.json(result.slice(0, parseInt(req.query.limit) || 50));
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: '产品不存在' });
  const productComments = db.comments.filter(c => c.product_id === product.id).map(c => { const user = db.users.find(u => u.id === c.user_id); return { ...c, username: user?.username }; });
  res.json({ ...product, like_count: db.likes.filter(l => l.product_id === product.id).length, comments: productComments });
});

app.post('/api/products/:id/like', (req, res) => {
  const user = db.users.find(u => u.username === req.body.username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const pid = parseInt(req.params.id);
  const existing = db.likes.find(l => l.user_id === user.id && l.product_id === pid);
  if (existing) { db.likes = db.likes.filter(l => l !== existing); res.json({ liked: false }); }
  else { db.likes.push({ id: db.likes.length + 1, user_id: user.id, product_id: pid, created_at: new Date().toISOString() }); res.json({ liked: true }); }
});

app.get('/api/favorites', (req, res) => {
  const user = db.users.find(u => u.username === req.query.username);
  if (!user) return res.json([]);
  res.json(db.favorites.filter(f => f.user_id === user.id).map(f => db.products.find(p => p.id === f.product_id)).filter(p => p));
});

app.post('/api/favorites', (req, res) => {
  const user = db.users.find(u => u.username === req.body.username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const pid = parseInt(req.body.product_id);
  const existing = db.favorites.find(f => f.user_id === user.id && f.product_id === pid);
  if (existing) { db.favorites = db.favorites.filter(f => f !== existing); res.json({ favorited: false }); }
  else { db.favorites.push({ id: db.favorites.length + 1, user_id: user.id, product_id: pid, created_at: new Date().toISOString() }); res.json({ favorited: true }); }
});

app.get('/api/products/:id/comments', (req, res) => res.json(db.comments.filter(c => c.product_id === parseInt(req.params.id)).map(c => { const user = db.users.find(u => u.id === c.user_id); return { ...c, username: user?.username }; })));

app.post('/api/comments', (req, res) => {
  const user = db.users.find(u => u.username === req.body.username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const comment = { id: db.comments.length + 1, user_id: user.id, product_id: parseInt(req.body.product_id), content: req.body.content, created_at: new Date().toISOString() };
  db.comments.push(comment);
  res.json({ ...comment, username: user.username });
});

app.post('/api/register', (req, res) => {
  if (db.users.find(u => u.username === req.body.username)) return res.status(400).json({ error: '用户名已存在' });
  const user = { id: db.users.length + 1, username: req.body.username, password: req.body.password, is_admin: false, avatar: '', bio: '', created_at: new Date().toISOString() };
  db.users.push(user);
  res.json({ success: true, username: user.username });
});

app.post('/api/login', (req, res) => {
  const user = db.users.find(u => u.username === req.body.username && u.password === req.body.password);
  if (!user) return res.status(401).json({ error: '用户名或密码错误' });
  res.json({ username: user.username, is_admin: user.is_admin, avatar: user.avatar });
});

app.get('/api/categories', (req, res) => res.json(categories));
app.get('/api/brands', (req, res) => res.json([]));

app.get('/api/categories/:id', (req, res) => {
  const cid = parseInt(req.params.id);
  const products = db.products.filter(p => p.category_id === cid).map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length }));
  res.json({ id: cid, products });
});

app.get('/api/weekly', (req, res) => res.json(db.products.slice(0, 6)));

app.get('/api/leaderboard', (req, res) => {
  const lb = db.users.filter(u => !u.is_admin).map(u => ({ username: u.username, score: db.likes.filter(l => l.user_id === u.id).length + db.comments.filter(c => c.user_id === u.id).length * 2 })).sort((a, b) => b.score - a.score).slice(0, 20);
  res.json(lb);
});

app.get('/api/ranking', (req, res) => res.json(db.products.map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length })).sort((a, b) => b.like_count - a.like_count)));

app.get('/api/user/:username', (req, res) => {
  const user = db.users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json({ id: user.id, username: user.username, avatar: user.avatar, bio: user.bio, is_admin: user.is_admin, points: user.points, checkin_days: user.checkin_days });
});

app.post('/api/checkin', (req, res) => {
  const user = db.users.find(u => u.username === req.body.username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  if (user.last_checkin === new Date().toDateString()) return res.json({ success: false, message: '今日已签到' });
  user.points = (user.points || 0) + 10;
  user.last_checkin = new Date().toDateString();
  user.checkin_days = (user.checkin_days || 0) + 1;
  res.json({ success: true, points: 10, total: user.points, days: user.checkin_days });
});

app.get('/api/checkin', (req, res) => {
  const user = db.users.find(u => u.username === req.query.username);
  if (!user) return res.json({ checked: false, days: 0 });
  res.json({ checked: user.last_checkin === new Date().toDateString(), days: user.checkin_days || 0 });
});

app.get('/api/points', (req, res) => {
  const user = db.users.find(u => u.username === req.query.username);
  if (!user) return res.json({ points: 0, level: 1 });
  res.json({ points: user.points || 0, level: Math.floor((user.points || 0) / 100) + 1 });
});

app.get('/api/compare', (req, res) => {
  if (!req.query.ids) return res.json([]);
  const ids = req.query.ids.split(',').map(id => parseInt(id));
  res.json(ids.map(id => db.products.find(p => p.id === id)).filter(p => p));
});

app.get('/api/admin/stats', (req, res) => res.json({ total_users: db.users.length, total_products: db.products.length, total_likes: db.likes.length, total_comments: db.comments.length }));

module.exports = app;
