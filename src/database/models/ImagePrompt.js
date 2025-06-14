import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const ImagePrompt = sequelize.define('ImagePrompt', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    prompt: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    style: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'image_prompt',
    timestamps: false
});

export default ImagePrompt;