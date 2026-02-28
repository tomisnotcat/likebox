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


// Membership system
app.post('/api/membership/upgrade', async (req, res) => {
  const { username, plan } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const plans = { 'monthly': 30, 'yearly': 365, 'lifetime': 9999 };
  const days = plans[plan] || 30;
  
  user.membership = {
    plan,
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
    features: ['no_ads', 'unlimited_uploads', 'priority_support', 'analytics']
  };
  await saveDB();
  
  res.json({ success: true, expires: user.membership.expires });
});

app.get('/api/membership', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user || !user.membership) return res.json({ active: false });
  
  const active = new Date(user.membership.expires) > new Date();
  res.json({ active, ...user.membership });
});

// Community posts
app.post('/api/posts', async (req, res) => {
  const { username, title, content, images } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const post = {
    id: db.posts.length + 1,
    user_id: user.id,
    username: user.username,
    title,
    content,
    images: images || [],
    likes: [],
    created_at: new Date().toISOString()
  };
  db.posts.push(post);
  await saveDB();
  res.json(post);
});

app.get('/api/posts', (req, res) => {
  const posts = db.posts.map(p => ({
    ...p,
    like_count: p.likes?.length || 0,
    comment_count: (db.post_comments || []).filter(c => c.post_id === p.id).length
  })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(posts);
});

app.post('/api/posts/:id/like', async (req, res) => {
  const { username } = req.body;
  const postId = parseInt(req.params.id);
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const post = db.posts.find(p => p.id === postId);
  if (!post) return res.status(404).json({ error: '帖子不存在' });
  
  if (!post.likes) post.likes = [];
  const idx = post.likes.indexOf(user.id);
  if (idx >= 0) post.likes.splice(idx, 1);
  else post.likes.push(user.id);
  
  await saveDB();
  res.json({ liked: idx < 0, count: post.likes.length });
});

app.get('/api/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const comments = (db.post_comments || []).filter(c => c.post_id === postId).map(c => {
    const user = db.users.find(u => u.id === c.user_id);
    return { ...c, username: user?.username };
  });
  res.json(comments);
});

app.post('/api/posts/:id/comments', async (req, res) => {
  const { username, content } = req.body;
  const postId = parseInt(req.params.id);
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  if (!db.post_comments) db.post_comments = [];
  const comment = { id: db.post_comments.length + 1, post_id: postId, user_id: user.id, content, created_at: new Date().toISOString() };
  db.post_comments.push(comment);
  await saveDB();
  res.json({ ...comment, username: user.username });
});

// Events
app.get('/api/events', (req, res) => {
  const events = [
    { id: 1, title: '春季新品大赏', description: '春季新品首发，限时优惠', start: '2024-03-01', end: '2024-03-31', banner: 'https://picsum.photos/seed/event1/800/200' },
    { id: 2, title: '夏日清凉季', description: '消暑神器专场', start: '2024-06-01', end: '2024-08-31', banner: 'https://picsum.photos/seed/event2/800/200' },
    { id: 3, title: '双十一狂欢', description: '全年最低价', start: '2024-11-11', end: '2024-11-12', banner: 'https://picsum.photos/seed/event3/800/200' }
  ];
  res.json(events);
});

// Data export
app.get('/api/export', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const data = {
    profile: { username: user.username, created_at: user.created_at, points: user.points || 0 },
    products: db.products.filter(p => p.user_id === user.id),
    likes: db.likes.filter(l => l.user_id === user.id),
    favorites: db.favorites.filter(f => f.user_id === user.id),
    comments: db.comments.filter(c => c.user_id === user.id)
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=data.json');
  res.json(data);
});

// Real name verification (simplified)
app.post('/api/verify', async (req, res) => {
  const { username, real_name, id_card } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  // In production, integrate with official verification service
  user.verified = { real_name, status: 'pending', submitted_at: new Date().toISOString() };
  await saveDB();
  
  res.json({ success: true, message: '提交成功，审核中' });
});

app.get('/api/verify/status', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user || !user.verified) return res.json({ status: 'none' });
  res.json(user.verified);
});

// module.exports = app;

// Customer service / Messages
app.post('/api/messages', async (req, res) => {
  const { username, content } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  if (!db.messages) db.messages = [];
  const msg = { id: db.messages.length + 1, user_id: user.id, username: user.username, content, read: false, created_at: new Date().toISOString() };
  db.messages.push(msg);
  await saveDB();
  res.json(msg);
});

