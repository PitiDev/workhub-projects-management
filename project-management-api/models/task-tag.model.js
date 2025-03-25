const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TaskTag = sequelize.define('TaskTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tag_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'task_tags',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // No updated_at column for this table
  indexes: [
    {
      unique: true,
      fields: ['task_id', 'tag_id']
    }
  ]
});

module.exports = TaskTag;