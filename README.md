# Epic Bot - Telegram Motivational Bot

Epic Bot is a Telegram bot designed to send daily motivational tips and images to users. Built with Node.js, it utilizes a MySQL database for storing user data, principles, and image prompts, and is containerized using Docker for easy deployment.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Bot](#running-the-bot)
- [Database Management](#database-management)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features
- Sends daily motivational principles in multiple languages (English, Russian, Armenian).
- Generates and sends motivational images based on random prompts and styles.
- Supports user language selection via inline keyboard.
- Automatically deactivates users who block the bot.
- Uses Sequelize for database ORM and migrations.

## Prerequisites
- **Node.js**: Version 18.x (e.g., 18.20.8)
- **Docker**: For containerization
- **Docker Compose**: For multi-container setup
- **npm**: Node package manager
- **MySQL**: Version 8 (runs in a Docker container)



## Overview
Epic Bot is a Telegram bot designed to send daily motivational tips and images to users. The bot supports multiple languages (English, Russian, and Armenian) and integrates with a MySQL database to manage user data, principles, and image prompts. It uses Node.js, Sequelize for database management, and Docker for containerization.

## Features
- Sends daily motivational principles and images at 5:00 AM.
- Supports language selection (English, Russian, Armenian) via inline keyboard.
- Manages user registrations and deactivates users who block the bot.
- Generates random image prompts and motivational content using external services.
- Stores data in a MySQL database with automatic table creation via migrations.

## Prerequisites
- Node.js (v18.20.8 or later)
- Docker and Docker Compose
- MySQL 8
- Git (for version control)

## Installation


## Project Structure

````
epic-bot/
├── src/
│   ├── bot.js
│   ├── database/
│   │   ├── db.js
│   │   ├── config.js
│   │   ├── initData.js
│   │   ├── models/
│   │   │   ├── ImageFragment.js
│   │   │   ├── ImagePrompt.js
│   │   │   ├── ImageStyle.js
│   │   │   ├── Principle.js
│   │   │   ├── PrincipleLog.js
│   │   │   ├── User.js
│   │   │   └── index.js
│   │   └── tables.sql
│   ├── node_modules/
│   ├── services/
│   │   ├── imageService.js
│   │   └── principleService.js
│   ├── utils/
│   │   ├── commonUtils.js
│   │   └── imageUtils.js
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
````


## Prerequisites
- Node.js (v18.20.8 or later)
- Docker and Docker Compose
- MySQL server (managed via Docker in this setup)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Gexayr/epic-bot
cd /var/www/epic-bot
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update the following variables:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token
FREEPIK_API_KEY=your_freepik_api_key
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=telegram_bot_db
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DB_HOST=mysql-database
```

### 3. Install Dependencies
```npm install
    npm install sequelize-cli --save-dev
    npm install dotenv
```

### 4. Build and Run with Docker

```bash
    docker-compose down
    docker-compose up --build
```
### 5. Apply Sequelize Migrations
Enter the bot container and apply migrations:
```bash
    docker exec -it epic-bot bash
    npx sequelize-cli db:migrate
```

```bash
    npx sequelize-cli db:seed:all
```

### 6. Verify Logs
Check the logs to ensure the bot and database are running:

```bash
    docker logs epic-bot
    docker logs mysql-database
```

## Usage
- The bot starts polling for Telegram messages and schedules daily tasks at 5:00 AM.
- Use `/start` to register or reactivate your chat with the bot.
- Use the settings callback to change the language (Russian, Armenian, English).

## Sequelize Configuration

### Setting Up Sequelize
Sequelize is used to manage the MySQL database. Follow these steps to configure and use it:

- Install Sequelize and CLI:
```bash
    npm install sequelize
    npm install sequelize-cli --save-dev
```

- Initialize Sequelize CLI:

```angular2html
    npx sequelize-cli init
```

- Configure config/config.js for ES6 modules (due to "type": "module" in package.json):

```js

import { config } from 'dotenv';
config();

export default {
    development: {
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'password',
        database: process.env.MYSQL_DATABASE || 'telegram_bot_db',
        host: process.env.MYSQL_DB_HOST || 'mysql-database',
        dialect: 'mysql',
        logging: false,
    },
    test: {
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'password',
        database: process.env.MYSQL_DATABASE || 'telegram_bot_db_test',
        host: process.env.MYSQL_DB_HOST || 'mysql-database',
        dialect: 'mysql',
        logging: false,
    },
    production: {
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'password',
        database: process.env.MYSQL_DATABASE || 'telegram_bot_db',
        host: process.env.MYSQL_DB_HOST || 'mysql-database',
        dialect: 'mysql',
        logging: false,
    },
};
```

- Create migration files for each table (e.g., users, image_fragments):

```bash
    npx sequelize-cli migration:generate --name create-users
    npx sequelize-cli migration:generate --name create-image_fragments
```

Edit the generated files (e.g., 20250614192852-create-image_fragments.js) with the table structure:

```js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('image_fragments', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            subject: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            action: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            setting: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('image_fragments');
    },
};
```

- Apply migrations:
```bash
    npx sequelize-cli db:migrate 
```


- Roll back migrations if needed:
```bash
    npx sequelize-cli db:migrate:undo
```
or

```bash
    npx sequelize-cli db:migrate:undo:all
```

- Initialize database connection in db.js:
```js
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

async function checkConnection() {
    if (!sequelize) {
        await initializeDatabase();
    }
}

export { sequelize, initializeDatabase, checkConnection };
```

### Notes
- The `README.md` is written in Markdown format, suitable for GitHub or other documentation platforms.
- It incorporates all relevant details from our conversation, including setup steps, error fixes, and project structure.
- Adjust the GitHub URL, license, and acknowledgments as needed for your specific project.
- The file assumes the project is hosted in `/var/www/epic-bot/`, which matches your context; modify paths if different.

Let me know if you need further adjustments!


## Files and Configuration

### 1. `Dockerfile`

```Dockerfile
# Базовый образ с Node.js
FROM node:18-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY src/package.json .
RUN npm install

# Копируем все файлы проекта
COPY . .

# Команда для запуска бота
CMD ["node", "bot.js"]
```
- **Purpose**: Builds a Docker image with Node.js, installs dependencies, and runs `bot.js`.
- **Note**: Uses `node:18-slim` for a lightweight image.

### 2. `package.json`
```json
{
  "name": "epic-bot",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/bot.js"
  },
  "dependencies": {
    "axios": "^1.10.0",
    "dotenv": "^16.5.0",
    "mysql2": "^3.14.1",
    "node-cron": "^4.1.0",
    "node-telegram-bot-api": "^0.61.0",
    "sequelize": "^6.37.7"
  },
  "devDependencies": {
    "sequelize-cli": "^6.6.3"
  }
}
```

Troubleshooting
- Error: Cannot find module '/src/bot.js'
    - Ensure Dockerfile has WORKDIR /app and CMD ["node", "src/bot.js"]. Alternatively, move src/* to /app with RUN mv src/* . || true.
- Error: permission denied on mysql/#innodb_redo
    - Check and fix permissions: chmod -R 755 mysql and chown -R $(whoami):$(whoami) mysql.
    - Optionally, comment out volumes: - ./mysql:/var/lib/mysql in docker-compose.yml for testing.
- Error: Table 'telegram_bot_db.users' doesn't exist
    - Run npx sequelize-cli db:migrate to create tables.
- Error: ReferenceError: require is not defined
    - Update config/config.js to use import { config } from 'dotenv'; config(); and export default.
- Connection Issues
    - Verify .env variables and ensure MySQL container (mysql-database) is running.

Contributing
Feel free to submit issues or pull requests on the GitHub repository.

License
MIT License (specify if applicable).

Acknowledgements
- Built with assistance from xAI's Grok.
- Uses Node.js, Sequelize, and Docker technologies.
- 
- **Purpose**: Defines project metadata and dependencies.
- **Setup**: Run `npm install` locally to install `node-telegram-bot-api`, `node-cron`, and `dotenv`.

- **Purpose**: Telegram bot script that loads `principles.json`, sends 10 random principles daily at 9 AM.
- **Dynamic Updates**: The `loadPrinciples()` function reloads `principles.json` before each send, so changes to the file are reflected without restarting the bot.

- **Purpose**: Stores principles for the bot to send.
- **Note**: Edit this file anytime; changes will apply at the next 9 AM run.

### 5. `.env`
```
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_CHAT_ID=123456789
MYSQL_ROOT_PASSWORD=your-mysql-root-password
MYSQL_DATABASE=your-database-name
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
```
- **Purpose**: Stores sensitive data (bot token, chat ID, and MySQL credentials).
- **Setup**:
   1. Get `TELEGRAM_BOT_TOKEN` from @BotFather in Telegram.
   2. Get `TELEGRAM_CHAT_ID`: Run `node bot.js` locally, send a message to the bot, and check logs for the ID (requires temporary polling—add `bot.startPolling()` to `bot.js` for testing, then remove).
   3. Add MySQL credentials as environment variables.
   4. **Security**: Do not commit `.env` to Git!

### 6. `docker-compose.yml`
```yaml
version: '3.8'

