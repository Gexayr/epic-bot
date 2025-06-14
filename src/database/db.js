import sequelize from './config.js';

async function initializeDatabase() {
    try {
        await sequelize.sync({ force: false });
        console.log('🟢 Соединение с базой данных MySQL установлено через Sequelize.');
    } catch (error) {
        console.error('❌ Ошибка инициализации базы данных:', error.message);
        process.exit(1);
    }
}

async function checkConnection() {
    if (!sequelize) {
        await initializeDatabase();
    }
}

export { sequelize, initializeDatabase, checkConnection };