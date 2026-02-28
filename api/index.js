const express = require('express');
const cors = require('cors');
const { kv } = require('@vercel/kv');

const app = express();
app.use(cors());
app.use(express.json());

const defaultData = {
  users: [
    { id: 1, username: 'demo', password: '123456', created_at: '2024-01-01T00:00:00.000Z' }
  ],
  categories: [
    { id: 1, name: '数码' }, { id: 2, name: '生活' }, { id: 3, name: '食品' },
    { id: 4, name: '服饰' }, { id: 5, name: '图书' }, { id: 6, name: '游戏' },
    { id: 7, name: '其他' }
  ],
  products: [
    { id: 1, name: 'iPhone 15 Pro', description: '钛金属设计，A17 Pro芯片，专业相机系统', image_url: 'https://picsum.photos/seed/iphone/400/300', product_url: 'https://www.apple.com/shop/buy-iphone/iphone-15-pro', category_id: 1, created_at: '2024-01-15T10:00:00.000Z' },
    { id: 2, name: 'MacBook Air M3', description: '轻薄便携，续航超长，M3芯片强劲性能', image_url: 'https://picsum.photos/seed/macbook/400/300', product_url: 'https://www.apple.com/shop/buy-mac/macbook-air-13-and-15-m3', category_id: 1, created_at: '2024-01-20T10:00:00.000Z' },
    { id: 3, name: 'AirPods Pro 2', description: '主动降噪，空间音频，MagSafe充电盒', image_url: 'https://picsum.photos/seed/airpods/400/300', product_url: 'https://www.apple.com/shop/product/MQXG3AM/A/airpods-pro-2nd-generation', category_id: 1, created_at: '2024-01-25T10:00:00.000Z' },
    { id: 4, name: '戴森吸尘器 V15', description: '强劲吸力，激光探测，LCD显示屏', image_url: 'https://picsum.photos/seed/dyson/400/300', product_url: '', category_id: 2, created_at: '2024-02-01T10:00:00.000Z' },
    { id: 5, name: 'SK-II 神仙水', description: '护肤精华液，改善肌肤状态的神器', image_url: 'https://picsum.photos/seed/sk2/400/300', product_url: '', category_id: 2, created_at: '2024-02-05T10:00:00.000Z' },
    { id: 6, name: '星巴克随行杯', description: '不锈钢保温杯，创意设计，环保又时尚', image_url: 'https://picsum.photos/seed/starbucks/400/300', product_url: '', category_id: 3, created_at: '2024-02-10T10:00:00.000Z' },
    { id: 7, name: 'Nintendo Switch', description: '家用掌机新概念，多人同乐必备', image_url: 'https://picsum.photos/seed/switch/400/300', product_url: 'https://www.nintendo.com/switch/', category_id: 6, created_at: '2024-02-15T10:00:00.000Z' },
    { id: 8, name: '索尼 PS5', description: '下一代游戏主机，4K画质，沉浸式体验', image_url: 'https://picsum.photos/seed/ps5/400/300', product_url: 'https://www.playstation.com/ps5/', category_id: 6, created_at: '2024-02-20T10:00:00.000Z' },
    { id: 9, name: '《三体》全套', description: '刘慈欣科幻巨著，值得反复阅读', image_url: 'https://picsum.photos/seed/santi/400/300', product_url: '', category_id: 5, created_at: '2024-02-25T10:00:00.000Z' },
    { id: 10, name: 'lululemon瑜伽裤', description: '高弹面料，舒适透气，时尚运动风', image_url: 'https://picsum.photos/seed/lulu/400/300', product_url: '', category_id: 4, created_at: '2024-03-01T10:00:00.000Z' },
    { id: 11, name: 'Air Jordan 1', description: '经典篮球鞋，潮流百搭神器', image_url: 'https://picsum.photos/seed/jordan/400/300', product_url: '', category_id: 4, created_at: '2024-03-05T10:00:00.000Z' },
    { id: 12, name: 'Apple Watch S9', description: '智能手表，健康监测，时尚配件', image_url: 'https://picsum.photos/seed/watch/400/300', product_url: 'https://www.apple.com/watch/', category_id: 1, created_at: '2024-03-10T10:00:00.000Z' }
  ],
  likes: [
    { id: 1, user_id: 1, product_id: 1, created_at: '2024-01-16T10:00:00.000Z' },
    { id: 2, user_id: 1, product_id: 7, created_at: '2024-01-17T10:00:00.000Z' },
    { id: 3, user_id: 1, product_id: 8, created_at: '2024-01-18T10:00:00.000Z' }
  ],
  comments: [
    { id: 1, user_id: 1, product_id: 1, content: '真的很棒！', created_at: '2024-01-16T10:00:00.000Z' },
    { id: 2, user_id: 1, product_id: 7, content: '塞尔达传说太好玩了！', created_at: '2024-01-17T10:00:00.000Z' },
    { id: 3, user_id: 1, product_id: 9, content: '三体世界观太震撼了', created_at: '2024-01-18T10:00:00.000Z' }
  ],
  nextIds: { users: 2, products: 13, likes: 4, comments: 4 }
};

let db;
let useKV = false;

async function initDB() {
  try {
    const data = await kv.get('likebox_data');
    if (data) {
      db = data;
      useKV = true;
      console.log('Using Vercel KV storage');
    } else {
      db = defaultData;
      await kv.set('likebox_data', db);
      useKV = true;
      console.log('Initialized data in Vercel KV');
    }
  } catch (e) {
    console.log('KV not available, using in-memory:', e.message);
    db = { ...defaultData };
  }
}

async function saveDB() {
  if (useKV) {
    try {
      await kv.set('likebox_data', db);
    } catch (e) {
      console.log('Save to KV failed:', e.message);
    }
  }
}

function genId(type) {
  const id = db.nextIds[type]++;
  return id;
}

let initPromise = initDB();

app.use(async (req, res, next) => {
  await initPromise;
  next();
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ error: '用户名已存在' });
  }
  const user = { id: genId('users'), username, password, created_at: new Date().toISOString() };
  db.users.push(user);
  await saveDB();
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

app.post('/api/products', async (req, res) => {
  const { name, description, image_url, product_url, category_id } = req.body;
  const product = { 
    id: genId('products'), 
    name, 
    description, 
    image_url: image_url || null, 
    product_url: product_url || null,
    category_id, 
    created_at: new Date().toISOString() 
  };
  db.products.push(product);
  await saveDB();
  res.json({ ...product, like_count: 0, is_liked: false });
});

app.post('/api/products/:id/like', async (req, res) => {
  const { username } = req.body;
  const productId = parseInt(req.params.id);
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const idx = db.likes.findIndex(l => l.user_id === user.id && l.product_id === productId);
  if (idx >= 0) db.likes.splice(idx, 1);
  else db.likes.push({ id: genId('likes'), user_id: user.id, product_id: productId, created_at: new Date().toISOString() });
  
  await saveDB();
  res.json({ liked: idx < 0, count: db.likes.filter(l => l.product_id === productId).length });
});

app.get('/api/products/:id/comments', (req, res) => {
  const productId = parseInt(req.params.id);
  res.json(db.comments.filter(c => c.product_id === productId).map(c => ({ ...c, username: db.users.find(u => u.id === c.user_id)?.username || '未知' })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

app.post('/api/comments', async (req, res) => {
  const { product_id, content, username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const comment = { id: genId('comments'), user_id: user.id, product_id, content, created_at: new Date().toISOString() };
  db.comments.push(comment);
  await saveDB();
  res.json({ ...comment, username: user.username });
});

module.exports = app;