services:
  # Service for your Node.js Telegram bot
  bot:
    build:
      context: .
    container_name: telegram-bot
    restart: always
    env_file:
      - .env
    networks:
      - bot_network

  # Service for the MySQL database
  db:
    image: mysql:8
    container_name: mysql-database
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    env_file:
      - .env
    ports:
      - "33106:3306"
    volumes:
      - mysql_data:./docker-data/mysql
    networks:
      - bot_network

volumes:
  mysql_data:

networks:
  bot_network:
    driver: bridge
```
- **Purpose**: Defines services for the Telegram bot and MySQL database using Docker Compose.
- **Setup**: Ensure `.env` contains MySQL credentials and run `docker-compose up -d` to start services.

## README: How to Run the Bot with Docker

### Prerequisites
- **Node.js**: Install locally to test and install dependencies (e.g., `npm install`).
- **Docker**: Install Docker (e.g., Docker Desktop or Docker Engine).
- **Docker Compose**: Install Docker Compose (included with Docker Desktop or separately).
- **Telegram**:
   - Create a bot via @BotFather to get `TELEGRAM_BOT_TOKEN`.
   - Send a message to the bot, check logs for `TELEGRAM_CHAT_ID` (temporarily add `bot.on('message', (msg) => console.log('Chat ID:', msg.chat.id))` and `bot.startPolling()` to `bot.js`).

### Steps to Run
1. **Prepare the Project**
   - Ensure all files (`Dockerfile`, `package.json`, `bot.js`, `principles.json`, `.env`, `docker-compose.yml`) are in the `epic-bot/` directory.
   - Run locally to test:
     ```bash
     npm install
     node bot.js
     ```
      - Check logs for "🟢 Бот запущен" and test messages in Telegram.
      - Update `.env` with correct `TELEGRAM_CHAT_ID` and MySQL credentials.

2. **Build and Run with Docker Compose**
   - Run in the `epic-bot/` directory:
     ```bash
     docker-compose up -d
     ```
   - This builds the bot image and starts both the bot and MySQL services in detached mode.

3. **Check Logs**
   - View logs to confirm the bot and database are running:
     ```bash
     docker-compose logs -f
     ```
   - Expected output:
     ```
     bot_1     | 🟢 Бот запущен
     bot_1     | 🟢 principles.json загружен: [ 'Будь добр к другим', ... ]
     bot_1     | ✅ Отправлено 10 принципов в 9:00  (at 9:00 AM)
     db_1      | [Server] MySQL Community Server - GPL
     ```
   - If errors (e.g., "❌ Ошибка отправки"), check `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, or MySQL credentials.

