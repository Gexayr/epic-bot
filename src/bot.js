import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import 'dotenv/config';
import { initializeDatabase } from './database/db.js';
import { loadPrinciples } from './services/principleService.js';
import { loadImageData } from './services/imageService.js';
import { createRandomPrompt, createNotRandomPrompt, generateMotivationalImage } from './utils/imageUtils.js';
import { getRandomElements, getLocalizedHeader } from './utils/commonUtils.js';
import { User, PrincipleLog, ImagePrompt } from './database/models/index.js';

// Проверяем переменные окружения
const token = process.env.TELEGRAM_BOT_TOKEN;
const languages = ["am", "ru", "en"];

if (!token) {
    console.error('❌ Ошибка: TELEGRAM_BOT_TOKEN не задан');
    process.exit(1);
}

await initializeDatabase();

// Инициализируем бота
const bot = new TelegramBot(token, { polling: true });

// Ежедневная отправка принципов и изображений в 5 утра
cron.schedule('0 5 * * *', async () => {
    const users = await User.findAll({ where: { is_active: true } });
    if (users.length === 0) {
        console.log('ℹ️ Нет активных пользователей для рассылки.');
        return;
    }

    const principles = await loadPrinciples();
    const imageData = await loadImageData();
    let principlesText = [];
    let selectedPrinciples = [];
    const shuffledPrinciples = [];
    for (const lang of languages) {
        selectedPrinciples[lang] = getRandomElements(principles[lang], 10);
        shuffledPrinciples[lang] = getRandomElements(selectedPrinciples[lang], 4);
        const header = getLocalizedHeader(lang);
        principlesText[lang] = `✅ ${header}\n\n` +
            selectedPrinciples[lang].map((p, i) => `${i + 1}. ${p}`).join('\n');

        await PrincipleLog.create({ text: principlesText[lang] });
    }

    for (const user of users) {
        try {
            const userLanguage = user.lang || 'en';
            await bot.sendMessage(user.chat_id, principlesText[userLanguage]);
            console.log(`🟢 Принципы отправлены пользователю ${user.chat_id}`);
        } catch (err) {
            console.error(`❌ Ошибка отправки принципов пользователю ${user.chat_id}:`, err.message);
            if (err.response && err.response.statusCode === 403) {
                console.log(`Пользователь ${user.chat_id} заблокировал бота. Деактивация.`);
                await User.update({ is_active: false }, { where: { chat_id: user.chat_id } });
            }
        }
    }

    console.log('🟢 Отправка 4 изображений в 5:00');

    for (let i = 0; i < 4; i++) {
        const prompt = createNotRandomPrompt(imageData.fragments);
        const style = getRandomElements(imageData.styles, 1)[0];
        const imageUrl = await generateMotivationalImage(prompt, style);
        if (imageUrl) {
            await ImagePrompt.create({ prompt, style });

            for (const user of users) {
                try {
                    const userLanguage = user.lang || 'en';
                    const principle = shuffledPrinciples[userLanguage][i];
                    await bot.sendPhoto(user.chat_id, imageUrl, {
                        caption: `✅ ${principle}`
                    });
                    console.log(`✅ Отправлено изображение пользователю ${user.chat_id}: ${prompt} (стиль: ${style}) с текстом: ${principle}`);
                } catch (err) {
                    console.error(`❌ Ошибка отправки изображения пользователю ${user.chat_id}:`, err.message);
                    if (err.response && err.response.statusCode === 403) {
                        console.log(`Пользователь ${user.chat_id} заблокировал бота. Деактивация.`);
                        await User.update({ is_active: false }, { where: { chat_id: user.chat_id } });
                    }
                }
            }
        }
    }
});

// Обработчик команды /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id.toString();
    const username = msg.from.username || null;
    const firstName = msg.from.first_name || null;
    const lastName = msg.from.last_name || null;
    const info = msg || null;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '⚙️ Settings / Настройки', callback_data: 'settings' }]
            ]
        }
    };

    try {
        await User.upsert({
            chat_id: chatId,
            username,
            first_name: firstName,
            last_name: lastName,
            info,
            is_active: true,
            lang: 'en'
        });
        await bot.sendMessage(chatId,
            'Hi! I\'m a bot that will send you daily tips and motivational images. Welcome!',
            options);
        console.log(`🟢 Новый пользователь зарегистрирован/активирован: ${chatId}`);
    } catch (error) {
        console.error('❌ Ошибка при добавлении пользователя:', error.message);
        await bot.sendMessage(chatId, 'There was an error registering. Please try again.');
    }
});

bot.onText(/\/gen/, async (msg) => {
    const principles = await loadPrinciples();
    const imageData = await loadImageData();
    let principlesText = [];
    let selectedPrinciples = [];
    let shuffledPrinciples = [];

    for (const lang of languages) {
        selectedPrinciples[lang] = getRandomElements(principles[lang], 10);
        shuffledPrinciples[lang] = getRandomElements(selectedPrinciples[lang], 4);
        const header = getLocalizedHeader(lang);
        principlesText[lang] = `✅ ${header}\n\n` +
            selectedPrinciples[lang].map((p, i) => `${i + 1}. ${p}`).join('\n');
    }

    await PrincipleLog.create({ text: principlesText['en'] });

    const lang = getRandomElements(languages, 1)
    const userLanguage = lang || 'en';
    await bot.sendMessage(msg.chat.id, principlesText[userLanguage]);
    for (let i = 0; i < 4; i++) {
        const prompt = createNotRandomPrompt(imageData.fragments);
        const style = getRandomElements(imageData.styles, 1)[0];
        const imageUrl = await generateMotivationalImage(prompt, style);
        if (imageUrl) {
            await ImagePrompt.create({ prompt, style });
            const userLanguage = lang || 'en';
            const principle = shuffledPrinciples[userLanguage][i];
            await bot.sendPhoto(msg.chat.id, imageUrl, {
                caption: `✅ ${principle}`
            });
        }
    }
    await bot.sendMessage(msg.chat.id, 'generated 😎');
});

// Обработчик callback-запросов
bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;

    if (data === 'settings') {
        const languageKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🇷🇺 Русский', callback_data: 'ru' },
                        { text: '🇦🇲 Հայերեն', callback_data: 'am' },
                        { text: '🇬🇧 English', callback_data: 'en' }
                    ]
                ]
            }
        };
        await bot.sendMessage(msg.chat.id, 'Пожалуйста, выберите язык | Խնդրում ենք ընտրել լեզուն: | Please select a language', languageKeyboard);
    }

    if (data === 'ru') {
        await bot.sendMessage(msg.chat.id, 'Вы выбрали русский язык 🇷🇺');
    } else if (data === 'am') {
        await bot.sendMessage(msg.chat.id, 'Դուք ընտրեցիք հայերեն 🇦🇲');
    } else if (data === 'en') {
        await bot.sendMessage(msg.chat.id, 'You selected English 🇬🇧');
    }

    if (languages.includes(data)) {
        await User.update({ lang: data }, { where: { chat_id: msg.chat.id.toString() } });
    }

    await bot.answerCallbackQuery(callbackQuery.id);
});

console.log('🟢 Бот запущен');