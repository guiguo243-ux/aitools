const fs = require('fs');
const path = require('path');
const { User, Video, Template, VipOrder, Comment } = require('../models');

class ExportService {
  constructor(options = {}) {
    this.exportDir = options.exportDir || path.join(__dirname, '../exports');
    
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }
  }

  /**
   * Export users to CSV/Excel
   */
  async exportUsers(options = {}) {
    const { format = 'csv', status = '' } = options;
    
    const where = {};
    if (status) {
      where.status = status;
    }
    
    const users = await User.findAll({ where });
    
    const headers = ['ID', '昵称', '手机号', 'VIP状态', 'VIP到期日', '积分', '作品数', '注册时间', '状态'];
    const rows = users.map(u => [
      u.id,
      u.nickname,
      u.phone || '',
      u.vipStatus,
      u.vipExpireDate || '',
      u.points,
      u.totalVideos,
      this.formatDate(u.createdAt),
      u.status
    ]);
    
    return this.writeFile('users', format, headers, rows);
  }

  /**
   * Export videos to CSV/Excel
   */
  async exportVideos(options = {}) {
    const { format = 'csv', status = '' } = options;
    
    const where = {};
    if (status) {
      where.status = status;
    }
    
    const videos = await Video.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['nickname'] }]
    });
    
    const headers = ['ID', '标题', '作者', '时长', '状态', '浏览量', '点赞数', '评论数', '创建时间'];
    const rows = videos.map(v => [
      v.id,
      v.title,
      v.user?.nickname || '',
      this.formatDuration(v.duration),
      v.status,
      v.viewCount,
      v.likeCount,
      v.commentCount,
      this.formatDate(v.createdAt)
    ]);
    
    return this.writeFile('videos', format, headers, rows);
  }

  /**
   * Export orders to CSV/Excel
   */
  async exportOrders(options = {}) {
    const { format = 'csv', status = '', startDate, endDate } = options;
    
    const where = {};
    if (status) where.status = status;
    if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate) where.createdAt = { ...where.createdAt, [Op.lte]: new Date(endDate) };
    
    const orders = await VipOrder.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['nickname', 'phone'] }]
    });
    
    const headers = ['订单号', '用户', '手机号', '套餐', '金额', '支付方式', '状态', '支付时间'];
    const rows = orders.map(o => [
      o.orderNo,
      o.user?.nickname || '',
      o.user?.phone || '',
      this.getPlanName(o.planType),
      o.amount,
      o.paymentMethod,
      o.status,
      o.paidAt ? this.formatDate(o.paidAt) : ''
    ]);
    
    return this.writeFile('orders', format, headers, rows);
  }

  /**
   * Export templates to CSV/Excel
   */
  async exportTemplates(options = {}) {
    const { format = 'csv', status = '' } = options;
    
    const where = {};
    if (status) where.status = status;
    
    const templates = await Template.findAll({ where });
    
    const headers = ['ID', '名称', '分类', '作者', '使用次数', '状态', '创建时间'];
    const rows = templates.map(t => [
      t.id,
      t.name,
      t.category,
      t.author || '',
      t.usageCount,
      t.status,
      this.formatDate(t.createdAt)
    ]);
    
    return this.writeFile('templates', format, headers, rows);
  }

  /**
   * Export comments to CSV/Excel
   */
  async exportComments(options = {}) {
    const { format = 'csv', status = '' } = options;
    
    const where = {};
    if (status) where.status = status;
    
    const comments = await Comment.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['nickname'] },
        { model: Video, as: 'video', attributes: ['title'] }
      ]
    });
    
    const headers = ['ID', '内容', '作者', '作品', '状态', '时间'];
    const rows = comments.map(c => [
      c.id,
      c.content.substring(0, 50),
      c.user?.nickname || '',
      c.video?.title || '',
      c.status,
      this.formatDate(c.createdAt)
    ]);
    
    return this.writeFile('comments', format, headers, rows);
  }

  /**
   * Generate statistics report
   */
  async exportStatisticsReport(options = {}) {
    const { startDate, endDate, format = 'xlsx' } = options;
    
    const users = await User.findAll();
    const videos = await Video.findAll();
    const orders = await VipOrder.findAll({ where: { status: 'paid' } });
    
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.amount), 0);
    const vipUsers = users.filter(u => u.vipStatus === 'active').length;
    
    const report = [
      ['智剪AI 数据统计报表'],
      [`导出时间: ${this.formatDate(new Date())}`],
      [''],
      ['一、用户统计'],
      [`总用户数: ${users.length}`],
      [`VIP会员数: ${vipUsers}`],
      [`普通用户数: ${users.length - vipUsers}`],
      [''],
      ['二、作品统计'],
      [`总作品数: ${videos.length}`],
      [`已发布: ${videos.filter(v => v.status === 'published').length}`],
      [`待审核: ${videos.filter(v => v.status === 'pending').length}`],
      [''],
      ['三、收入统计'],
      [`总收入: ¥${totalRevenue.toFixed(2)}`],
      [`订单数: ${orders.length}`],
      [`平均客单价: ¥${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0}`]
    ];
    
    const filename = `statistics_${Date.now()}.${format === 'xlsx' ? 'xlsx' : 'csv'}`;
    const filePath = path.join(this.exportDir, filename);
    
    // Simple CSV format for now
    const content = report.map(row => row.join(',')).join('\n');
    fs.writeFileSync(filePath.replace('.xlsx', '.csv'), '\ufeff' + content);
    
    return {
      success: true,
      filename,
      path: filePath.replace('.xlsx', '.csv'),
      url: `/exports/${filename.replace('.xlsx', '.csv')}`
    };
  }

  /**
   * Write data to file
   */
  async writeFile(name, format, headers, rows) {
    const timestamp = Date.now();
    const filename = `${name}_${timestamp}.${format === 'xlsx' ? 'xlsx' : 'csv'}`;
    const filePath = path.join(this.exportDir, filename);
    
    // CSV format with BOM for Excel
    let content = headers.join(',') + '\n';
    rows.forEach(row => {
      content += row.map(cell => {
        const str = String(cell);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',') + '\n';
    });
    
    fs.writeFileSync(filePath, '\ufeff' + content);
    
    return {
      success: true,
      filename,
      path: filePath,
      url: `/exports/${filename}`,
      rowCount: rows.length
    };
  }

  /**
   * Format date
   */
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('zh-CN');
  }

  /**
   * Format duration
   */
  formatDuration(seconds) {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  /**
   * Get plan name
   */
  getPlanName(type) {
    const names = { month: '月卡', quarter: '季卡', year: '年卡' };
    return names[type] || type;
  }
}

module.exports = ExportService;