app.get('/api/messages', (req, res) => {
  const { username, admin } = req.query;
  if (admin === 'true') {
    const user = db.users.find(u => u.username === username);
    if (!user || !user.is_admin) return res.status(403).json({ error: '无权限' });
    return res.json(db.messages || []);
  }
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json([]);
  const messages = (db.messages || []).filter(m => m.user_id === user.id);
  res.json(messages);
});

app.put('/api/messages/:id/read', async (req, res) => {
  const { username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user || !user.is_admin) return res.status(403).json({ error: '无权限' });
  
  const msg = (db.messages || []).find(m => m.id === parseInt(req.params.id));
  if (msg) { msg.read = true; await saveDB(); }
  res.json({ success: true });
});

// Favorite collections
app.post('/api/collections', async (req, res) => {
  const { username, name } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  if (!db.collections) db.collections = [];
  const collection = { id: db.collections.length + 1, user_id: user.id, name, products: [], created_at: new Date().toISOString() };
  db.collections.push(collection);
  await saveDB();
  res.json(collection);
});

app.get('/api/collections', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json([]);
  
  const collections = (db.collections || []).filter(c => c.user_id === user.id).map(c => ({
    ...c,
    products: c.products.map(id => db.products.find(p => p.id === id)).filter(p => p)
  }));
  res.json(collections);
});

app.post('/api/collections/:id/add', async (req, res) => {
  const { username, product_id } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const collection = (db.collections || []).find(c => c.id === parseInt(req.params.id) && c.user_id === user.id);
  if (!collection) return res.status(404).json({ error: '收藏夹不存在' });
  
  if (!collection.products.includes(product_id)) {
    collection.products.push(product_id);
    await saveDB();
  }
  res.json({ success: true });
});

// Product update notifications
app.post('/api/follow-product', async (req, res) => {
  const { username, product_id } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  if (!db.product_follows) db.product_follows = [];
  const existing = db.product_follows.find(f => f.user_id === user.id && f.product_id === product_id);
  if (existing) {
    db.product_follows = db.product_follows.filter(f => f !== existing);
    await saveDB();
    return res.json({ followed: false });
  }
  db.product_follows.push({ user_id: user.id, product_id, created_at: new Date().toISOString() });
  await saveDB();
  res.json({ followed: true });
});

app.get('/api/follow-product/:id', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json({ followed: false });
  
  const followed = (db.product_follows || []).some(f => f.user_id === user.id && f.product_id === parseInt(req.params.id));
  res.json({ followed });
});

// Analytics / Trends
app.get('/api/analytics/trends', (req, res) => {
  const { days } = req.query;
  const since = Date.now() - (parseInt(days) || 7) * 24 * 60 * 60 * 1000;
  
  const likes = (db.likes || []).filter(l => new Date(l.created_at).getTime() > since);
  const comments = (db.comments || []).filter(c => new Date(c.created_at).getTime() > since);
  const products = (db.products || []).filter(p => new Date(p.created_at).getTime() > since);
  
  const dailyStats = {};
  for (let i = 0; i < (parseInt(days) || 7); i++) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toDateString();
    dailyStats[d] = { likes: 0, comments: 0, products: 0 };
  }
  
  likes.forEach(l => { const d = new Date(l.created_at).toDateString(); if (dailyStats[d]) dailyStats[d].likes++; });
  comments.forEach(c => { const d = new Date(c.created_at).toDateString(); if (dailyStats[d]) dailyStats[d].comments++; });
  products.forEach(p => { const d = new Date(p.created_at).toDateString(); if (dailyStats[d]) dailyStats[d].products++; });
  
  res.json({ daily: Object.entries(dailyStats).reverse().map(([date, stats]) => ({ date, ...stats })), summary: { total_likes: likes.length, total_comments: comments.length, total_products: products.length } });
});

app.get('/api/analytics/top', (req, res) => {
  const { type, limit } = req.query;
  const n = parseInt(limit) || 10;
  
  if (type === 'products') {
    const top = (db.products || []).map(p => ({
      id: p.id, name: p.name,
      likes: (db.likes || []).filter(l => l.product_id === p.id).length,
      comments: (db.comments || []).filter(c => c.product_id === p.id).length
    })).sort((a, b) => b.likes - a.likes).slice(0, n);
    return res.json(top);
  }
  
  if (type === 'users') {
    const top = {};
    (db.likes || []).forEach(l => { top[l.user_id] = (top[l.user_id] || 0) + 1; });
    const sorted = Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, n).map(([userId, count]) => {
      const u = db.users.find(user => user.id === parseInt(userId));
      return { user_id: userId, username: u?.username, likes: count };
    });
    return res.json(sorted);
  }
  
  res.json({ error: 'Invalid type' });
});

