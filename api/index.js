const express = require('express');
const cors = require('cors');
const { kv } = require('@vercel/kv');

const app = express();
app.use(cors());
app.use(express.json());

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
  nextIds: { users: 2, brands: 9, products: 13, likes: 4, comments: 4, comment_likes: 1, favorites: 1, reports: 1, notifications: 1, follows: 1, history: 1 }
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

function notify(userId, type, content, link) {
  const notification = {
    id: genId('notifications'),
    user_id: userId,
    type,
    content,
    link,
    read: false,
    created_at: new Date().toISOString()
  };
  db.notifications.push(notification);
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
  const user = { id: genId('users'), username, password, is_admin: false, avatar: '', bio: '', created_at: new Date().toISOString() };
  db.users.push(user);
  await saveDB();
  res.json({ id: user.id, username: user.username, is_admin: user.is_admin });
});

// 用户登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: '用户名或密码错误' });
  res.json({ user_id: user.id, username: user.username, is_admin: user.is_admin, avatar: user.avatar, bio: user.bio });
});

// 获取用户信息
app.get('/api/user', (req, res) => {
  const { username } = req.query;
  if (!username) return res.json(null);
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json(null);
  res.json({ id: user.id, username: user.username, is_admin: user.is_admin, avatar: user.avatar, bio: user.bio });
});

// 更新用户信息
app.put('/api/user', async (req, res) => {
  const { username, avatar, bio } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  
  if (avatar !== undefined) user.avatar = avatar;
  if (bio !== undefined) user.bio = bio;
  
  await saveDB();
  res.json({ success: true });
});

// 分类列表
app.get('/api/categories', (req, res) => res.json(db.categories));

// Brand list
app.get('/api/brands', (req, res) => {
  const { brand_id } = req.query;
  let brands = db.brands || [];
  if (brand_id) {
    brands = brands.filter(b => b.id === parseInt(brand_id));
  }
  // Add product count
  brands = brands.map(b => ({
    ...b,
    product_count: db.products.filter(p => {
      const tags = (p.tags || '').toLowerCase();
      return tags.includes(b.name.toLowerCase());
    }).length
  }));
  res.json(brands);
});

// 产品列表
app.get('/api/products', (req, res) => {
  const { category_id, brand_id, search, sort, username, tag } = req.query;
  let products = [...db.products];
  
  if (category_id) products = products.filter(p => p.category_id == category_id);
  if (brand_id) products = products.filter(p => {
    const tagsLower = (p.tags || '').toLowerCase();
    const brand = (db.brands || []).find(b => b.id === parseInt(brand_id));
    if (!brand) return false;
    const nameLower = brand.name.toLowerCase();
    if (nameLower === 'apple' && tagsLower.includes('苹果')) return true;
    if (nameLower === 'sony' && tagsLower.includes('索尼')) return true;
    if (nameLower === 'nintendo' && tagsLower.includes('任天堂')) return true;
    if (nameLower === 'nike' && tagsLower.includes('nike')) return true;
    if (nameLower === 'starbucks' && tagsLower.includes('星巴克')) return true;
    if (nameLower === 'dyson' && tagsLower.includes('戴森')) return true;
    if (nameLower === 'sk-ii' && tagsLower.includes('sk-ii')) return true;
    if (nameLower === 'lululemon' && tagsLower.includes('lululemon')) return true;
    return tagsLower.includes(nameLower);
  });
  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(s) || (p.tags && p.tags.toLowerCase().includes(s)));
  }
  if (tag) {
    const t = tag.toLowerCase();
    products = products.filter(p => p.tags && p.tags.toLowerCase().includes(t));
  }
  
  products = products.map(p => {
    const like_count = db.likes.filter(l => l.product_id === p.id).length;
    // Detect brand
    let brand_id = null;
    const tagsLower = (p.tags || '').toLowerCase();
    const brand = (db.brands || []).find(b => {
      const nameLower = b.name.toLowerCase();
      // Also check Chinese aliases
      if (nameLower === 'apple' && tagsLower.includes('苹果')) return true;
      if (nameLower === 'sony' && tagsLower.includes('索尼')) return true;
      if (nameLower === 'nintendo' && tagsLower.includes('任天堂')) return true;
      if (nameLower === 'nike' && tagsLower.includes('nike')) return true;
      if (nameLower === 'starbucks' && tagsLower.includes('星巴克')) return true;
      if (nameLower === 'dyson' && tagsLower.includes('戴森')) return true;
      if (nameLower === 'sk-ii' && tagsLower.includes('sk-ii')) return true;
      if (nameLower === 'lululemon' && tagsLower.includes('lululemon')) return true;
      return tagsLower.includes(nameLower);
    });
    if (brand) brand_id = brand.id;
    return { ...p, like_count, brand_id };
  });
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

