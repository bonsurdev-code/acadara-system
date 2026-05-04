import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Match = sequelize.define('Match', {
  match_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  mentee_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: { model: 'mentees', key: 'mentee_id' }
  },
  mentor_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: { model: 'mentors', key: 'mentor_id' }
  },
  // The concatenated text used for the OpenAI embedding
  text_embedded: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Higher score = better semantic match
  similarity_score: {
    type: DataTypes.DECIMAL(5, 4), // e.g., 0.9852
    allowNull: false
  },
  // To track the lifecycle of the match
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'expired'),
    defaultValue: 'pending'
  },
  // Store the overlap percentage of availability or subject match details
  match_metadata: {
    type: DataTypes.JSONB, 
    allowNull: true
  }
}, { 
  tableName: 'matched_users', 
  timestamps: true // Useful to see when the AI last ran the matching logic
});

export default Match;