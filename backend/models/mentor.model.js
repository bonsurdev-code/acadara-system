import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Mentor = sequelize.define('Mentor', {
  mentor_id: { type: DataTypes.STRING(10), primaryKey: true },
  usr_id: { type: DataTypes.STRING(10), allowNull: false },
  mentor_subject: DataTypes.STRING(60),
  mentor_topics: DataTypes.TEXT,
  mentor_experience: DataTypes.STRING(60),
  mentor_availability: DataTypes.RANGE(DataTypes.DATE),
  mentor_embedding: {
    type: DataTypes.JSONB, 
    allowNull: true
  }
}, { tableName: 'mentors', timestamps: false });

export default Mentor;