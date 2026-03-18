const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Config = sequelize.define('Config', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
    defaultValue: 'string'
  },
  description: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'general'
  }
}, {
  tableName: 'configs',
  timestamps: true
});

module.exports = Config;
