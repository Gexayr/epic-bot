# Telegram Bot: Daily 10 Principles via Docker

## Project Structure
```
epic-bot/
├── Dockerfile
├── package.json
├── bot.js
├── principles.json
├── .env
└── README.md
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

### 3. `bot.js`
```javascript
import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // Загружаем переменные из .env

// Проверяем переменные окружения
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token) {
    console.error('❌ Ошибка: TELEGRAM_BOT_TOKEN не задан');
    process.exit(1);
}
if (!chatId) {
    console.error('❌ Ошибка: TELEGRAM_CHAT_ID не задан');
    console.log('ℹ️ Напишите боту в Telegram, чтобы узнать chatId');
    process.exit(1);
}

// Инициализируем бота без polling
const bot = new TelegramBot(token, { polling: false });

// Загружаем principles.json
let principles;
function loadPrinciples() {
    try {
        const data = fs.readFileSync(path.resolve('principles.json'), 'utf-8');
        principles = JSON.parse(data).principles || ['Нет данных'];
        console.log('🟢 principles.json загружен:', principles);
    } catch (err) {
        console.error('❌ Ошибка загрузки principles.json:', err.message);
        principles = ['Ошибка: не удалось загрузить принципы'];
    }
}
loadPrinciples();

// Функция для выбора 10 случайных принципов
function getRandomPrinciples(arr, count) {
    const shuffled = arr.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, arr.length));
}

// Отправка 10 принципов каждый день в 9 утра
cron.schedule('0 9 * * *', () => {
    loadPrinciples(); // Перезагружаем principles.json перед отправкой
    const selectedPrinciples = getRandomPrinciples(principles, 10);
    const text = '✅ Ваши 10 принципов на сегодня:\n\n' + 
                 selectedPrinciples.map((p, i) => `${i + 1}. ${p}`).join('\n');
    bot.sendMessage(chatId, text)
        .then(() => console.log('✅ Отправлено 10 принципов в 9:00'))
        .catch(err => console.error('❌ Ошибка отправки:', err.message));
});

console.log('🟢 Бот запущен');
```
- **Purpose**: Telegram bot script that loads `principles.json`, sends 10 random principles daily at 9 AM.
- **Dynamic Updates**: The `loadPrinciples()` function reloads `principles.json` before each send, so changes to the file are reflected without restarting the bot.

### 4. `principles.json`
```json
{
    "principles": [
        "Будь добр к другим",
        "Стремись к знаниям",
        "Цени время",
        "Действуй с уважением",
        "Ищи баланс в жизни",
        "Будь терпелив",
        "Помогай окружающим",
        "Ставь цели",
        "Будь честен",
        "Радуйся мелочам",
        "Учись на ошибках"
    ]
}
```
- **Purpose**: Stores principles for the bot to send.
- **Note**: Edit this file anytime; changes will apply at the next 9 AM run.

### 5. `.env`
```
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_CHAT_ID=123456789
```
- **Purpose**: Stores sensitive data (bot token and chat ID).
- **Setup**:
    1. Get `TELEGRAM_BOT_TOKEN` from @BotFather in Telegram.
    2. Get `TELEGRAM_CHAT_ID`: Run `node bot.js` locally, send a message to the bot, and check logs for the ID (requires temporary polling—add `bot.startPolling()` to `bot.js` for testing, then remove).
    3. **Security**: Do not commit `.env` to Git!

## README: How to Run the Bot with Docker

### Prerequisites
- **Node.js**: Install locally to test and install dependencies (e.g., `npm install`).
- **Docker**: Install Docker (e.g., Docker Desktop or Docker Engine).
- **Telegram**:
    - Create a bot via @BotFather to get `TELEGRAM_BOT_TOKEN`.
    - Send a message to the bot, check logs for `TELEGRAM_CHAT_ID` (temporarily add `bot.on('message', (msg) => console.log('Chat ID:', msg.chat.id))` and `bot.startPolling()` to `bot.js`).

### Steps to Run
1. **Prepare the Project**
    - Ensure all files (`Dockerfile`, `package.json`, `bot.js`, `principles.json`, `.env`) are in the `epic-bot/` directory.
    - Run locally to test:
      ```bash
      npm install
      node bot.js
      ```
        - Check logs for "🟢 Бот запущен" and test messages in Telegram.
        - Update `.env` with correct `TELEGRAM_CHAT_ID`.

2. **Build the Docker Image**
    - Run in the `epic-bot/` directory:
      ```bash
      docker build -t epic-bot .
      ```
    - This creates an image named `epic-bot` with Node.js and dependencies.

3. **Run the Docker Container**
    - Use environment variables:
      ```bash
      docker run -d --name epic-bot \
        -e TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather \
        -e TELEGRAM_CHAT_ID=123456789 \
        epic-bot
      ```
      or
      ```bash
      docker run -d --name epic-bot --env-file .env epic-bot
      ```
    - **Flags**:
        - `-d`: Runs in detached mode (background).
        - `--name epic-bot`: Names the container.
        - `-e`: Passes environment variables (alternative: use a `.env` file with `docker run --env-file .env`).

4. **Check Logs**
    - View logs to confirm the bot is running:
      ```bash
      docker logs -f epic-bot
      ```
    - Expected output:
      ```
      🟢 Бот запущен
      🟢 principles.json загружен: [ 'Будь добр к другим', ... ]
      ✅ Отправлено 10 принципов в 9:00  (at 9:00 AM)
      ```
    - If errors (e.g., "❌ Ошибка отправки"), check `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.

5. **Update principles.json**
    - Edit `principles.json` to add/remove principles.
    - No restart needed! The bot reloads the file daily before sending at 9 AM.
    - Example: Add "Будь смелым" to the `principles` array.

6. **Stop and Restart (if needed)**
    - Stop the container:
      ```bash
      docker stop epic-bot
      ```
    - Remove the container (if updating the image):
      ```bash
      docker rm epic-bot
      ```
    - Rebuild and rerun after code changes:
      ```bash
      docker build -t epic-bot .
      docker run -d --name epic-bot \
        -e TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather \
        -e TELEGRAM_CHAT_ID=123456789 \
        epic-bot
      ```

### Troubleshooting
- **Logs**: Check `docker logs -f epic-bot` for errors (e.g., invalid token, chat not found).
- **Token**: Verify `TELEGRAM_BOT_TOKEN` from @BotFather.
- **Chat ID**: Ensure `TELEGRAM_CHAT_ID` is correct (numeric, e.g., `123456789` for personal, or `-987654321` for groups).
- **Network**: Ensure the container can access Telegram API (no firewall blocks).

### Notes
- **Time Zone**: The cron job (`0 9 * * *`) runs at 9:00 AM in the container's time zone (usually UTC). To adjust to your local time (e.g., UTC+4), modify the cron to `0 5 * * *` (5:00 AM UTC = 9:00 AM UTC+4).
- **Dynamic Updates**: Changes to `principles.json` are picked up automatically. For code changes, rebuild and rerun the container.