const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const defaultData = {
  brands: [
    { id: 1, name: 'Apple', logo: 'https://logo.clearbit.com/apple.com', description: '苹果公司' },
    { id: 2, name: 'Sony', logo: 'https://logo.clearbit.com/sony.com', description: '索尼' },
    { id: 3, name: 'Nintendo', logo: 'https://logo.clearbit.com/nintendo.com', description: '任天堂' },
    { id: 4, name: 'Nike', logo: 'https://logo.clearbit.com/nike.com', description: '耐克' },
    { id: 5, name: 'Starbucks', logo: 'https://logo.clearbit.com/starbucks.com', description: '星巴克' },
    { id: 6, name: 'Dyson', logo: 'https://logo.clearbit.com/dyson.com', description: '戴森' },
    { id: 7, name: 'SK-II', logo: 'https://logo.clearbit.com/sk-ii.com', description: 'SK-II' },
    { id: 8, name: 'lululemon', logo: 'https://logo.clearbit.com/lululemon.com', description: '露露乐蒙' }
  ],
  users: [
    { id: 1, username: 'demo', password: '123456', is_admin: true, avatar: '', bio: '', created_at: '2024-01-01T00:00:00.000Z' }
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
  ratings: [],
  favorites: [],
  reports: [],
  notifications: [],
  follows: [],
  history: [],
  posts: [],
  post_comments: [],
  messages: [],
  collections: [],
  product_follows: [],
  votes: [],
  qas: [],
  lives: [],
  dao_votes: [],
  nfts: [],
  time_capsules: [],
  nextIds: { users: 2, brands: 9, products: 13, likes: 4, comments: 4, comment_likes: 1, favorites: 1, reports: 1, notifications: 1, follows: 1, history: 1, posts: 1, messages: 1, collections: 1 }
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
  if (category_id) products = products.filter(p => p.category_id === parseInt(category_id));
  if (brand_id) products = products.filter(p => p.brand_id === parseInt(brand_id));
  res.json(products.sort((a, b) => b.like_count - a.like_count));
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: '产品不存在' });
  const likes = db.likes.filter(l => l.product_id === product.id);
  const comments = db.comments.filter(c => c.product_id === product.id).map(c => {
    const user = db.users.find(u => u.id === c.user_id);
    return { ...c, username: user?.username, like_count: db.comment_likes.filter(cl => cl.comment_id === c.id).length, is_liked: false, replies: [] };
  });
  const rating = db.ratings.filter(r => r.product_id === product.id);
  const avgRating = rating.length ? rating.reduce((a, b) => a + b.score, 0) / rating.length : 0;
  res.json({ ...product, like_count: likes.length, comment_count: comments.length, comments, ratings: rating, average_rating: avgRating.toFixed(1) });
});

app.post('/api/products', (req, res) => {
  const { username, name, description, image_url, product_url, category_id, tags } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const product = { id: genId('products'), user_id: user.id, name, description, image_url, product_url, category_id: parseInt(category_id), tags, created_at: new Date().toISOString() };
  db.products.push(product);
  res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
  const { username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user || !user.is_admin) return res.status(403).json({ error: '无权限' });
  db.products = db.products.filter(p => p.id !== parseInt(req.params.id));
  res.json({ success: true });
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
    db.favorites.push({ id: genId('favorites'), user_id: user.id, product_id: parseInt(product_id), created_at: new Date().toISOString() });
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
  const category = db.categories.find(c => c.id === parseInt(req.params.id));
  if (!category) return res.status(404).json({ error: '分类不存在' });
  const products = db.products.filter(p => p.category_id === category.id).map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length }));
  res.json({ ...category, products });
});

// Brands
app.get('/api/brands', (req, res) => res.json(db.brands));

app.get('/api/brands/:id', (req, res) => {
  const brand = db.brands.find(b => b.id === parseInt(req.params.id));
  if (!brand) return res.status(404).json({ error: '品牌不存在' });
  const products = db.products.filter(p => p.tags?.toLowerCase().includes(brand.name.toLowerCase())).map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length }));
  res.json({ ...brand, products });
});

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
  res.json({ id: user.id, username: user.username, avatar: user.avatar, bio: user.bio, created_at: user.created_at, is_admin: user.is_admin, points: user.points || 0, checkin_days: user.checkin_days || 0 });
});

app.put('/api/user/avatar', (req, res) => {
  const { username, avatar } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  user.avatar = avatar;
  res.json({ success: true });
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

// Events
app.get('/api/events', (req, res) => {
  res.json([
    { id: 1, title: '春季新品大赏', description: '春季新品首发，限时优惠', start: '2024-03-01', end: '2024-03-31', banner: 'https://picsum.photos/seed/event1/800/200' },
    { id: 2, title: '夏日清凉季', description: '消暑神器专场', start: '2024-06-01', end: '2024-08-31', banner: 'https://picsum.photos/seed/event2/800/200' }
  ]);
});

// Admin stats
app.get('/api/admin/stats', (req, res) => {
  res.json({
    total_users: db.users.length,
    total_products: db.products.length,
    total_likes: db.likes.length,
    total_comments: db.comments.length
  });
});

module.exports = app;
