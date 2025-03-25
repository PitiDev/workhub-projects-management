const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class NoteBlock extends Model {}

NoteBlock.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  note_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'notes', // Reference by table name instead of model
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('text', 'heading', 'image', 'code', 'quote', 'list', 'checklist', 'divider', 'embed'),
    defaultValue: 'text'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  order_position: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'NoteBlock',
  tableName: 'note_blocks',
  timestamps: true
});

module.exports = NoteBlock;