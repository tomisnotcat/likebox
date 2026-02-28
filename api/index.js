const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const categories = [
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
    { id: 301, name: '饮料', children: [{ id: 30101, name: '咖啡' }, { id: 30102, name: '茶' }] },
    { id: 302, name: '零食', children: [{ id: 30201, name: '坚果' }, { id: 30202, name: '饼干' }] }
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
];

const brandLogos = {
  'Apple': 'https://logo.clearbit.com/apple.com',
  'Samsung': 'https://logo.clearbit.com/samsung.com',
  'Huawei': 'https://logo.clearbit.com/huawei.com',
  'Xiaomi': 'https://logo.clearbit.com/xiaomi.com',
  'OPPO': 'https://logo.clearbit.com/oppo.com',
  'vivo': 'https://logo.clearbit.com/vivo.com',
  'Sony': 'https://logo.clearbit.com/sony.com',
  'Nike': 'https://logo.clearbit.com/nike.com',
  'Adidas': 'https://logo.clearbit.com/adidas.com',
  'Puma': 'https://logo.clearbit.com/puma.com',
  'NewBalance': 'https://logo.clearbit.com/newbalance.com',
  'UnderArmour': 'https://logo.clearbit.com/underarmour.com',
  'IKEA': 'https://logo.clearbit.com/ikea.com',
  'MUJI': 'https://logo.clearbit.com/muji.com',
  'Zara': 'https://logo.clearbit.com/zara.com',
  'HM': 'https://logo.clearbit.com/hm.com',
  'Uniqlo': 'https://logo.clearbit.com/uniqlo.com',
  'Starbucks': 'https://logo.clearbit.com/starbucks.com',
  'Tesla': 'https://logo.clearbit.com/tesla.com',
  'BYD': 'https://logo.clearbit.com/byd.com',
  'NIO': 'https://logo.clearbit.com/nio.com',
  'LiAuto': 'https://logo.clearbit.com/lixiang.com',
  'BMW': 'https://logo.clearbit.com/bmw.com',
  'Mercedes': 'https://logo.clearbit.com/mercedes-benz.com'
};

function generateProducts() {
  const products = [];
  const brands = Object.keys(brandLogos);
  const types = ['手机', '电脑', '平板', '耳机', '手表', '音箱', '相机', '键盘', '鼠标', '显示器', '充电宝', '数据线', '充电器', '跑鞋', '运动鞋', '瑜伽垫', 'T恤', '裤子', '外套', '咖啡', '茶', '零食', '坚果', '小说', '教材', '游戏', '主机', '面霜', '口红', '香水', '床', '沙发', '桌子', '椅子', '净化器', '汽车'];
  const features = ['高性能', '高品质', '超薄', '轻便', '耐用', '时尚', '经典', '智能', '便携', '专业'];
  
  let id = 1;
  for (let i = 0; i < 3000; i++) {
    const brand = brands[i % brands.length];
    const type = types[i % types.length];
    const feature = features[i % features.length];
    
    const name = `${brand} ${type} ${Math.floor(i / brands.length) + 1}`;
    const description = `${feature}的${type}，品质保证`;
    
    // Get category based on type
    let categoryId = 1;
    if (['手机', '电脑', '平板', '耳机', '手表', '相机'].includes(type)) categoryId = 101;
    else if (['跑鞋', '运动鞋', '瑜伽垫'].includes(type)) categoryId = 20101;
    else if (['T恤', '裤子', '外套'].includes(type)) categoryId = 401;
    else if (['咖啡', '茶', '零食', '坚果'].includes(type)) categoryId = 301;
    else if (['小说', '教材'].includes(type)) categoryId = 501;
    else if (['游戏', '主机'].includes(type)) categoryId = 601;
    else if (['面霜', '口红', '香水'].includes(type)) categoryId = 70101;
    else if (['床', '沙发', '桌子', '椅子'].includes(type)) categoryId = 901;
    else if (type === '汽车') categoryId = 1001;
    else categoryId = 1 + (i % 10);
    
    products.push({
      id: id++,
      name: name,
      description: description,
      image_url: brandLogos[brand] || 'https://via.placeholder.com/400x300?text=Product',
      product_url: '',
      category_id: categoryId,
      tags: `${type},${brand}`,
      created_at: new Date(2024, 0, 1 + (i % 365)).toISOString()
    });
  }
  
  return products;
}

const defaultData = {
  brands: Object.entries(brandLogos).map(([name, logo], i) => ({ id: i+1, name, logo, description: name })),
  users: [{ id: 1, username: 'demo', password: '123456', is_admin: true, avatar: '', bio: '演示账号', created_at: '2024-01-01T00:00:00.000Z' }],
  categories: categories,
  products: generateProducts(),
  likes: [],
  comments: [],
  favorites: [],
  nextIds: { users: 2, products: 3001 }
};

let db = { ...defaultData };

function genId(type) {
  const id = db.nextIds[type]++;
  return id;
}

// Products
app.get('/api/products', (req, res) => {
  let products = db.products.map(p => ({
    ...p,
    like_count: Math.floor(Math.random() * 1000),
    comment_count: Math.floor(Math.random() * 100)
  }));
  const { search, category_id, limit } = req.query;
  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(s) || p.tags?.toLowerCase().includes(s));
  }
  if (category_id) {
    products = products.filter(p => p.category_id === parseInt(category_id));
  }
  const maxResults = parseInt(limit) || 50;
  res.json(products.slice(0, maxResults));
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: '产品不存在' });
  res.json({ ...product, like_count: Math.floor(Math.random() * 1000), comment_count: Math.floor(Math.random() * 100) });
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
  const products = db.products.filter(p => p.category_id === category.id).slice(0, 50).map(p => ({ ...p, like_count: Math.floor(Math.random() * 1000) }));
  res.json({ ...category, products });
});

app.get('/api/brands', (req, res) => res.json(db.brands));
app.get('/api/weekly', (req, res) => res.json(db.products.slice(0, 6)));
app.get('/api/leaderboard', (req, res) => res.json([{ username: 'demo', score: 100 }]));
app.get('/api/ranking', (req, res) => res.json(db.products.slice(0, 50).map(p => ({ ...p, like_count: Math.floor(Math.random() * 1000) }))));
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
app.get('/api/admin/stats', (req, res) => res.json({ total_users: 1, total_products: 3000, total_likes: 0 }));

module.exports = app;
