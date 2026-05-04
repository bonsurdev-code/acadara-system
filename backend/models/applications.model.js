import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MentorApplications = sequelize.define('MentorApplications', {
    app_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    usr_id: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    full_name: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    expertise: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    linkedin_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    mentorship_bio: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    admin_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    applied_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'mentor_applications',
    timestamps: false // We are using applied_at manually to match your SQL
});

export default MentorApplications;