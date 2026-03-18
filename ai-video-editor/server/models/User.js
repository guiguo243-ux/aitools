const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: DataTypes.STRING,
    unique: true
  },
  nickname: {
    type: DataTypes.STRING,
    defaultValue: '新用户'
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  phone: {
    type: DataTypes.STRING
  },
  gender: {
    type: DataTypes.ENUM('unknown', 'male', 'female'),
    defaultValue: 'unknown'
  },
  birthday: {
    type: DataTypes.DATEONLY
  },
  province: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  bio: {
    type: DataTypes.STRING
  },
  vipStatus: {
    type: DataTypes.ENUM('none', 'active', 'expired'),
    defaultValue: 'none'
  },
  vipExpireDate: {
    type: DataTypes.DATE
  },
  vipType: {
    type: DataTypes.ENUM('month', 'quarter', 'year'),
    defaultValue: 'month'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  inviteCode: {
    type: DataTypes.STRING,
    unique: true
  },
  invitedBy: {
    type: DataTypes.INTEGER
  },
  totalInvites: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'disabled'),
    defaultValue: 'active'
  },
  totalVideos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalExports: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  todayExports: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastExportDate: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
