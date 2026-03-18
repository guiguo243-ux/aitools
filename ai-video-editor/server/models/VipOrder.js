const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VipOrder = sequelize.define('VipOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  orderNo: {
    type: DataTypes.STRING,
    unique: true
  },
  planType: {
    type: DataTypes.ENUM('month', 'quarter', 'year'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('wechat', 'alipay', 'ios', 'points'),
    defaultValue: 'wechat'
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'cancelled', 'refunded'),
    defaultValue: 'pending'
  },
  paidAt: {
    type: DataTypes.DATE
  },
  startDate: {
    type: DataTypes.DATE
  },
  endDate: {
    type: DataTypes.DATE
  },
  transactionId: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'vip_orders',
  timestamps: true
});

module.exports = VipOrder;
