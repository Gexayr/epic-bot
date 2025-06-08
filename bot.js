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
cron.schedule('*/3 * * * *', () => {

    loadPrinciples(); // Перезагружаем principles.json перед отправкой
    const selectedPrinciples = getRandomPrinciples(principles, 10);
    const text = '✅ Ваши 10 принципов на сегодня:\n\n' +
        selectedPrinciples.map((p, i) => `${i + 1}. ${p}`).join('\n');
    bot.sendMessage(chatId, text)
        .then(() => console.log('✅ Отправлено 10 принципов в 9:00'))
        .catch(err => console.error('❌ Ошибка отправки:', err.message));
});

console.log('🟢 Бот запущен');