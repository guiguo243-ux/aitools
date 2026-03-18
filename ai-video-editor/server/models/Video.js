const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  cover: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.STRING
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  width: {
    type: DataTypes.INTEGER,
    defaultValue: 720
  },
  height: {
    type: DataTypes.INTEGER,
    defaultValue: 1280
  },
  size: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'published', 'removed'),
    defaultValue: 'draft'
  },
  rejectReason: {
    type: DataTypes.STRING
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  commentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  shareCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  allowDownload: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allowComment: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  tags: {
    type: DataTypes.STRING
  },
  templateId: {
    type: DataTypes.INTEGER
  },
  publishedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'videos',
  timestamps: true
});

module.exports = Video;
