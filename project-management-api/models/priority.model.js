const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Priority = sequelize.define('Priority', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  order_position: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  tableName: 'priorities',
  timestamps: false // This table doesn't have timestamp columns
});

module.exports = Priority;