import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Message = sequelize.define('Message', {
  message_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  match_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'matched_users', key: 'match_id' }
  },
  sender_id: {
    type: DataTypes.STRING, // Store the MNT- or MTR- ID
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'messages',
  timestamps: true
});

export default Message;