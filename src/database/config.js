import { Sequelize } from 'sequelize';
import 'dotenv/config';

const dbHost = process.env.MYSQL_DB_HOST || 'localhost';
const dbName = process.env.MYSQL_DATABASE || 'telegram_bot_db';
const dbUser = process.env.MYSQL_USER || 'root';
const dbPassword = process.env.MYSQL_PASSWORD || 'password';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: dbHost,
    database: dbName,
    username: dbUser,
    password: dbPassword,
    logging: false
});

export default sequelize;