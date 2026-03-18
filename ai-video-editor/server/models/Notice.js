const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notice = sequelize.define('Notice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('system', 'activity', 'update', 'maintenance'),
    defaultValue: 'system'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'disabled'),
    defaultValue: 'draft'
  },
  isTop: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  publishedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'notices',
  timestamps: true
});

module.exports = Notice;
