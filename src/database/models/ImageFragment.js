import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const ImageFragment = sequelize.define('ImageFragment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    setting: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'image_fragments',
    timestamps: false
});

export default ImageFragment;