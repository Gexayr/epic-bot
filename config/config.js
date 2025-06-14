import { config } from 'dotenv';
config();

export default {
    development: {
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'password',
        database: process.env.MYSQL_DATABASE || 'telegram_bot_db',
        host: process.env.MYSQL_DB_HOST || 'db',
        dialect: 'mysql',
        logging: false,
    },
    test: {
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'password',
        database: process.env.MYSQL_DATABASE || 'telegram_bot_db_test',
        host: process.env.MYSQL_DB_HOST || 'db',
        dialect: 'mysql',
        logging: false,
    },
    production: {
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'password',
        database: process.env.MYSQL_DATABASE || 'telegram_bot_db',
        host: process.env.MYSQL_DB_HOST || 'db',
        dialect: 'mysql',
        logging: false,
    },
};