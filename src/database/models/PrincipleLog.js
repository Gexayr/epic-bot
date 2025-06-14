import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const PrincipleLog = sequelize.define('PrincipleLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'principles_log',
    timestamps: false
});

export default PrincipleLog;