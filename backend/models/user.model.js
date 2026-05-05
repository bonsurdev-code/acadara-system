import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Note the .js extension

const User = sequelize.define('User', {
  usr_id: { type: DataTypes.STRING(50), primaryKey: true },
  usr_name: { type: DataTypes.STRING(60), allowNull: false },
  usr_email: { type: DataTypes.STRING(60), unique: true, allowNull: false },
  usr_password: { type: DataTypes.STRING(60), allowNull: false },
  usr_role: { 
    type: DataTypes.ENUM('mentee', 'mentor', 'admin'),
    defaultValue: 'mentee',
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: true
  },
  provider_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, { 
  tableName: 'users', 
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: false 
});

export default User;