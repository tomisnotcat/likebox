const express = require('express');
const cors = require('cors');
const { kv } = require('@vercel/kv');

const app = express();
app.use(cors());
app.use(express.json());

const defaultData = {
  users: [
    { id: 1, username: 'demo', password: '123456', is_admin: true, created_at: '2024-01-01T00:00:00.000Z' }
  ],
  categories: [
    { id: 1, name: '数码' }, { id: 2, name: '生活' }, { id: 3, name: '食品' },
    { id: 4, name: '服饰' }, { id: 5, name: '图书' }, { id: 6, name: '游戏' },
    { id: 7, name: '其他' }
  ],
  products: [
    { id: 1, name: 'iPhone 15 Pro', description: '钛金属设计，A17 Pro芯片，专业相机系统', image_url: 'https://picsum.photos/seed/iphone/400/300', product_url: 'https://www.apple.com/shop/buy-iphone/iphone-15-pro', category_id: 1, user_id: 1, tags: '手机,苹果,数码', created_at: '2024-01-15T10:00:00.000Z' },
    { id: 2, name: 'MacBook Air M3', description: '轻薄便携，续航超长，M3芯片强劲性能', image_url: 'https://picsum.photos/seed/macbook/400/300', product_url: 'https://www.apple.com/shop/buy-mac/macbook-air-13-and-15-m3', category_id: 1, user_id: 1, tags: '电脑,苹果,办公', created_at: '2024-01-20T10:00:00.000Z' },
    { id: 3, name: 'AirPods Pro 2', description: '主动降噪，空间音频，MagSafe充电盒', image_url: 'https://picsum.photos/seed/airpods/400/300', product_url: 'https://www.apple.com/shop/product/MQXG3AM/A/airpods-pro-2nd-generation', category_id: 1, user_id: 1, tags: '耳机,苹果,音乐', created_at: '2024-01-25T10:00:00.000Z' },
    { id: 4, name: '戴森吸尘器 V15', description: '强劲吸力，激光探测，LCD显示屏', image_url: 'https://picsum.photos/seed/dyson/400/300', product_url: '', category_id: 2, user_id: 1, tags: '家电,清洁,戴森', created_at: '2024-02-01T10:00:00.000Z' },
    { id: 5, name: 'SK-II 神仙水', description: '护肤精华液，改善肌肤状态的神器', image_url: 'https://picsum.photos/seed/sk2/400/300', product_url: '', category_id: 2, user_id: 1, tags: '护肤,美妆,神仙水', created_at: '2024-02-05T10:00:00.000Z' },
    { id: 6, name: '星巴克随行杯', description: '不锈钢保温杯，创意设计，环保又时尚', image_url: 'https://picsum.photos/seed/starbucks/400/300', product_url: '', category_id: 3, user_id: 1, tags: '杯子,星巴克,保温', created_at: '2024-02-10T10:00:00.000Z' },
    { id: 7, name: 'Nintendo Switch', description: '家用掌机新概念，多人同乐必备', image_url: 'https://picsum.photos/seed/switch/400/300', product_url: 'https://www.nintendo.com/switch/', category_id: 6, user_id: 1, tags: '游戏机,任天堂,游戏', created_at: '2024-02-15T10:00:00.000Z' },
    { id: 8, name: '索尼 PS5', description: '下一代游戏主机，4K画质，沉浸式体验', image_url: 'https://picsum.photos/seed/ps5/400/300', product_url: 'https://www.playstation.com/ps5/', category_id: 6, user_id: 1, tags: '游戏机,索尼,游戏', created_at: '2024-02-20T10:00:00.000Z' },
    { id: 9, name: '《三体》全套', description: '刘慈欣科幻巨著，值得反复阅读', image_url: 'https://picsum.photos/seed/santi/400/300', product_url: '', category_id: 5, user_id: 1, tags: '图书,科幻,小说', created_at: '2024-02-25T10:00:00.000Z' },
    { id: 10, name: 'lululemon瑜伽裤', description: '高弹面料，舒适透气，时尚运动风', image_url: 'https://picsum.photos/seed/lulu/400/300', product_url: '', category_id: 4, user_id: 1, tags: '运动,瑜伽,lululemon', created_at: '2024-03-01T10:00:00.000Z' },
    { id: 11, name: 'Air Jordan 1', description: '经典篮球鞋，潮流百搭神器', image_url: 'https://picsum.photos/seed/jordan/400/300', product_url: '', category_id: 4, user_id: 1, tags: '鞋,Nike,篮球', created_at: '2024-03-05T10:00:00.000Z' },
    { id: 12, name: 'Apple Watch S9', description: '智能手表，健康监测，时尚配件', image_url: 'https://picsum.photos/seed/watch/400/300', product_url: 'https://www.apple.com/watch/', category_id: 1, user_id: 1, tags: '手表,苹果,智能穿戴', created_at: '2024-03-10T10:00:00.000Z' }
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
  comment_likes: [],
  favorites: [],
  nextIds: { users: 2, products: 13, likes: 4, comments: 4, comment_likes: 1, favorites: 1 }
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

// 用户注册
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ error: '用户名已存在' });
  }
  const user = { id: genId('users'), username, password, is_admin: false, created_at: new Date().toISOString() };
  db.users.push(user);
  await saveDB();
  res.json({ id: user.id, username: user.username, is_admin: user.is_admin });
});