// 删除产品
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
  db.reports = db.reports.filter(r => r.product_id !== productId);
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
  else {
    db.likes.push({ id: genId('likes'), user_id: user.id, product_id: productId, created_at: new Date().toISOString() });
    // 通知
    const product = db.products.find(p => p.id === productId);
    if (product && product.user_id !== user.id) {
      notify(product.user_id, 'like', `${username} 赞了你的产品 "${product.name}"`, `?product=${productId}`);
    }
  }
  
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

// 举报产品
app.post('/api/products/:id/report', async (req, res) => {
  const { username, reason } = req.body;
  const productId = parseInt(req.params.id);
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const existing = db.reports.find(r => r.user_id === user.id && r.product_id === productId);
  if (existing) return res.status(400).json({ error: '已经举报过了' });
  
  db.reports.push({ id: genId('reports'), user_id: user.id, product_id: productId, reason, created_at: new Date().toISOString() });
  await saveDB();
  res.json({ success: true });
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
      const replies = db.comments.filter(r => r.reply_to === c.id).map(r => {
        const replyUser = db.users.find(u => u.id === r.user_id);
        return { ...r, username: replyUser?.username || '未知' };
      });
      return { ...c, username: user?.username || '未知', like_count, is_liked, replies };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(comments);
});

// 添加评论
app.post('/api/comments', async (req, res) => {
  const { product_id, content, username, reply_to } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const comment = { id: genId('comments'), user_id: user.id, product_id, content, reply_to: reply_to || null, created_at: new Date().toISOString() };
  db.comments.push(comment);
  
  // 通知
  const product = db.products.find(p => p.id === product_id);
  if (product && product.user_id !== user.id) {
    if (reply_to) {
      const parentComment = db.comments.find(c => c.id === reply_to);
      if (parentComment) {
        notify(parentComment.user_id, 'reply', `${username} 回复了你`, `?product=${product_id}`);
      }
    } else {
      notify(product.user_id, 'comment', `${username} 评论了你的产品 "${product.name}"`, `?product=${product_id}`);
    }
  }
  
  await saveDB();
  res.json({ ...comment, username: user.username, like_count: 0, is_liked: false, replies: [] });
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

// 评论点赞
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

// 关注/取消关注
app.post('/api/follow/:userId', async (req, res) => {
  const { username } = req.body;
  const targetUserId = parseInt(req.params.userId);
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  if (user.id === targetUserId) return res.status(400).json({ error: '不能关注自己' });
  
  const idx = db.follows.findIndex(f => f.user_id === user.id && f.following_id === targetUserId);
  if (idx >= 0) {
    db.follows.splice(idx, 1);
  } else {
    db.follows.push({ id: genId('follows'), user_id: user.id, following_id: targetUserId, created_at: new Date().toISOString() });
    const targetUser = db.users.find(u => u.id === targetUserId);
    if (targetUser) notify(targetUserId, 'follow', `${username} 关注了你`, '');
  }
  
  await saveDB();
  res.json({ followed: idx < 0 });
});

// 获取用户关注列表
app.get('/api/followers/:username', (req, res) => {
  const user = db.users.find(u => u.username === req.params.username);
  if (!user) return res.json({ followers: [], following: [] });
  
  const followers = db.follows.filter(f => f.following_id === user.id).map(f => {
    const u = db.users.find(u => u.id === f.user_id);
    return u ? { id: u.id, username: u.username, avatar: u.avatar } : null;
  }).filter(u => u);
  
  const following = db.follows.filter(f => f.user_id === user.id).map(f => {
    const u = db.users.find(u => u.id === f.following_id);
    return u ? { id: u.id, username: u.username, avatar: u.avatar } : null;
  }).filter(u => u);
  
  res.json({ followers, following });
});

// 用户贡献排名
app.get('/api/ranking', (req, res) => {
  const ranking = db.users.map(u => ({
    username: u.username,
    avatar: u.avatar,
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
app.get('/api/products/top', (req, res) => {
  const { category_id } = req.query;
  let products = [...db.products];
  
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

// 消息通知
app.get('/api/notifications', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json([]);
  
  const notifications = db.notifications
    .filter(n => n.user_id === user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50);
  
  res.json(notifications);
});

// 标记通知已读
app.put('/api/notifications/read', async (req, res) => {
  const { username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  db.notifications.forEach(n => {
    if (n.user_id === user.id) n.read = true;
  });
  
  await saveDB();
  res.json({ success: true });
});

// 获取未读通知数
app.get('/api/notifications/unread', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json({ count: 0 });
  
  const count = db.notifications.filter(n => n.user_id === user.id && !n.read).length;
  res.json({ count });
});

// 浏览历史
app.get('/api/history', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json([]);
  
  const historyIds = db.history
    .filter(h => h.user_id === user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20)
    .map(h => h.product_id);
  
  const history = [...new Set(historyIds)].map(id => {
    const p = db.products.find(prod => prod.id === id);
    if (!p) return null;
    return { ...p, like_count: db.likes.filter(l => l.product_id === p.id).length };
  }).filter(p => p);
  
  res.json(history);
});

// 添加浏览历史
app.post('/api/history', async (req, res) => {
  const { username, product_id } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  // 删除旧的同产品记录
  db.history = db.history.filter(h => !(h.user_id === user.id && h.product_id === product_id));
  
  db.history.push({ id: genId('history'), user_id: user.id, product_id, created_at: new Date().toISOString() });
  
  // 保持最多50条
  const userHistory = db.history.filter(h => h.user_id === user.id);
  if (userHistory.length > 50) {
    const toDelete = userHistory.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).slice(0, userHistory.length - 50);
    toDelete.forEach(h => {
      db.history = db.history.filter(hi => hi.id !== h.id);
    });
  }
  
  await saveDB();
  res.json({ success: true });
});

// 用户列表（用于关注）
app.get('/api/users', (req, res) => {
  const { username } = req.query;
  const users = db.users.map(u => ({
    id: u.id,
    username: u.username,
    avatar: u.avatar,
    bio: u.bio
  }));
  res.json(users);
});


// Image upload (base64)
app.post('/api/upload', async (req, res) => {
  const { image, type } = req.body;
  if (!image) return res.status(400).json({ error: 'No image provided' });
  
  // Simple base64 storage - in production use cloud storage
  const filename = 'img_' + Date.now() + '.png';
  const base64Data = image.replace(/^data:image\/[^;]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  
  // For Vercel, we'll return a data URL (or integrate with external service)
  res.json({ url: image });
});

// Update user avatar
app.put('/api/user/avatar', async (req, res) => {
  const { username, avatar } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  user.avatar = avatar;
  await saveDB();
  res.json({ success: true });
});

// Brand detail
app.get('/api/brands/:id', (req, res) => {
  const brand = db.brands.find(b => b.id === parseInt(req.params.id));
  if (!brand) return res.status(404).json({ error: 'Brand not found' });
  
  const products = db.products.filter(p => {
    const tagsLower = (p.tags || '').toLowerCase();
    const nameLower = brand.name.toLowerCase();
    if (nameLower === 'apple' && tagsLower.includes('苹果')) return true;
    if (nameLower === 'sony' && tagsLower.includes('索尼')) return true;
    if (nameLower === 'nintendo' && tagsLower.includes('任天堂')) return true;
    if (nameLower === 'nike' && tagsLower.includes('nike')) return true;
    if (nameLower === 'starbucks' && tagsLower.includes('星巴克')) return true;
    if (nameLower === 'dyson' && tagsLower.includes('戴森')) return true;
    if (nameLower === 'sk-ii' && tagsLower.includes('sk-ii')) return true;
    if (nameLower === 'lululemon' && tagsLower.includes('lululemon')) return true;
    return tagsLower.includes(nameLower);
  }).map(p => ({
    ...p,
    like_count: db.likes.filter(l => l.product_id === p.id).length
  }));
  
  res.json({ ...brand, products });
});

// Admin stats
app.get('/api/admin/stats', (req, res) => {
  const stats = {
    total_users: db.users.length,
    total_products: db.products.length,
    total_likes: db.likes.length,
    total_comments: db.comments.length,
    total_favorites: db.favorites.length,
    reports_count: db.reports.length,
    top_products: db.products.map(p => ({
      id: p.id,
      name: p.name,
      like_count: db.likes.filter(l => l.product_id === p.id).length
    })).sort((a, b) => b.like_count - a.like_count).slice(0, 10),
    recent_products: db.products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10)
  };
  res.json(stats);
});

// Reports list (admin)
app.get('/api/admin/reports', (req, res) => {
  const reports = db.reports.map(r => {
    const product = db.products.find(p => p.id === r.product_id);
    const user = db.users.find(u => u.id === r.user_id);
    return { ...r, product_name: product?.name, username: user?.username };
  });
  res.json(reports);
});

module.exports = app;
