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
  products: [
    // 数码 - 手机
    { id: 1, name: 'iPhone 15 Pro', description: '钛金属设计，A17 Pro芯片，专业相机系统', image_url: 'https://picsum.photos/seed/iphone15/400/300', product_url: 'https://www.apple.com', category_id: 101, tags: '手机,苹果', created_at: '2024-01-15T10:00:00.000Z' },
    { id: 2, name: '华为 Mate 60 Pro', description: '卫星通话，昆仑玻璃，鸿蒙系统', image_url: 'https://picsum.photos/seed/mate60/400/300', product_url: 'https://www.huawei.com', category_id: 101, tags: '手机,华为', created_at: '2024-01-20T10:00:00.000Z' },
    { id: 3, name: '小米 14 Ultra', description: '徕卡光学，1英寸传感器，骁龙8 Gen 3', image_url: 'https://picsum.photos/seed/xiaomi14/400/300', product_url: 'https://www.mi.com', category_id: 101, tags: '手机,小米', created_at: '2024-01-25T10:00:00.000Z' },
    // 数码 - 电脑
    { id: 4, name: 'MacBook Pro M3', description: 'M3 Pro芯片，18G内存，超长续航', image_url: 'https://picsum.photos/seed/macbookpro/400/300', product_url: 'https://www.apple.com', category_id: 10201, tags: '电脑,苹果', created_at: '2024-02-01T10:00:00.000Z' },
    { id: 5, name: 'ThinkPad X1 Carbon', description: '轻薄便携，商务首选，键盘手感极佳', image_url: 'https://picsum.photos/seed/thinkpad/400/300', product_url: 'https://www.lenovo.com', category_id: 10201, tags: '电脑,ThinkPad', created_at: '2024-02-05T10:00:00.000Z' },
    // 数码 - 耳机
    { id: 6, name: 'AirPods Pro 2', description: '主动降噪，空间音频，MagSafe充电', image_url: 'https://picsum.photos/seed/airpods2/400/300', product_url: 'https://www.apple.com', category_id: 10301, tags: '耳机,苹果', created_at: '2024-02-10T10:00:00.000Z' },
    { id: 7, name: '索尼 WH-1000XM5', description: '顶级降噪，30小时续航，LDAC音质', image_url: 'https://picsum.photos/seed/sonyxm5/400/300', product_url: 'https://www.sony.com', category_id: 10302, tags: '耳机,索尼', created_at: '2024-02-15T10:00:00.000Z' },
    // 运动 - 跑步
    { id: 8, name: 'Nike Air Zoom Pegasus', description: 'Zoom气垫，透气网面，跑步首选', image_url: 'https://picsum.photos/seed/pegasus/400/300', product_url: 'https://www.nike.com', category_id: 20101, tags: '跑鞋,Nike', created_at: '2024-02-20T10:00:00.000Z' },
    { id: 9, name: ' Adidas Ultraboost', description: 'Boost中底，Primeknit鞋面，舒适回弹', image_url: 'https://picsum.photos/seed/ultraboost/400/300', product_url: 'https://www.adidas.com', category_id: 20101, tags: '跑鞋,Adidas', created_at: '2024-02-25T10:00:00.000Z' },
    // 运动 - 瑜伽
    { id: 10, name: 'lululemon瑜伽垫', description: '防滑加厚，环保材质，明星同款', image_url: 'https://picsum.photos/seed/lulumat/400/300', product_url: 'https://www.lululemon.com', category_id: 20201, tags: '瑜伽,lululemon', created_at: '2024-03-01T10:00:00.000Z' },
    // 食品 - 饮料
    { id: 11, name: '星巴克拿铁', description: '浓缩咖啡+牛奶，经典口味', image_url: 'https://picsum.photos/seed/latte/400/300', product_url: 'https://www.starbucks.com', category_id: 30101, tags: '咖啡,星巴克', created_at: '2024-03-05T10:00:00.000Z' },
    { id: 12, name: 'TWG Tea茶包', description: '高端茶叶，贵族品味，多种口味', image_url: 'https://picsum.photos/seed/twgtea/400/300', product_url: 'https://www.twgtea.com', category_id: 30102, tags: '茶,TWG', created_at: '2024-03-10T10:00:00.000Z' },
    // 服饰 - T恤
    { id: 13, name: '优衣库联名T恤', description: '设计师联名，纯棉舒适，百搭款', image_url: 'https://picsum.photos/seed/uniqlo/400/300', product_url: 'https://www.uniqlo.com', category_id: 40101, tags: 'T恤,优衣库', created_at: '2024-03-15T10:00:00.000Z' },
    { id: 14, name: 'Lacoste POLO衫', description: '经典鳄鱼标志，棉质面料，商务休闲', image_url: 'https://picsum.photos/seed/lacoste/400/300', product_url: 'https://www.lacoste.com', category_id: 40101, tags: 'POLO,Lacoste', created_at: '2024-03-20T10:00:00.000Z' },
    // 服饰 - 裤子
    { id: 15, name: 'Levis牛仔裤', description: '经典501，靛蓝水洗，百搭款式', image_url: 'https://picsum.photos/seed/levis/400/300', product_url: 'https://www.levis.com', category_id: 40201, tags: '牛仔裤,Levis', created_at: '2024-03-25T10:00:00.000Z' },
    // 图书 - 小说
    { id: 16, name: '《三体》全套', description: '刘慈欣科幻巨著，雨果奖作品', image_url: 'https://picsum.photos/seed/santi/400/300', product_url: '', category_id: 501, tags: '小说,科幻', created_at: '2024-04-01T10:00:00.000Z' },
    { id: 17, name: '《活着》余华', description: '经典文学作品，感人至深', image_url: 'https://picsum.photos/seed/huozhe/400/300', product_url: '', category_id: 501, tags: '小说,文学', created_at: '2024-04-05T10:00:00.000Z' },
    // 图书 - 教育
    { id: 18, name: '剑桥雅思真题', description: '官方真题集，备考必备', image_url: 'https://picsum.photos/seed/ielts/400/300', product_url: '', category_id: 50201, tags: '英语,雅思', created_at: '2024-04-10T10:00:00.000Z' },
    // 游戏 - 主机
    { id: 19, name: 'Nintendo Switch OLED', description: 'OLED屏幕，色彩鲜艳，多人同乐', image_url: 'https://picsum.photos/seed/switcholed/400/300', product_url: 'https://www.nintendo.com', category_id: 60101, tags: '主机,Switch', created_at: '2024-04-15T10:00:00.000Z' },
    { id: 20, name: 'PS5 光驱版', description: '4K画质，HDR，超高速SSD', image_url: 'https://picsum.photos/seed/ps5/400/300', product_url: 'https://www.playstation.com', category_id: 60102, tags: '主机,PS5', created_at: '2024-04-20T10:00:00.000Z' },
    // 美妆 - 护肤品
    { id: 21, name: 'SK-II神仙水', description: '护肤精华液，改善肌肤屏障', image_url: 'https://picsum.photos/seed/sk2/400/300', product_url: 'https://www.sk-ii.com', category_id: 70101, tags: '护肤,SK-II', created_at: '2024-04-25T10:00:00.000Z' },
    { id: 22, name: '雅诗兰黛小棕瓶', description: '修护抗老，明星产品', image_url: 'https://picsum.photos/seed/estee/400/300', product_url: 'https://www.esteelauder.com', category_id: 70101, tags: '护肤,雅诗兰黛', created_at: '2024-05-01T10:00:00.000Z' },
    // 家居 - 家具
    { id: 23, name: '宜家马尔姆床架', description: '简约北欧风，储物设计', image_url: 'https://picsum.photos/seed/ikeabed/400/300', product_url: 'https://www.ikea.com', category_id: 90101, tags: '床,宜家', created_at: '2024-05-05T10:00:00.000Z' },
    { id: 24, name: 'MUJI懒人沙发', description: '舒适柔软，北欧设计', image_url: 'https://picsum.photos/seed/mujisofa/400/300', product_url: 'https://www.muji.com', category_id: 90101, tags: '沙发,MUJI', created_at: '2024-05-10T10:00:00.000Z' },
    // 家居 - 小家电
    { id: 25, name: '戴森吸尘器V15', description: '强劲吸力，激光探测，LCD显示', image_url: 'https://picsum.photos/seed/dysonv15/400/300', product_url: 'https://www.dyson.com', category_id: 902, tags: '清洁,戴森', created_at: '2024-05-15T10:00:00.000Z' },
    // 汽车
    { id: 26, name: '特斯拉Model 3', description: '纯电动，智能驾驶，超长续航', image_url: 'https://picsum.photos/seed/tesla3/400/300', product_url: 'https://www.tesla.com', category_id: 1001, tags: '汽车,特斯拉', created_at: '2024-05-20T10:00:00.000Z' },
    { id: 27, name: '比亚迪汉EV', description: '国产旗舰电动，智能座舱', image_url: 'https://picsum.photos/seed/bydhan/400/300', product_url: 'https://www.byd.com', category_id: 1001, tags: '汽车,比亚迪', created_at: '2024-05-25T10:00:00.000Z' },
    // More 数码 products
    { id: 28, name: '三星 Galaxy S24 Ultra', description: 'AI手机，钛金属边框，SPen手写笔', image_url: 'https://picsum.photos/seed/samsungs24/400/300', product_url: 'https://www.samsung.com', category_id: 101, tags: '手机,三星', created_at: '2024-06-01T10:00:00.000Z' },
    { id: 29, name: 'OPPO Find X7 Pro', description: '天玑9300处理器，哈苏影像', image_url: 'https://picsum.photos/seed/oppox7/400/300', product_url: 'https://www.oppo.com', category_id: 101, tags: '手机,OPPO', created_at: '2024-06-05T10:00:00.000Z' },
    { id: 30, name: 'vivo X100 Pro', description: '蔡司光学镜头，120W闪充', image_url: 'https://picsum.photos/seed/vivox100/400/300', product_url: 'https://www.vivo.com', category_id: 101, tags: '手机,vivo', created_at: '2024-06-10T10:00:00.000Z' },
    { id: 31, name: ' ROG游戏本', description: 'ROG游戏本', image_url: 'https://picsum.photos/seed/rog/400/300', product_url: 'https://www.asus.com', category_id: 10201, tags: '电脑,ROG', created_at: '2024-06-15T10:00:00.000Z' },
    { id: 32, name: '华为 FreeBuds Pro 3', description: '空间音频，智慧降噪', image_url: 'https://picsum.photos/seed/huaweifreebuds/400/300', product_url: 'https://www.huawei.com', category_id: 10301, tags: '耳机,华为', created_at: '2024-06-20T10:00:00.000Z' },
    { id: 33, name: ' Bose QuietComfort', description: '顶级降噪，舒适佩戴', image_url: 'https://picsum.photos/seed/boseqc/400/300', product_url: 'https://www.bose.com', category_id: 10302, tags: '耳机,Bose', created_at: '2024-06-25T10:00:00.000Z' },
    // More 运动 products
    { id: 34, name: 'New Balance 574', description: '经典复古，舒适缓震', image_url: 'https://picsum.photos/seed/nb574/400/300', product_url: 'https://www.newbalance.com', category_id: 20101, tags: '跑鞋,NewBalance', created_at: '2024-07-01T10:00:00.000Z' },
    { id: 35, name: 'Under Armour跑鞋', description: '轻量透气，Energy Return', image_url: 'https://picsum.photos/seed/ua/400/300', product_url: 'https://www.underarmour.com', category_id: 20101, tags: '跑鞋,UA', created_at: '2024-07-05T10:00:00.000Z' },
    { id: 36, name: 'Nike瑜伽裤', description: '高弹面料，裸感体验', image_url: 'https://picsum.photos/seed/nikelegging/400/300', product_url: 'https://www.nike.com', category_id: 20202, tags: '瑜伽,Nike', created_at: '2024-07-10T10:00:00.000Z' },
    { id: 37, name: '健身哑铃套装', description: '可调节重量，家庭健身', image_url: 'https://picsum.photos/seed/dumbbell/400/300', product_url: '', category_id: 20301, tags: '健身,器材', created_at: '2024-07-15T10:00:00.000Z' },
    // More 食品 products
    { id: 38, name: '瑞幸生椰拿铁', description: '椰浆+浓缩咖啡，清爽不腻', image_url: 'https://picsum.photos/seed/luckin/400/300', product_url: 'https://www.luckincoffee.com', category_id: 30101, tags: '咖啡,瑞幸', created_at: '2024-07-20T10:00:00.000Z' },
    { id: 39, name: '农夫山泉气泡水', description: '0糖0脂，白桃口味', image_url: 'https://picsum.photos/seed/bubble/400/300', product_url: 'https://www.nfsg.com', category_id: 30102, tags: '饮料,气泡水', created_at: '2024-07-25T10:00:00.000Z' },
    { id: 40, name: '三只松鼠坚果礼盒', description: '混合坚果，营养丰富', image_url: 'https://picsum.photos/seed/nuts/400/300', product_url: 'https://www.3songshu.com', category_id: 30201, tags: '零食,坚果', created_at: '2024-08-01T10:00:00.000Z' },
    // More 服饰 products
    { id: 41, name: 'Zara条纹衬衫', description: '韩版宽松，休闲百搭', image_url: 'https://picsum.photos/seed/zara/400/300', product_url: 'https://www.zara.com', category_id: 40101, tags: 'T恤,Zara', created_at: '2024-08-05T10:00:00.000Z' },
    { id: 42, name: 'H&M牛仔裤', description: '直筒剪裁，经典水洗', image_url: 'https://picsum.photos/seed/hmjeans/400/300', product_url: 'https://www.hm.com', category_id: 40201, tags: '牛仔裤,H&M', created_at: '2024-08-10T10:00:00.000Z' },
    // More 图书 products
    { id: 43, name: '《流浪地球》', description: '刘慈欣科幻，春节档电影原著', image_url: 'https://picsum.photos/seed/wandering/400/300', product_url: '', category_id: 501, tags: '小说,科幻', created_at: '2024-08-15T10:00:00.000Z' },
    { id: 44, name: '《人类简史》', description: '尤瓦尔赫拉利经典著作', image_url: 'https://picsum.photos/seed/sapiens/400/300', product_url: '', category_id: 501, tags: '历史,科普', created_at: '2024-08-20T10:00:00.000Z' },
    { id: 45, name: '新概念英语全套', description: '经典英语教材', image_url: 'https://picsum.photos/seed/nce/400/300', product_url: '', category_id: 50201, tags: '英语,新概念', created_at: '2024-08-25T10:00:00.000Z' },
    // More 游戏 products
    { id: 46, name: 'Xbox Series X', description: '4K 120fps，光线追踪', image_url: 'https://picsum.photos/seed/xboxsx/400/300', product_url: 'https://www.xbox.com', category_id: 60102, tags: '主机,Xbox', created_at: '2024-09-01T10:00:00.000Z' },
    { id: 47, name: '塞尔达传说：王国之泪', description: '开放世界神作', image_url: 'https://picsum.photos/seed/totk/400/300', product_url: 'https://www.nintendo.com', category_id: 602, tags: '游戏,塞尔达', created_at: '2024-09-05T10:00:00.000Z' },
    { id: 48, name: '艾尔登法环', description: '魂系巅峰之作', image_url: 'https://picsum.photos/seed/eldenring/400/300', product_url: 'https://www.fromsoftware.com', category_id: 602, tags: '游戏,魂系', created_at: '2024-09-10T10:00:00.000Z' },
    // More 美妆 products
    { id: 49, name: 'La Mer面霜', description: '海蓝之谜，修护神器', image_url: 'https://picsum.photos/seed/lamer/400/300', product_url: 'https://www.lamer.com', category_id: 70101, tags: '护肤,LaMer', created_at: '2024-09-15T10:00:00.000Z' },
    { id: 50, name: 'YSL口红', description: '经典方管，持久滋润', image_url: 'https://picsum.photos/seed/ysl/400/300', product_url: 'https://www.ysl.com', category_id: 702, tags: '彩妆,YSL', created_at: '2024-09-20T10:00:00.000Z' },
    // More 家居 products
    { id: 51, name: 'IKEA帕克鲁床垫', description: '乳胶弹簧，舒适支撑', image_url: 'https://picsum.photos/seed/ikeamat/400/300', product_url: 'https://www.ikea.com', category_id: 90101, tags: '床垫,宜家', created_at: '2024-09-25T10:00:00.000Z' },
    { id: 52, name: '戴森空气净化器', description: '除甲醛净化，智能监测', image_url: 'https://picsum.photos/seed/dysonpur/400/300', product_url: 'https://www.dyson.com', category_id: 90201, tags: '净化,戴森', created_at: '2024-10-01T10:00:00.000Z' },
    { id: 53, name: '小米空气净化器', description: '性价比之选，智能互联', image_url: 'https://picsum.photos/seed/xiaomiair/400/300', product_url: 'https://www.mi.com', category_id: 90201, tags: '净化,小米', created_at: '2024-10-05T10:00:00.000Z' },
    // More 汽车 products
    { id: 54, name: '蔚来ET5', description: '国产高端电动，激光雷达', image_url: 'https://picsum.photos/seed/nioet5/400/300', product_url: 'https://www.nio.com', category_id: 1001, tags: '汽车,蔚来', created_at: '2024-10-10T10:00:00.000Z' },
    { id: 55, name: '理想L9', description: '大型SUV，家庭首选', image_url: 'https://picsum.photos/seed/lixiangl9/400/300', product_url: 'https://www.lixiang.com', category_id: 1001, tags: '汽车,理想', created_at: '2024-10-15T10:00:00.000Z' },
    { id: 56, name: '宝马iX3', description: '豪华品牌电动，续航可靠', image_url: 'https://picsum.photos/seed/bmwix3/400/300', product_url: 'https://www.bmw.com', category_id: 1001, tags: '汽车,宝马', created_at: '2024-10-20T10:00:00.000Z' },
    { id: 57, name: '问界M9', description: '华为赋能，智能座舱', image_url: 'https://picsum.photos/seed/m9/400/300', product_url: 'https://www.aito.com', category_id: 1001, tags: '汽车,问界', created_at: '2024-10-25T10:00:00.000Z' },
    // More 运动 - 健身
    { id: 58, name: '筋膜枪', description: '肌肉放松，深层按摩', image_url: 'https://picsum.photos/seed/massage/400/300', product_url: '', category_id: 20301, tags: '健身,放松', created_at: '2024-11-01T10:00:00.000Z' },
    { id: 59, name: 'Keep智能跳绳', description: '无绳设计，精准计数', image_url: 'https://picsum.photos/seed/keepjump/400/300', product_url: 'https://www.gotokeep.com', category_id: 20302, tags: '健身,跳绳', created_at: '2024-11-05T10:00:00.000Z' }
  ],
  likes: [],
  comments: [],
  favorites: [],
  nextIds: { users: 2, brands: 1, products: 60, likes: 1, comments: 1, favorites: 1 }
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
    comment_count: db.comments.filter(c => c.product_id === p.id).length
  }));
  const { search, category_id } = req.query;
  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(s) || p.tags?.toLowerCase().includes(s));
  }
  if (category_id) {
    const targetId = parseInt(category_id);
    const getChildIds = (cats, pid) => {
      let ids = [pid];
      cats.forEach(c => {
        if (c.id === pid && c.children) c.children.forEach(child => ids = ids.concat(getChildIds(cats, child.id)));
        if (c.children) c.children.forEach(child => { if (child.id === pid) ids = ids.concat(getChildIds(c.children, child.id)); });
      });
      return ids;
    };
    const allIds = getChildIds(db.categories, targetId);
    products = products.filter(p => allIds.includes(p.category_id));
  }
  res.json(products.sort((a, b) => b.like_count - a.like_count));
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: '产品不存在' });
  const likes = db.likes.filter(l => l.product_id === product.id);
  res.json({ ...product, like_count: likes.length, comment_count: db.comments.filter(c => c.product_id === product.id).length });
});