// Yearly report
app.get('/api/report/yearly', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const year = new Date().getFullYear();
  const userProducts = (db.products || []).filter(p => p.user_id === user.id && new Date(p.created_at).getFullYear() === year);
  const userLikes = (db.likes || []).filter(l => l.user_id === user.id && new Date(l.created_at).getFullYear() === year);
  const userComments = (db.comments || []).filter(c => c.user_id === user.id && new Date(c.created_at).getFullYear() === year);
  const userFavorites = (db.favorites || []).filter(f => f.user_id === user.id);
  
  res.json({
    year,
    username: user.username,
    products_added: userProducts.length,
    likes_given: userLikes.length,
    comments_made: userComments.length,
    products_favorited: userFavorites.length,
    points_earned: user.points || 0,
    rank: (db.users || []).filter(u => (u.points || 0) > (user.points || 0)).length + 1
  });
});

// module.exports = app;

// Ads system
app.get('/api/ads', (req, res) => {
  const ads = [
    { id: 1, title: '新品上市', image: 'https://picsum.photos/seed/ad1/400/200', url: '', position: 'banner' },
    { id: 2, title: '限时优惠', image: 'https://picsum.photos/seed/ad2/400/200', url: '', position: 'sidebar' }
  ];
  res.json(ads);
});

// Recommendation system (simple collaborative filtering)
app.get('/api/recommend', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  
  // Get user's liked categories
  let likedCategories = [];
  if (user) {
    const likedProducts = db.products.filter(p => db.likes.some(l => l.user_id === user.id && l.product_id === p.id));
    likedCategories = likedProducts.map(p => p.category_id);
  }
  
  // Recommend products from liked categories or popular
  let recommend = db.products.map(p => ({ ...p, score: 0 }));
  
  recommend.forEach(p => {
    if (likedCategories.includes(p.category_id)) p.score += 5;
    p.score += db.likes.filter(l => l.product_id === p.id).length;
    // Add some randomness
    p.score += Math.random() * 2;
  });
  
  recommend = recommend.sort((a, b) => b.score - a.score).slice(0, 10).map(p => ({
    ...p,
    like_count: db.likes.filter(l => l.product_id === p.id).length
  }));
  
  res.json(recommend);
});

// Content moderation / sensitive words filter
const sensitiveWords = ['敏感词1', '敏感词2', 'test'];
function filterContent(content) {
  if (!content) return content;
  let filtered = content;
  sensitiveWords.forEach(word => {
    filtered = filtered.replace(new RegExp(word, 'gi'), '***');
  });
  return filtered;
}

app.post('/api/comments', async (req, res) => {
  const { product_id, content, username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const filteredContent = filterContent(content);
  const comment = { id: db.comments.length + 1, user_id: user.id, product_id, content: filteredContent, created_at: new Date().toISOString() };
  db.comments.push(comment);
  
  // Notify
  const product = db.products.find(p => p.id === product_id);
  if (product && product.user_id !== user.id) {
    // notification logic here
  }
  
  await saveDB();
  res.json({ ...comment, username: user.username, like_count: 0, is_liked: false, replies: [] });
});

// Multi-language support
app.get('/api/i18n/:lang', (req, res) => {
  const { lang } = req.params;
  const translations = {
    zh: { welcome: '欢迎来到LikeBox', products: '产品', likes: '点赞' },
    en: { welcome: 'Welcome to LikeBox', products: 'Products', likes: 'Likes' }
  };
  res.json(translations[lang] || translations.zh);
});

// Theme store
app.get('/api/themes', (req, res) => {
  const themes = [
    { id: 1, name: '默认', primary: '#4f46e5', background: '#f9fafb' },
    { id: 2, name: '粉红', primary: '#ec4899', background: '#fdf2f8' },
    { id: 3, name: '绿色', primary: '#10b981', background: '#ecfdf5' },
    { id: 4, name: '暗黑', primary: '#8b5cf6', background: '#1a1a2e' }
  ];
  res.json(themes);
});

app.post('/api/themes/apply', async (req, res) => {
  const { username, theme_id } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  user.theme = theme_id;
  await saveDB();
  res.json({ success: true });
});

// Achievements / Badges system
const achievements = [
  { id: 'first_like', name: '初试锋芒', description: '第一次点赞', icon: '👍', points: 10 },
  { id: 'first_comment', name: '评论达人', description: '第一次评论', icon: '💬', points: 10 },
  { id: 'first_product', name: '产品猎人', description: '添加第一个产品', icon: '🏆', points: 20 },
  { id: 'ten_likes', name: '点赞狂人', description: '累计点赞10次', icon: '❤️', points: 50 },
  { id: 'ten_products', name: '产品大户', description: '添加10个产品', icon: '📦', points: 100 },
  { id: 'streak_7', name: '连续签到', description: '连续签到7天', icon: '🔥', points: 70 },
  { id: 'verified', name: '认证用户', description: '完成实名认证', icon: '✅', points: 30 },
  { id: 'vip', name: 'VIP会员', description: '开通会员', icon: '⭐', points: 50 }
];

app.get('/api/achievements', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  
  if (!user) return res.json(achievements);
  
  const userAchievements = user.achievements || [];
  
  const result = achievements.map(a => ({
    ...a,
    unlocked: userAchievements.includes(a.id),
    unlocked_at: user.achievement_dates?.[a.id]
  }));
  
  res.json(result);
});

