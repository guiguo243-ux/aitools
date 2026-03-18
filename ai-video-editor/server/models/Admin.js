const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING,
    defaultValue: '管理员'
  },
  role: {
    type: DataTypes.ENUM('super', 'normal'),
    defaultValue: 'super'
  },
  status: {
    type: DataTypes.ENUM('active', 'disabled'),
    defaultValue: 'active'
  },
  lastLogin: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'admins',
  timestamps: true
});

module.exports = Admin;