app.post('/api/products', (req, res) => {
  const { username, name, description, image_url, category_id, tags } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const product = { id: genId('products'), user_id: user.id, name, description, image_url, category_id: parseInt(category_id), tags, created_at: new Date().toISOString() };
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
  if (existing) { db.likes = db.likes.filter(l => l !== existing); res.json({ liked: false }); }
  else { db.likes.push({ id: genId('likes'), user_id: user.id, product_id: productId, created_at: new Date().toISOString() }); res.json({ liked: true }); }
});

// Favorites
app.get('/api/favorites', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json([]);
  const favs = db.favorites.filter(f => f.user_id === user.id).map(f => db.products.find(p => p.id === f.product_id)).filter(p => p);
  res.json(favs);
});

app.post('/api/favorites', (req, res) => {
  const { username, product_id } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const existing = db.favorites.find(f => f.user_id === user.id && f.product_id === parseInt(product_id));
  if (existing) { db.favorites = db.favorites.filter(f => f !== existing); res.json({ favorited: false }); }
  else { db.favorites.push({ id: genId('favorites'), user_id: user.id, product_id: parseInt(product_id), created_at: new Date().toISOString() }); res.json({ favorited: true }); }
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
  res.json({ ...comment, username: user.username });
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

// Weekly
app.get('/api/weekly', (req, res) => res.json(db.products.slice(0, 6)));

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const users = db.users.map(u => ({
    username: u.username,
    products: db.products.filter(p => p.user_id === u.id).length,
    likes: db.likes.filter(l => l.user_id === u.id).length,
    score: db.products.filter(p => p.user_id === u.id).length * 2 + db.likes.filter(l => l.user_id === u.id).length
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
  res.json({ id: user.id, username: user.username, avatar: user.avatar, bio: user.bio, is_admin: user.is_admin });
});

// Check-in
app.post('/api/checkin', (req, res) => {
  const { username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '请先登录' });
  const today = new Date().toDateString();
  if (user.last_checkin === today) return res.json({ success: false, message: '今日已签到' });
  user.points = (user.points || 0) + 10;
  user.last_checkin = today;
  user.checkin_days = (user.checkin_days || 0) + 1;
  res.json({ success: true, points: 10, total: user.points, days: user.checkin_days });
});

app.get('/api/checkin', (req, res) => {
  const { username } = req.query;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.json({ checked: false, days: 0 });
  res.json({ checked: user.last_checkin === new Date().toDateString(), days: user.checkin_days || 0 });
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
  res.json(productIds.map(id => db.products.find(p => p.id === id)).filter(p => p));
});

// Admin stats
app.get('/api/admin/stats', (req, res) => {
  res.json({ total_users: db.users.length, total_products: db.products.length, total_likes: db.likes.length });
});

module.exports = app;