function checkAchievements(user) {
  if (!user.achievements) user.achievements = [];
  if (!user.achievement_dates) user.achievement_dates = {};
  
  const newAchievements = [];
  
  // First like
  if (db.likes.filter(l => l.user_id === user.id).length >= 1 && !user.achievements.includes('first_like')) {
    user.achievements.push('first_like');
    user.achievement_dates.first_like = new Date().toISOString();
    user.points = (user.points || 0) + 10;
    newAchievements.push('first_like');
  }
  
  // First comment
  if (db.comments.filter(c => c.user_id === user.id).length >= 1 && !user.achievements.includes('first_comment')) {
    user.achievements.push('first_comment');
    user.achievement_dates.first_comment = new Date().toISOString();
    user.points = (user.points || 0) + 10;
    newAchievements.push('first_comment');
  }
  
  // First product
  if (db.products.filter(p => p.user_id === user.id).length >= 1 && !user.achievements.includes('first_product')) {
    user.achievements.push('first_product');
    user.achievement_dates.first_product = new Date().toISOString();
    user.points = (user.points || 0) + 20;
    newAchievements.push('first_product');
  }
  
  // 10 likes
  if (db.likes.filter(l => l.user_id === user.id).length >= 10 && !user.achievements.includes('ten_likes')) {
    user.achievements.push('ten_likes');
    user.achievement_dates.ten_likes = new Date().toISOString();
    user.points = (user.points || 0) + 50;
    newAchievements.push('ten_likes');
  }
  
  // 10 products
  if (db.products.filter(p => p.user_id === user.id).length >= 10 && !user.achievements.includes('ten_products')) {
    user.achievements.push('ten_products');
    user.achievement_dates.ten_products = new Date().toISOString();
    user.points = (user.points || 0) + 100;
    newAchievements.push('ten_products');
  }
  
  // 7 day streak
  if ((user.checkin_days || 0) >= 7 && !user.achievements.includes('streak_7')) {
    user.achievements.push('streak_7');
    user.achievement_dates.streak_7 = new Date().toISOString();
    user.points = (user.points || 0) + 70;
    newAchievements.push('streak_7');
  }
  
  return newAchievements;
}

app.get('/api/achievements/check', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json({ new: [] });
  
  const newAchievements = checkAchievements(user);
  if (newAchievements.length > 0) saveDB();
  
  res.json({ new: newAchievements });
});

// module.exports = app;

// Emoji support in comments
const emojiMap = { '开心': '😊', '喜欢': '❤️', '点赞': '👍', '哈哈': '😂', '惊讶': '😮', '难过': '😢', '生气': '😠', '爱心': '💕' };
function addEmoji(content) {
  if (!content) return content;
  let result = content;
  Object.entries(emojiMap).forEach(([key, emoji]) => {
    result = result.replace(new RegExp('\\[' + key + '\\]', 'g'), emoji);
  });
  return result;
}

// Mention support (@username)
function parseMentions(content) {
  const mentions = content.match(/@(\w+)/g) || [];
  return mentions.map(m => m.slice(1));
}