// 用户登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: '用户名或密码错误' });
  res.json({ user_id: user.id, username: user.username, is_admin: user.is_admin });
});

// 获取当前用户信息
app.get('/api/user', (req, res) => {
  const { username } = req.query;
  if (!username) return res.json(null);
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json(null);
  res.json({ id: user.id, username: user.username, is_admin: user.is_admin });
});

// 分类列表
app.get('/api/categories', (req, res) => res.json(db.categories));

// 产品列表
app.get('/api/products', (req, res) => {
  const { category_id, search, sort, username, tag } = req.query;
  let products = [...db.products];
  
  if (category_id) products = products.filter(p => p.category_id == category_id);
  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(s) || (p.tags && p.tags.toLowerCase().includes(s)));
  }
  if (tag) {
    const t = tag.toLowerCase();
    products = products.filter(p => p.tags && p.tags.toLowerCase().includes(t));
  }
  
  products = products.map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length }));
  if (sort === 'popular') products.sort((a, b) => b.like_count - a.like_count);
  else products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  let userId = username ? db.users.find(u => u.username === username)?.id : null;
  let userFavorites = userId ? db.favorites.filter(f => f.user_id === userId).map(f => f.product_id) : [];
  
  res.json(products.map(p => ({
    ...p,
    is_liked: userId ? db.likes.some(l => l.user_id === userId && l.product_id === p.id) : false,
    is_favorited: userFavorites.includes(p.id)
  })));
});

// 获取单个产品
app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: '产品不存在' });
  
  const like_count = db.likes.filter(l => l.product_id === product.id).length;
  const { username } = req.query;
  let userId = username ? db.users.find(u => u.username === username)?.id : null;
  let is_favorited = userId ? db.favorites.some(f => f.user_id === userId && f.product_id === product.id) : false;
  
  res.json({ ...product, like_count, is_favorited });
});

// 添加产品
app.post('/api/products', async (req, res) => {
  const { name, description, image_url, product_url, category_id, tags, username } = req.body;
  
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const product = { 
    id: genId('products'), 
    name, 
    description, 
    image_url: image_url || null, 
    product_url: product_url || null,
    category_id, 
    tags: tags || '',
    user_id: user.id,
    created_at: new Date().toISOString() 
  };
  db.products.push(product);
  await saveDB();
  res.json({ ...product, like_count: 0, is_liked: false, is_favorited: false });
});

// 删除产品（管理员或创建者）
app.delete('/api/products/:id', async (req, res) => {
  const { username } = req.body;
  const productId = parseInt(req.params.id);
  
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const product = db.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: '产品不存在' });
  
  if (user.id !== product.user_id && !user.is_admin) {
    return res.status(403).json({ error: '无权限删除' });
  }
  
  db.products = db.products.filter(p => p.id !== productId);
  db.likes = db.likes.filter(l => l.product_id !== productId);
  db.comments = db.comments.filter(c => c.product_id !== productId);
  db.favorites = db.favorites.filter(f => f.product_id !== productId);
  await saveDB();
  
  res.json({ success: true });
});

// 点赞/取消点赞
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

// 收藏/取消收藏
app.post('/api/products/:id/favorite', async (req, res) => {
  const { username } = req.body;
  const productId = parseInt(req.params.id);
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const idx = db.favorites.findIndex(f => f.user_id === user.id && f.product_id === productId);
  if (idx >= 0) db.favorites.splice(idx, 1);
  else db.favorites.push({ id: genId('favorites'), user_id: user.id, product_id: productId, created_at: new Date().toISOString() });
  
  await saveDB();
  res.json({ favorited: idx < 0 });
});

