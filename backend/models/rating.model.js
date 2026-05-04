import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Rating = sequelize.define('Rating', {
    rating_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    session_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'sessions', key: 'session_id' }
    },
    mentor_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mentee_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'ratings',
    timestamps: true
});

export default Rating;