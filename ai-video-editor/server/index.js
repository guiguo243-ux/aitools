const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const { sequelize, Admin, User, Video, Template, Comment, Banner, Notice, Config, VipOrder } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'zhijian-ai-admin-secret-2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ code: 401, message: '未登录' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ code: 401, message: '登录已过期' });
  }
};

// Initialize database and seed data
async function initDatabase() {
  try {
    await sequelize.sync({ force: false });
    console.log('数据库同步完成');

    // Create default admin
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password: hashedPassword,
        nickname: '超级管理员',
        role: 'super'
      });
      console.log('创建默认管理员: admin / admin123');
    }

    // Seed sample data
    await seedData();
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

async function seedData() {
  // Check if data already exists
  const userCount = await User.count();
  if (userCount > 0) return;

  // Create sample users
  const users = await User.bulkCreate([
    { nickname: '智剪达人', phone: '13888888888', vipStatus: 'active', vipExpireDate: new Date('2025-01-15'), vipType: 'year', points: 2800, totalVideos: 28, status: 'active' },
    { nickname: '视频创作', phone: '13999999999', vipStatus: 'expired', vipExpireDate: new Date('2024-05-01'), vipType: 'quarter', points: 1200, totalVideos: 12, status: 'active' },
    { nickname: '新手用户', phone: '13777777777', vipStatus: 'none', points: 100, totalVideos: 3, status: 'active' },
    { nickname: '美食博主', phone: '13666666666', vipStatus: 'active', vipExpireDate: new Date('2024-12-01'), vipType: 'month', points: 560, totalVideos: 45, status: 'active' },
    { nickname: '电商卖家', phone: '13555555555', vipStatus: 'active', vipExpireDate: new Date('2025-03-01'), vipType: 'year', points: 3200, totalVideos: 89, status: 'active' }
  ]);

  // Create sample videos
  await Video.bulkCreate([
    { userId: users[0].id, title: '春日踏青视频', cover: '', status: 'published', duration: 150, viewCount: 1250, likeCount: 89, commentCount: 12, publishedAt: new Date() },
    { userId: users[1].id, title: '美食探店记录', cover: '', status: 'pending', duration: 105, viewCount: 0 },
    { userId: users[2].id, title: '电商种草视频', cover: '', status: 'published', duration: 200, viewCount: 890, likeCount: 56, commentCount: 8, publishedAt: new Date() },
    { userId: users[3].id, title: '搞笑配音', cover: '', status: 'published', duration: 60, viewCount: 2340, likeCount: 189, commentCount: 34, publishedAt: new Date() },
    { userId: users[4].id, title: '多巴胺穿搭', cover: '', status: 'published', duration: 45, viewCount: 1567, likeCount: 123, commentCount: 21, publishedAt: new Date() }
  ]);

  // Create sample templates
  await Template.bulkCreate([
    { name: '春日踏青', cover: '', category: '生活', usageCount: 8532, status: 'published', isHot: true },
    { name: '美食探店', cover: '', category: '美食', usageCount: 6218, status: 'published', isHot: true },
    { name: '电商种草', cover: '', category: '营销', usageCount: 4892, status: 'published' },
    { name: '节日祝福', cover: '', category: '节日', usageCount: 2340, status: 'pending' },
    { name: '知识分享', cover: '', category: '教程', usageCount: 1567, status: 'published' },
    { name: '舞蹈模板', cover: '', category: '舞蹈', usageCount: 9876, status: 'published', isHot: true, isVipOnly: true }
  ]);

  // Create sample comments
  const videos = await Video.findAll();
  await Comment.bulkCreate([
    { videoId: videos[0].id, userId: users[2].id, content: '这个模板太棒了，学到了！', status: 'approved' },
    { videoId: videos[1].id, userId: users[0].id, content: '内容不错，支持一下', status: 'pending' },
    { videoId: videos[2].id, userId: users[1].id, content: '垃圾视频，取关了', status: 'rejected' }
  ]);

  // Create sample banners
  await Banner.bulkCreate([
    { title: '新用户专享', image: '', link: '', status: 'published', sortOrder: 1, position: 'home' },
    { title: 'VIP会员优惠', image: '', link: '', status: 'published', sortOrder: 2, position: 'home' },
    { title: '热门模板推荐', image: '', link: '', status: 'published', sortOrder: 3, position: 'home' },
    { title: '邀请好友得VIP', image: '', link: '', status: 'published', sortOrder: 4, position: 'home' }
  ]);

  // Create sample notices
  await Notice.bulkCreate([
    { title: '系统升级通知', content: '为提供更好的服务，系统将于今晚22:00-24:00进行升级维护', type: 'system', status: 'published', isTop: true, publishedAt: new Date() },
    { title: '新用户专享活动', content: '首月VIP仅需9.9元，限时优惠不容错过', type: 'activity', status: 'published', publishedAt: new Date() },
    { title: 'VIP会员特权升级', content: '新增AI数字人功能，会员无限使用', type: 'update', status: 'published', publishedAt: new Date() },
    { title: '版本更新公告', content: '智剪AI v1.0.0正式上线，欢迎体验', type: 'update', status: 'published', publishedAt: new Date() }
  ]);

  // Create default configs
  const defaultConfigs = [
    { key: 'app_name', value: '智剪AI', type: 'string', category: 'basic', description: 'App名称' },
    { key: 'app_version', value: 'v1.0.0', type: 'string', category: 'basic', description: 'App版本' },
    { key: 'customer_phone', value: '400-888-8888', type: 'string', category: 'basic', description: '客服电话' },
    { key: 'customer_email', value: 'support@zhijian.ai', type: 'string', category: 'basic', description: '客服邮箱' },
    { key: 'user_agreement_url', value: 'https://zhijian.ai/agreement', type: 'string', category: 'basic', description: '用户协议链接' },
    { key: 'privacy_policy_url', value: 'https://zhijian.ai/privacy', type: 'string', category: 'basic', description: '隐私政策链接' },
    { key: 'free_vip_days', value: '7', type: 'number', category: 'vip', description: '新用户免费VIP天数' },
    { key: 'invite_reward_points', value: '100', type: 'number', category: 'vip', description: '邀请奖励积分' },
    { key: 'video_max_duration', value: '300', type: 'number', category: 'upload', description: '视频最大时长(秒)' },
    { key: 'free_daily_exports', value: '3', type: 'number', category: 'upload', description: '免费用户导出次数/天' },
    { key: 'enable_registration', value: 'true', type: 'boolean', category: 'system', description: '开启用户注册' },
    { key: 'enable_video_review', value: 'true', type: 'boolean', category: 'system', description: '开启视频审核' },
    { key: 'vip_month_price', value: '19', type: 'number', category: 'vip', description: 'VIP月卡价格' },
    { key: 'vip_quarter_price', value: '49', type: 'number', category: 'vip', description: 'VIP季卡价格' },
    { key: 'vip_year_price', value: '199', type: 'number', category: 'vip', description: 'VIP年卡价格' }
  ];
  await Config.bulkCreate(defaultConfigs);

  console.log('示例数据创建完成');
}