// Update comment to support emoji and mentions
app.post('/api/comments', async (req, res) => {
  const { product_id, content, username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const filteredContent = filterContent(content);
  const finalContent = addEmoji(filteredContent);
  const mentions = parseMentions(finalContent);
  
  const comment = { id: db.comments.length + 1, user_id: user.id, product_id, content: finalContent, mentions, created_at: new Date().toISOString() };
  db.comments.push(comment);
  
  // Notify mentioned users
  mentions.forEach(mentionedUser => {
    const target = db.users.find(u => u.username === mentionedUser);
    if (target && target.id !== user.id) {
      if (!db.notifications) db.notifications = [];
      db.notifications.push({ user_id: target.id, type: 'mention', content: `${user.username} 在评论中提到了你`, read: false, created_at: new Date().toISOString() });
    }
  });
  
  await saveDB();
  res.json({ ...comment, username: user.username, like_count: 0, is_liked: false, replies: [] });
});

// Product comparison - detailed version
app.get('/api/compare', (req, res) => {
  const { ids } = req.query;
  if (!ids) return res.json([]);
  
  const productIds = ids.split(',').map(id => parseInt(id));
  const products = productIds.map(id => {
    const p = db.products.find(prod => prod.id === id);
    if (!p) return null;
    return {
      ...p,
      like_count: db.likes.filter(l => l.product_id === p.id).length,
      comment_count: db.comments.filter(c => c.product_id === p.id).length,
      category: db.categories.find(c => c.id === p.category_id)?.name
    };
  }).filter(p => p);
  
  res.json(products);
});

// Paid sticky / promotion
app.post('/api/products/:id/promote', async (req, res) => {
  const { username, days } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  if ((user.points || 0) < days * 100) return res.status(400).json({ error: '积分不足' });
  
  const productId = parseInt(req.params.id);
  const product = db.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: '产品不存在' });
  
  user.points -= days * 100;
  product.promoted = true;
  product.promote_expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  
  await saveDB();
  res.json({ success: true, expires: product.promote_expires });
});

// Get promoted products
app.get('/api/promoted', (req, res) => {
  const now = new Date().toISOString();
  const promoted = db.products
    .filter(p => p.promoted && p.promote_expires > now)
    .map(p => ({ ...p, like_count: db.likes.filter(l => l.product_id === p.id).length }))
    .sort((a, b) => new Date(b.promote_expires) - new Date(a.promote_expires));
  res.json(promoted);
});

// Invite system
app.post('/api/invite', async (req, res) => {
  const { username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const code = Math.random().toString(36).slice(2, 10).toUpperCase();
  user.invite_code = code;
  user.invites = user.invites || 0;
  await saveDB();
  
  res.json({ code, url: '?invite=' + code });
});

app.post('/api/invite/use', async (req, res) => {
  const { invite_code, new_username, password } = req.body;
  const inviter = db.users.find(u => u.invite_code === invite_code);
  if (!inviter) return res.status(404).json({ error: '邀请码无效' });
  
  if (db.users.find(u => u.username === new_username)) return res.status(400).json({ error: '用户名已存在' });
  
  const newUser = { id: db.users.length + 1, username: new_username, password, is_admin: false, points: 50, invited_by: inviter.id, created_at: new Date().toISOString() };
  db.users.push(newUser);
  
  inviter.invites = (inviter.invites || 0) + 1;
  inviter.points = (inviter.points || 0) + 100;
  
  await saveDB();
  res.json({ success: true, bonus: 50 });
});

// Points mall / exchange
const mallItems = [
  { id: 1, name: 'VIP月卡', points: 300, image: '', stock: 100 },
  { id: 2, name: '头像框(7天)', points: 100, image: '', stock: 999 },
  { id: 3, name: '积分+50', points: 200, image: '', stock: 9999 },
  { id: 4, name: '首页推荐(1天)', points: 500, image: '', stock: 10 }
];

app.get('/api/mall', (req, res) => {
  res.json(mallItems);
});

app.post('/api/mall/buy', async (req, res) => {
  const { username, item_id } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  
  const item = mallItems.find(i => i.id === item_id);
  if (!item) return res.status(404).json({ error: '商品不存在' });
  
  if ((user.points || 0) < item.points) return res.status(400).json({ error: '积分不足' });
  
  user.points -= item.points;
  
  if (!user.items) user.items = [];
  user.items.push({ item_id: item.id, name: item.name, bought_at: new Date().toISOString() });
  
  await saveDB();
  res.json({ success: true, remaining_points: user.points });
});

app.get('/api/mall/my', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json([]);
  res.json(user.items || []);
});

// module.exports = app;
