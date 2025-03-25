const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

// Note-Tag association model
class NoteTag extends Model {}

NoteTag.init({
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
  tag_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'NoteTag',
  tableName: 'note_tags',
  timestamps: true,
  updatedAt: false
});

module.exports = NoteTag;