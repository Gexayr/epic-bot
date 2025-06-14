import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Principle = sequelize.define('Principle', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text_en: { type: DataTypes.TEXT, allowNull: false },
    text_ru: { type: DataTypes.TEXT, allowNull: false },
    text_am: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'principles', timestamps: false });

export default Principle;