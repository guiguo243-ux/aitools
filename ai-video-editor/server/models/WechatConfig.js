const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WechatConfig = sequelize.define('WechatConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('miniapp', 'mp', 'openplatform', 'payment'),
    allowNull: false,
    unique: true
  },
  appId: {
    type: DataTypes.STRING
  },
  appSecret: {
    type: DataTypes.TEXT
  },
  mchId: {
    type: DataTypes.STRING
  },
  apiKey: {
    type: DataTypes.TEXT
  },
  apiV3Key: {
    type: DataTypes.TEXT
  },
  privateKey: {
    type: DataTypes.TEXT
  },
  publicKey: {
    type: DataTypes.TEXT
  },
  token: {
    type: DataTypes.STRING
  },
  aesKey: {
    type: DataTypes.STRING
  },
  originalId: {
    type: DataTypes.STRING
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  extra: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'wechat_configs',
  timestamps: true
});

module.exports = WechatConfig;
