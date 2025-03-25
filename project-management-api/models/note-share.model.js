const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class NoteShare extends Model { }

NoteShare.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  note_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'notes',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  permission: {
    type: DataTypes.ENUM('view', 'edit', 'admin'),
    defaultValue: 'view'
  },
  shared_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'NoteShare',
  tableName: 'note_shares',
  timestamps: true
});

module.exports = NoteShare;