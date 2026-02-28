const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const categories = [
  { id: 1, name: '数码', children: [
    { id: 101, name: '手机', children: [{ id: 10101, name: '智能手机' }] },
    { id: 102, name: '电脑', children: [{ id: 10201, name: '笔记本电脑' }] },
    { id: 103, name: '耳机', children: [{ id: 10301, name: '蓝牙耳机' }] }
  ]},
  { id: 2, name: '运动', children: [
    { id: 201, name: '跑步', children: [{ id: 20101, name: '跑鞋' }] }
  ]},
  { id: 3, name: '食品', children: [
    { id: 301, name: '饮料', children: [{ id: 30101, name: '咖啡' }] }
  ]},
  { id: 4, name: '服饰', children: [
    { id: 401, name: 'T恤', children: [{ id: 40101, name: '纯棉T恤' }] },
    { id: 402, name: '外套', children: [{ id: 40201, name: '夹克' }] }
  ]},
  { id: 5, name: '图书', children: [
    { id: 501, name: '小说', children: [] }
  ]},
  { id: 6, name: '电子产品', children: [
    { id: 601, name: '配件', children: [] }
  ]},
  { id: 7, name: '美妆', children: [
    { id: 701, name: '护肤品', children: [] }
  ]},
  { id: 8, name: '家居', children: [
    { id: 801, name: '家具', children: [] }
  ]}
];

// Fetch products from Fake Store API
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

// Map to our format
function mapProducts(fakeProducts) {
  const categoryMap = {
    "men's clothing": 401,
    "women's clothing": 402,
    "jewelery": 701,
    "electronics": 601
  };
  
  return fakeProducts.map((p, i) => ({
    id: i + 1,
    name: p.title,
    description: `$${p.price} - Rating: ${p.rating.rate}/5 (${p.rating.count} reviews)`,
    image_url: p.image,
    product_url: '',
    category_id: categoryMap[p.category] || 401,
    tags: p.category,
    like_count: Math.floor(p.rating.count * Math.random()),
    created_at: new Date(2024, 0, 1 + i).toISOString()
  }));
}

const products = mapProducts(fakeStoreProducts);

const defaultData = {
  brands: [],
  users: [{ id: 1, username: 'demo', password: '123456', is_admin: true, avatar: '', bio: '演示账号', created_at: '2024-01-01T00:00:00.000Z' }],
  categories: categories,
  products: products,
  likes: [],
  comments: [],
  favorites: [],
  nextIds: { users: 2, products: products.length + 1 }
};

let db = { ...defaultData };

function genId(type) { const id = db.nextIds[type]++; return id; }

app.get('/api/products', (req, res) => {
  let products = db.products.map(p => ({ ...p }));
  const { search, category_id, limit } = req.query;
  if (search) { const s = search.toLowerCase(); products = products.filter(p => p.name.toLowerCase().includes(s) || p.tags?.toLowerCase().includes(s)); }
  if (category_id) { products = products.filter(p => p.category_id === parseInt(category_id)); }
  res.json(products.slice(0, parseInt(limit) || 50));
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: '产品不存在' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { username, name, description, image_url, category_id, tags } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const product = { id: genId('products'), user_id: user.id, name, description, image_url, category_id: parseInt(category_id), tags, created_at: new Date().toISOString() };
  db.products.push(product);
  res.json(product);
});

app.post('/api/products/:id/like', (req, res) => {
  const { username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  res.json({ liked: true });
});

app.get('/api/favorites', (req, res) => res.json([]));
app.post('/api/favorites', (req, res) => res.json({ favorited: true }));
app.get('/api/products/:id/comments', (req, res) => res.json([]));
app.post('/api/comments', (req, res) => res.json({ success: true }));

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
  const products = db.products.filter(p => p.category_id === category.id);
  res.json({ ...category, products });
});

app.get('/api/brands', (req, res) => res.json(db.brands));
app.get('/api/weekly', (req, res) => res.json(db.products.slice(0, 6)));
app.get('/api/leaderboard', (req, res) => res.json([{ username: 'demo', score: 100 }]));
app.get('/api/ranking', (req, res) => res.json(db.products));
app.get('/api/user/:username', (req, res) => {
  const user = db.users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json({ id: user.id, username: user.username, avatar: user.avatar, bio: user.bio, is_admin: user.is_admin });
});
app.post('/api/checkin', (req, res) => res.json({ success: true, points: 10 }));
app.get('/api/checkin', (req, res) => res.json({ checked: false, days: 0 }));
app.get('/api/points', (req, res) => res.json({ points: 0, level: 1 }));
app.get('/api/compare', (req, res) => {
  const { ids } = req.query;
  if (!ids) return res.json([]);
  const productIds = ids.split(',').map(id => parseInt(id));
  res.json(productIds.map(id => db.products.find(p => p.id === id)).filter(p => p));
});
app.get('/api/admin/stats', (req, res) => res.json({ total_users: 1, total_products: products.length, total_likes: 0 }));

module.exports = app;