// ==================== Admin Routes ====================

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });
    
    if (!admin) {
      return res.json({ code: 400, message: '用户名或密码错误' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.json({ code: 400, message: '用户名或密码错误' });
    }

    if (admin.status === 'disabled') {
      return res.json({ code: 403, message: '账号已被禁用' });
    }

    // Update last login
    await admin.update({ lastLogin: new Date() });

    const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          nickname: admin.nickname,
          role: admin.role
        }
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Dashboard stats
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const userCount = await User.count();
    const videoCount = await Video.count();
    const vipCount = await User.count({ where: { vipStatus: 'active' } });
    
    // Get monthly revenue (mock)
    const monthlyRevenue = 586000;

    // Recent videos
    const recentVideos = await Video.findAll({
      include: [{ model: User, as: 'user', attributes: ['nickname'] }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      code: 200,
      data: {
        userCount,
        videoCount,
        vipCount,
        monthlyRevenue,
        recentVideos: recentVideos.map(v => ({
          id: v.id,
          title: v.title,
          author: v.user?.nickname || '未知',
          status: v.status,
          createdAt: v.createdAt
        }))
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== User Routes ====================

// Get user list
app.get('/api/admin/users', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, keyword = '', status = '' } = req.query;
    const where = {};
    
    if (keyword) {
      where[Op.or] = [
        { nickname: { [Op.like]: `%${keyword}%` } },
        { phone: { [Op.like]: `%${keyword}%` } }
      ];
    }
    if (status) {
      where.status = status;
    }

    const { Op } = require('sequelize');
    const { count, rows } = await User.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      code: 200,
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Update user
app.put('/api/admin/users/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, phone, status, vipStatus, vipExpireDate, points } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.json({ code: 404, message: '用户不存在' });
    }

    await user.update({ nickname, phone, status, vipStatus, vipExpireDate, points });
    
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Toggle user status
app.post('/api/admin/users/:id/toggle', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.json({ code: 404, message: '用户不存在' });
    }

    await user.update({ status: user.status === 'active' ? 'disabled' : 'active' });
    
    res.json({ code: 200, message: '操作成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== Video Routes ====================

// Get video list
app.get('/api/admin/videos', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '', keyword = '' } = req.query;
    const where = {};
    
    if (status) {
      where.status = status;
    }
    if (keyword) {
      where.title = { [Op.like]: `%${keyword}%` };
    }

    const { Op } = require('sequelize');
    const { count, rows } = await Video.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'nickname'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      code: 200,
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Update video status
app.put('/api/admin/videos/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectReason } = req.body;
    
    const video = await Video.findByPk(id);
    if (!video) {
      return res.json({ code: 404, message: '作品不存在' });
    }

    await video.update({ status, rejectReason, approvedAt: status === 'approved' ? new Date() : null });
    
    res.json({ code: 200, message: '操作成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Delete video
app.delete('/api/admin/videos/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);
    
    if (!video) {
      return res.json({ code: 404, message: '作品不存在' });
    }

    await video.destroy();
    
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== Template Routes ====================

// Get template list
app.get('/api/admin/templates', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, keyword = '', status = '', category = '' } = req.query;
    const where = {};
    
    if (status) where.status = status;
    if (keyword) where.name = { [Op.like]: `%${keyword}%` };
    if (category) where.category = category;

    const { Op } = require('sequelize');
    const { count, rows } = await Template.findAndCountAll({
      where,
      order: [['sortOrder', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      code: 200,
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Create template
app.post('/api/admin/templates', authMiddleware, async (req, res) => {
  try {
    const { name, cover, category, description, status, isHot, isVipOnly } = req.body;
    
    const template = await Template.create({
      name, cover, category, description, status, isHot, isVipOnly
    });
    
    res.json({ code: 200, message: '创建成功', data: template });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Update template
app.put('/api/admin/templates/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cover, category, description, status, isHot, isVipOnly, sortOrder } = req.body;
    
    const template = await Template.findByPk(id);
    if (!template) {
      return res.json({ code: 404, message: '模板不存在' });
    }

    await template.update({ name, cover, category, description, status, isHot, isVipOnly, sortOrder });
    
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Delete template
app.delete('/api/admin/templates/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findByPk(id);
    
    if (!template) {
      return res.json({ code: 404, message: '模板不存在' });
    }

    await template.destroy();
    
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== Comment Routes ====================

// Get comment list
app.get('/api/admin/comments', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const where = {};
    
    if (status) where.status = status;

    const { Op } = require('sequelize');
    const { count, rows } = await Comment.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'nickname'] },
        { model: Video, as: 'video', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      code: 200,
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Update comment status
app.put('/api/admin/comments/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.json({ code: 404, message: '评论不存在' });
    }

    await comment.update({ status });
    
    res.json({ code: 200, message: '操作成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Delete comment
app.delete('/api/admin/comments/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    
    if (!comment) {
      return res.json({ code: 404, message: '评论不存在' });
    }

    await comment.destroy();
    
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== Banner Routes ====================

// Get banner list
app.get('/api/admin/banners', authMiddleware, async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({ code: 200, data: banners });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Create banner
app.post('/api/admin/banners', authMiddleware, async (req, res) => {
  try {
    const { title, image, link, linkType, position, status, sortOrder } = req.body;
    
    const banner = await Banner.create({
      title, image, link, linkType, position, status, sortOrder
    });
    
    res.json({ code: 200, message: '创建成功', data: banner });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Update banner
app.put('/api/admin/banners/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, link, linkType, position, status, sortOrder } = req.body;
    
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return res.json({ code: 404, message: 'Banner不存在' });
    }

    await banner.update({ title, image, link, linkType, position, status, sortOrder });
    
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Delete banner
app.delete('/api/admin/banners/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    
    if (!banner) {
      return res.json({ code: 404, message: 'Banner不存在' });
    }

    await banner.destroy();
    
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== Notice Routes ====================

// Get notice list
app.get('/api/admin/notices', authMiddleware, async (req, res) => {
  try {
    const notices = await Notice.findAll({
      order: [['isTop', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({ code: 200, data: notices });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Create notice
app.post('/api/admin/notices', authMiddleware, async (req, res) => {
  try {
    const { title, content, type, status, isTop } = req.body;
    
    const notice = await Notice.create({
      title, content, type, status, isTop,
      publishedAt: status === 'published' ? new Date() : null
    });
    
    res.json({ code: 200, message: '创建成功', data: notice });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Update notice
app.put('/api/admin/notices/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, status, isTop } = req.body;
    
    const notice = await Notice.findByPk(id);
    if (!notice) {
      return res.json({ code: 404, message: '公告不存在' });
    }

    await notice.update({
      title, content, type, status, isTop,
      publishedAt: status === 'published' && !notice.publishedAt ? new Date() : notice.publishedAt
    });
    
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Delete notice
app.delete('/api/admin/notices/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByPk(id);
    
    if (!notice) {
      return res.json({ code: 404, message: '公告不存在' });
    }

    await notice.destroy();
    
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== Config Routes ====================

// Get all configs
app.get('/api/admin/configs', authMiddleware, async (req, res) => {
  try {
    const configs = await Config.findAll();
    
    const configMap = {};
    configs.forEach(c => {
      let value = c.value;
      if (c.type === 'number') value = parseFloat(value);
      if (c.type === 'boolean') value = value === 'true';
      configMap[c.key] = value;
    });

    res.json({ code: 200, data: configMap });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Update configs
app.put('/api/admin/configs', authMiddleware, async (req, res) => {
  try {
    const configs = req.body;
    
    for (const [key, value] of Object.entries(configs)) {
      let strValue = String(value);
      let type = 'string';
      if (typeof value === 'number') type = 'number';
      if (typeof value === 'boolean') type = 'boolean';
      
      await Config.upsert({ key, value: strValue, type });
    }
    
    res.json({ code: 200, message: '保存成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== VIP Routes ====================

// Get VIP stats
app.get('/api/admin/vip/stats', authMiddleware, async (req, res) => {
  try {
    const vipCount = await User.count({ where: { vipStatus: 'active' } });
    
    const { Op } = require('sequelize');
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newVipCount = await User.count({
      where: {
        vipStatus: 'active',
        vipExpireDate: { [Op.gte]: startOfMonth }
      }
    });
    
    const monthlyRevenue = 286000;
    const avgPrice = 156;

    res.json({
      code: 200,
      data: {
        vipCount,
        newVipCount,
        monthlyRevenue,
        avgPrice
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Get VIP users
app.get('/api/admin/vip/users', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const { Op } = require('sequelize');
    const { count, rows } = await User.findAndCountAll({
      where: {
        vipStatus: { [Op.ne]: 'none' }
      },
      order: [['vipExpireDate', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      code: 200,
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Add VIP time
app.post('/api/admin/vip/extend', authMiddleware, async (req, res) => {
  try {
    const { userId, days, planType } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.json({ code: 404, message: '用户不存在' });
    }

    let expireDate = user.vipExpireDate || new Date();
    if (new Date(expireDate) < new Date()) {
      expireDate = new Date();
    }
    
    expireDate.setDate(expireDate.getDate() + days);
    
    await user.update({
      vipStatus: 'active',
      vipExpireDate: expireDate,
      vipType: planType || 'month'
    });
    
    res.json({ code: 200, message: 'VIP延期成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== Points Mall Routes ====================

// Get goods list
app.get('/api/points/goods', async (req, res) => {
  try {
    const { category } = req.query;
    const goods = [
      { id: 1, name: 'VIP月卡', price: 900, originalPrice: 1900, stock: 999, category: 'vip' },
      { id: 2, name: 'VIP季卡', price: 2500, originalPrice: 4900, stock: 999, category: 'vip' },
      { id: 3, name: 'VIP年卡', price: 8000, originalPrice: 19900, stock: 999, category: 'vip' },
      { id: 4, name: '100积分', price: 100, originalPrice: 100, stock: 9999, category: 'points' },
      { id: 5, name: '500积分', price: 450, originalPrice: 500, stock: 9999, category: 'points' },
      { id: 6, name: '1000积分', price: 800, originalPrice: 1000, stock: 9999, category: 'points' },
      { id: 7, name: '定制模板', price: 5000, originalPrice: 10000, stock: 50, category: 'template' },
      { id: 8, name: 'AI次数包', price: 300, originalPrice: 600, stock: 999, category: 'ai' },
    ];
    
    const result = category && category !== 'all' 
      ? goods.filter(g => g.category === category) 
      : goods;
    
    res.json({ code: 200, data: result });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Exchange goods
app.post('/api/points/exchange', async (req, res) => {
  try {
    const { goodsId, userId } = req.body;
    
    const goods = [
      { id: 1, name: 'VIP月卡', price: 900 },
      { id: 2, name: 'VIP季卡', price: 2500 },
      { id: 3, name: 'VIP年卡', price: 8000 },
      { id: 4, name: '100积分', price: 100 },
      { id: 5, name: '500积分', price: 450 },
      { id: 6, name: '1000积分', price: 800 },
      { id: 7, name: '定制模板', price: 5000 },
      { id: 8, name: 'AI次数包', price: 300 },
    ];
    
    const item = goods.find(g => g.id === goodsId);
    if (!item) {
      return res.json({ code: 404, message: '商品不存在' });
    }
    
    res.json({ code: 200, message: '兑换成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== Statistics Routes ====================

// Get dashboard statistics
app.get('/api/admin/statistics', authMiddleware, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    const userCount = await User.count();
    const videoCount = await Video.count();
    const vipCount = await User.count({ where: { vipStatus: 'active' } });
    
    const now = new Date();
    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    const newUserCount = await User.count({
      where: { createdAt: { [Op.gte]: startDate } }
    });
    
    const newVideoCount = await Video.count({
      where: { createdAt: { [Op.gte]: startDate } }
    });
    
    const revenueData = {
      total: 586000,
      today: 15600,
      week: 98600,
      month: 286000
    };
    
    const userGrowth = [
      { date: '2024-03-12', count: 12520 },
      { date: '2024-03-13', count: 12535 },
      { date: '2024-03-14', count: 12550 },
      { date: '2024-03-15', count: 12568 },
      { date: '2024-03-16', count: 12580 },
    ];
    
    const videoCategory = [
      { category: '生活', count: 3250 },
      { category: '美食', count: 2180 },
      { category: '营销', count: 1560 },
      { category: '教程', count: 890 },
      { category: '其他', count: 552 },
    ];
    
    res.json({
      code: 200,
      data: {
        userCount,
        videoCount,
        vipCount,
        newUserCount,
        newVideoCount,
        revenueData,
        userGrowth,
        videoCategory
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== Upload Routes ====================

// Mock upload endpoint
app.post('/api/upload', async (req, res) => {
  try {
    const { type } = req.body;
    const mockUrl = `/uploads/${type}/${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`;
    
    res.json({
      code: 200,
      data: {
        url: mockUrl,
        path: mockUrl
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '上传失败' });
  }
});

// ==================== Payment Routes ====================

// Create order
app.post('/api/order/vip', async (req, res) => {
  try {
    const { planType } = req.body;
    const prices = { month: 1900, quarter: 4900, year: 19900 };
    
    const orderNo = `VIP${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
    
    res.json({
      code: 200,
      data: {
        orderId: orderNo,
        amount: prices[planType] || 1900,
        planType
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '创建订单失败' });
  }
});

// Prepare payment
app.post('/api/pay/prepare', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    res.json({
      code: 200,
      data: {
        timeStamp: Math.floor(Date.now() / 1000).toString(),
        nonceStr: Math.random().toString(36).substr(2, 16),
        package: `prepay_id=${orderId}`,
        signType: 'MD5',
        paySign: 'mock_signature'
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '支付准备失败' });
  }
});

// ==================== Export Routes ====================

// Create export task
app.post('/api/export/create', async (req, res) => {
  try {
    const { videoId, quality, resolution, format } = req.body;
    
    const taskId = Date.now();
    
    res.json({
      code: 200,
      data: {
        id: taskId,
        status: 'pending',
        progress: 0
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '创建导出任务失败' });
  }
});

// Get export progress
app.get('/api/export/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const progress = Math.floor(Math.random() * 100);
    
    res.json({
      code: 200,
      data: {
        id: parseInt(id),
        status: progress >= 100 ? 'completed' : 'processing',
        progress: Math.min(progress, 100),
        url: progress >= 100 ? `/uploads/video/${id}.mp4` : null
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '获取进度失败' });
  }
});

// ==================== WeChat Config Routes ====================

// Get WeChat config
app.get('/api/admin/wechat/config', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    res.json({
      code: 200,
      data: {
        type: type || 'miniapp',
        appId: '',
        appSecret: '',
        enabled: true
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Save WeChat config
app.post('/api/admin/wechat/config', authMiddleware, async (req, res) => {
  try {
    const { type, appId, appSecret, token, aesKey, enabled, ...extra } = req.body;
    res.json({ code: 200, message: '配置保存成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Get payment config
app.get('/api/admin/payment/config', authMiddleware, async (req, res) => {
  try {
    res.json({
      code: 200,
      data: {
        mchId: '',
        enabled: true
      }
    });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Save payment config
app.post('/api/admin/payment/config', authMiddleware, async (req, res) => {
  try {
    const { mchId, apiKey, apiV3Key, privateKey, publicKey, enabled } = req.body;
    res.json({ code: 200, message: '支付配置保存成功' });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// Get payment logs
app.get('/api/admin/payment/logs', authMiddleware, async (req, res) => {
  try {
    const logs = [
      { orderNo: 'VIP2024031810001', userId: 1, amount: 49, status: 'paid', createdAt: new Date() },
      { orderNo: 'VIP2024031810002', userId: 2, amount: 199, status: 'paid', createdAt: new Date() },
      { orderNo: 'VIP2024031810003', userId: 3, amount: 19, status: 'pending', createdAt: new Date() },
    ];
    res.json({ code: 200, data: logs });
  } catch (error) {
    res.json({ code: 500, message: '服务器错误' });
  }
});

// ==================== Start Server ====================

// Create data directory
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

app.listen(PORT, async () => {
  console.log(`管理后台服务已启动: http://localhost:${PORT}`);
  await initDatabase();
});
