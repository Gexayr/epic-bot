[# Telegram Bot: Daily 10 Principles via Docker

## Project Structure
```
epic-bot/
├── database/
│   └── tables.sql
├── node_modules/ (library root)
├── .env
├── .env.example
├── .gitignore
├── bot.js
├── docker-compose.yml
├── Dockerfile
├── images.json
├── package.json
├── package-lock.json
├── principles.json
├── README.md
```

## Files and Configuration

### 1. `Dockerfile`
```Dockerfile
# Базовый образ с Node.js
FROM node:18-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json .
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
  "main": "bot.js",
  "type": "module",
  "scripts": {
    "start": "node bot.js"
  },
  "dependencies": {
    "node-telegram-bot-api": "^0.66.0",
    "node-cron": "^3.0.3",
    "dotenv": "^16.4.5"
  }
}
```
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