const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING
  },
  link: {
    type: DataTypes.STRING
  },
  linkType: {
    type: DataTypes.ENUM('none', 'video', 'template', 'page', 'url'),
    defaultValue: 'none'
  },
  position: {
    type: DataTypes.ENUM('home', 'discover', 'profile'),
    defaultValue: 'home'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'disabled'),
    defaultValue: 'draft'
  },
  startDate: {
    type: DataTypes.DATEONLY
  },
  endDate: {
    type: DataTypes.DATEONLY
  },
  clickCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'banners',
  timestamps: true
});

module.exports = Banner;