4. **Update principles.json**
   - Edit `principles.json` to add/remove principles.
   - No restart needed! The bot reloads the file daily before sending at 9 AM.
   - Example: Add "Будь смелым" to the `principles` array.

5. **Stop and Restart (if needed)**
   - Stop the services:
     ```bash
     docker-compose down
     ```
   - Rebuild and rerun after code changes:
     ```bash
     docker-compose up -d --build
     ```

### Troubleshooting
- **Logs**: Check `docker-compose logs -f` for errors (e.g., invalid token, chat not found, MySQL connection issues).
- **Token**: Verify `TELEGRAM_BOT_TOKEN` from @BotFather.
- **Chat ID**: Ensure `TELEGRAM_CHAT_ID` is correct (numeric, e.g., `123456789` for personal, or `-987654321` for groups).
- **MySQL**: Ensure `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD` are set in `.env` and accessible.
- **Network**: Ensure the container can access Telegram API and MySQL (no firewall blocks).

### Notes
- **Time Zone**: The cron job (`0 9 * * *`) runs at 9:00 AM in the container's time zone (usually UTC). To adjust to your local time (e.g., UTC+4), modify the cron to `0 5 * * *` (5:00 AM UTC = 9:00 AM UTC+4).
- **Dynamic Updates**: Changes to `principles.json` are picked up automatically. For code changes, rebuild with `docker-compose up -d --build`.
- **Database**: The `tables.sql` file in the `database/` directory can be used to initialize the MySQL database structure.
  ]

### Notes
- Ensure the mysql directory has proper permissions (chmod -R 755 /var/www/epic-bot/mysql and chown -R $(whoami):$(whoami) /var/www/epic-bot/mysql) to avoid Docker permission issues.
- The bot initializes the database connection once at startup in bot.js.

## Troubleshooting
- **Permission Denied**: Check and fix directory permissions as described above.
- **Migration Errors**: Verify config/config.js and .env settings.
- **Connection Issues**: Ensure MySQL container is running and accessible via the host 'mysql-database'.

## Contributing
Feel free to submit issues or pull requests!

## License
MIT License