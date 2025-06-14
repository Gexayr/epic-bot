import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    chat_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    first_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    lang: {
        type: DataTypes.STRING(5),
        defaultValue: 'en'
    },
    info: {
        type: DataTypes.JSON,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: false
});

export default User;