// 评论列表
app.get('/api/products/:id/comments', (req, res) => {
  const productId = parseInt(req.params.id);
  const { username } = req.query;
  let userId = username ? db.users.find(u => u.username === username)?.id : null;
  
  const comments = db.comments
    .filter(c => c.product_id === productId)
    .map(c => {
      const user = db.users.find(u => u.id === c.user_id);
      const like_count = db.comment_likes.filter(cl => cl.comment_id === c.id).length;
      const is_liked = userId ? db.comment_likes.some(cl => cl.user_id === userId && cl.comment_id === c.id) : false;
      return { ...c, username: user?.username || '未知', like_count, is_liked };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(comments);
});

// 添加评论
app.post('/api/comments', async (req, res) => {
  const { product_id, content, username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const comment = { id: genId('comments'), user_id: user.id, product_id, content, created_at: new Date().toISOString() };
  db.comments.push(comment);
  await saveDB();
  res.json({ ...comment, username: user.username, like_count: 0, is_liked: false });
});

// 删除评论
app.delete('/api/comments/:id', async (req, res) => {
  const { username } = req.body;
  const commentId = parseInt(req.params.id);
  
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const comment = db.comments.find(c => c.id === commentId);
  if (!comment) return res.status(404).json({ error: '评论不存在' });
  
  if (user.id !== comment.user_id && !user.is_admin) {
    return res.status(403).json({ error: '无权限删除' });
  }
  
  db.comments = db.comments.filter(c => c.id !== commentId);
  db.comment_likes = db.comment_likes.filter(cl => cl.comment_id !== commentId);
  await saveDB();
  
  res.json({ success: true });
});

// 评论点赞/取消点赞
app.post('/api/comments/:id/like', async (req, res) => {
  const { username } = req.body;
  const commentId = parseInt(req.params.id);
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const idx = db.comment_likes.findIndex(cl => cl.user_id === user.id && cl.comment_id === commentId);
  if (idx >= 0) db.comment_likes.splice(idx, 1);
  else db.comment_likes.push({ id: genId('comment_likes'), user_id: user.id, comment_id: commentId, created_at: new Date().toISOString() });
  
  await saveDB();
  const like_count = db.comment_likes.filter(cl => cl.comment_id === commentId).length;
  res.json({ liked: idx < 0, like_count });
});

// 用户贡献排名
app.get('/api/ranking', (req, res) => {
  const ranking = db.users.map(u => ({
    username: u.username,
    product_count: db.products.filter(p => p.user_id === u.id).length,
    like_count: db.likes.filter(l => {
      const userProducts = db.products.filter(p => p.user_id === u.id).map(p => p.id);
      return userProducts.includes(l.product_id);
    }).length
  }));
  
  ranking.sort((a, b) => b.product_count - a.product_count);
  res.json(ranking);
});

// 产品排行榜
app.get('/api/products/ranking', (req, res) => {
  const { category_id } = req.query;
  let products = [...db.products];
  
  if (category_id) products = products.filter(p => p.category_id == category_id);
  
  const ranking = products.map(p => ({
    id: p.id,
    name: p.name,
    image_url: p.image_url,
    like_count: db.likes.filter(l => l.product_id === p.id).length,
    category_id: p.category_id
  }));
  
  ranking.sort((a, b) => b.like_count - a.like_count);
  res.json(ranking);
});

// 用户收藏列表
app.get('/api/user/favorites', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json([]);
  
  const favoriteIds = db.favorites.filter(f => f.user_id === user.id).map(f => f.product_id);
  const favorites = favoriteIds.map(id => {
    const p = db.products.find(prod => prod.id === id);
    if (!p) return null;
    return { ...p, like_count: db.likes.filter(l => l.product_id === p.id).length };
  }).filter(p => p);
  
  res.json(favorites);
});

// 用户添加的产品列表
app.get('/api/user/products', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json([]);
  
  const products = db.products
    .filter(p => p.user_id === user.id)
    .map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length }));
  
  res.json(products);
});

// 热门标签
app.get('/api/tags', (req, res) => {
  const tagCounts = {};
  db.products.forEach(p => {
    if (p.tags) {
      p.tags.split(',').forEach(tag => {
        const t = tag.trim();
        if (t) tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    }
  });
  
  const tags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  res.json(tags);
});

module.exports = app;
