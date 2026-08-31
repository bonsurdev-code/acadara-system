import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Mentee = sequelize.define('Mentee', {
  mentee_id: { type: DataTypes.STRING(50), primaryKey: true },
  usr_id: { type: DataTypes.STRING(50), allowNull: false },
  mentee_subject: DataTypes.STRING(60),
  mentee_description: DataTypes.TEXT,
  mentee_lvl: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
  mentee_availability: DataTypes.RANGE(DataTypes.DATEONLY),
  mentee_embedding: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, { tableName: 'mentees', timestamps: false });

export default Mentee;