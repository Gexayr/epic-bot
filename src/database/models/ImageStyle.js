import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const ImageStyle = sequelize.define('ImageStyle', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    style_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'image_styles',
    timestamps: false
});

export default ImageStyle;