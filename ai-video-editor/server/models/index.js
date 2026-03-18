const sequelize = require('../config/database');
const Admin = require('./Admin');
const User = require('./User');
const Video = require('./Video');
const Template = require('./Template');
const Comment = require('./Comment');
const Banner = require('./Banner');
const Notice = require('./Notice');
const Config = require('./Config');
const VipOrder = require('./VipOrder');
const WechatConfig = require('./WechatConfig');

// Define associations
User.hasMany(Video, { foreignKey: 'userId', as: 'videos' });
Video.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Video.hasMany(Comment, { foreignKey: 'videoId', as: 'comments' });
Comment.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });

User.hasMany(VipOrder, { foreignKey: 'userId', as: 'vipOrders' });
VipOrder.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  Admin,
  User,
  Video,
  Template,
  Comment,
  Banner,
  Notice,
  Config,
  VipOrder,
  WechatConfig
};
