import sequelize from './config.js';

async function initializeDatabase() {
    try {
        console.log('Попытка проверки подключения к базе данных...');
        await sequelize.authenticate();
        console.log('🟢 Соединение с базой данных MySQL установлено через Sequelize.');
    } catch (error) {
        console.error('❌ Ошибка инициализации базы данных:', error.message);
        process.exit(1);
    }
}

export { initializeDatabase };