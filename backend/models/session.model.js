// models/session.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Session = sequelize.define('Session', {
  session_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  match_id: { type: DataTypes.UUID, references: { model: 'matched_users', key: 'match_id' } },
  
  requested_date: { type: DataTypes.DATE, allowNull: false },
  meeting_event: { type: DataTypes.ENUM('online', 'f2f'), allowNull: false },
  mentee_agenda: { type: DataTypes.TEXT, allowNull: false },
  
  is_date_agreed: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_event_agreed: { type: DataTypes.BOOLEAN, defaultValue: false },
  mentor_feedback: { type: DataTypes.TEXT },
  study_goal: { type: DataTypes.JSONB,
  defaultValue: [] 
  },
  meeting_link: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  materials_note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
    
  status: { 
    type: DataTypes.ENUM('negotiating', 'confirmed', 'completed', 'cancelled'), 
    defaultValue: 'negotiating' 
  }
}, {
  // ADD THIS LINE TO MATCH YOUR SQL QUERY
  tableName: 'sessions', 
  timestamps: true // This ensures Sequelize handles "createdAt" and "updatedAt"
});

export default Session;