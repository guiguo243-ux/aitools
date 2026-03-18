const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cover: {
    type: DataTypes.STRING
  },
  preview: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  subCategory: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  aspectRatio: {
    type: DataTypes.STRING,
    defaultValue: '9:16'
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'published'),
    defaultValue: 'draft'
  },
  isHot: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVipOnly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  author: {
    type: DataTypes.STRING
  },
  authorId: {
    type: DataTypes.INTEGER
  },
  music: {
    type: DataTypes.STRING
  },
  effects: {
    type: DataTypes.TEXT
  },
  materials: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'templates',
  timestamps: true
});

module.exports = Template;
