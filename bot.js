import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
// import fs from 'fs';
// import path from 'path';
import 'dotenv/config';
import axios from 'axios';
import mysql from 'mysql2/promise';

// Проверяем переменные окружения
const token = process.env.TELEGRAM_BOT_TOKEN;
const freepikApiKey = process.env.FREEPIK_API_KEY;
const dbHost = process.env.MYSQL_DB_HOST || 'localhost';
const dbName = process.env.MYSQL_DATABASE || 'telegram_bot_db';
const dbUser = process.env.MYSQL_USER || 'root';
const dbPassword = process.env.MYSQL_PASSWORD || 'password';
const languages = [
    "am", "ru", "en"
];

if (!token) {
    console.error('❌ Ошибка: TELEGRAM_BOT_TOKEN не задан');
    process.exit(1);
}

if (!freepikApiKey) {
    console.error('❌ Ошибка: FREEPIK_API_KEY не задан');
    process.exit(1);
}

// Инициализируем бота
const bot = new TelegramBot(token, { polling: true });

let pool; // Переменная для хранения соединения с базой данных
let connection; // Переменная для хранения соединения с базой данных

async function initializeDatabase() {
    try {
        pool = mysql.createPool({
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            database: dbName,
            waitForConnections: true, // If true, the pool will queue requests when no connections are available
            connectionLimit: 10,     // Max number of connections in the pool
            queueLimit: 0            // Max number of connection requests the pool will queue (0 means no limit)
        });
        connection = await pool.getConnection();

        console.log('🟢 Соединение с базой данных MySQL установлено.');
    } catch (error) {
        // console.log(
        //     "host:" , dbHost,
        //     "user:" , dbUser,
        //     "password:" , dbPassword,
        //     "database:" , dbName
        // )
        console.error('❌ Ошибка инициализации базы данных MySQL:', error.message);
        process.exit(1);
    }
}

async function checkConnection () {
    if (!pool || !connection) { // Ensure the pool is initialized before trying to get a connection
        await initializeDatabase();
        connection = await pool.getConnection();
    }
}

// Загружаем principles.json
let principles = [];
let allPrinciples = [];
async function loadPrinciples() {
    try {
        // const data = fs.readFileSync(path.resolve('principles.json'), 'utf-8');
        // principles = JSON.parse(data).principles || ['Нет данных'];
        // console.log('🟢 principles.json загружен:');
        [allPrinciples] = await connection.execute('SELECT * FROM principles');
        principles['en'] = allPrinciples.map(row => row.text_en);
        principles['ru'] = allPrinciples.map(row => row.text_ru);
        principles['am'] = allPrinciples.map(row => row.text_am);

    } catch (err) {
        console.error('❌ Ошибка загрузки principles.json:', err.message);
        principles = ['Ошибка: не удалось загрузить принципы'];
    }
}
// loadPrinciples();

let imageData = { fragments: [], styles: [] };

async function loadImageData() {
    try {
        // const data = fs.readFileSync(path.resolve('images.json'), 'utf-8');
        // imageData = JSON.parse(data);
        // console.log('🟢 images.json загружен:');
        await checkConnection();
        const [fragments] = await connection.execute('SELECT subject, action, setting FROM image_fragments');
        const [styles] = await connection.execute('SELECT style_name FROM image_styles');

        imageData.fragments = fragments;
        imageData.styles = styles.map(row => row.style_name);

        console.log(imageData)
        console.log('🟢 Данные изображений загружены');
    } catch (err) {
        console.error('❌ Ошибка загрузки images.json:', err.message);
        imageData = {
            fragments: [
                { subject: "A lone hero", action: "stands tall", setting: "on a cliff" }
            ],
            styles: ['fantasy']
        };
    }
}
// loadImageData();

// Функция для выбора случайных элементов
function getRandomElements(arr, count) {
    const shuffled = arr.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, arr.length));
}

// Функция для создания случайного промпта из фрагментов
function createRandomPrompt(fragments) {
    const randomSubject = getRandomElements(fragments, 1)[0].subject;
    const randomAction = getRandomElements(fragments, 1)[0].action;
    const randomSetting = getRandomElements(fragments, 1)[0].setting;
    return `${randomSubject} ${randomAction} ${randomSetting}, vibrant colors, uplifting mood, cinematic lighting, epic composition`;
}

// Функция для инициации генерации изображения через Freepik API
async function initiateImageGeneration(prompt, style) {
    try {
        /*const epStyle = [
            "realism",
            "fantasy",
            "cinematic",
            "surrealism",
            "epic"
        ][Math.floor(Math.random() * 5)];
        */

        const response = await axios.post(
            'https://api.freepik.com/v1/ai/text-to-image/imagen3',
            {
                prompt: prompt,
                /*prompt: `${prompt}, ${epStyle} aesthetic`,*/
                num_images: 1,
                aspect_ratio: 'square_1_1',
                styling: {
                    style: style,
                    effects: {
                        color: 'vibrant',
                        lightning: 'cinematic',
                        framing: 'cinematic'
                    }
                },
                person_generation: 'allow_adult',
                safety_settings: 'block_none'
            },
            {
                headers: {
                    'x-freepik-api-key': freepikApiKey,
                    'Content-Type': 'application/json'
                }
            }
        );
        const taskId = response.data.data.task_id;
        console.log('🟢 Задача генерации создана, task_id:', taskId);
        return taskId;
    } catch (err) {
        console.error('❌ Ошибка инициации генерации изображения:', err.message);
        return null;
    }
}

// Функция для проверки статуса и получения URL изображения
async function checkImageStatus(taskId) {
    try {
        console.log(freepikApiKey)
        const response = await axios.get(
            `https://api.freepik.com/v1/ai/text-to-image/imagen3/${taskId}`,
            {
                headers: {
                    'x-freepik-api-key': freepikApiKey
                }
            }
        );
        const status = response.data.data.status;
        const generated = response.data.data.generated;
        console.log('🟢 Статус задачи:', status);
        if (status === 'COMPLETED' && generated.length > 0) {
            const imageUrl = generated[0];
            console.log('🟢 Изображение готово:', imageUrl);
            return imageUrl;
        }
        return null;
    } catch (err) {
        console.error('❌ Ошибка проверки статуса задачи:', err.message);
        return null;
    }
}

// Функция для генерации и получения изображения с ожиданием
async function generateMotivationalImage(prompt, style) {
    const taskId = await initiateImageGeneration(prompt, style);
    // await new Promise(resolve => setTimeout(resolve, 2000)); // Ждем 2 секунд

    if (!taskId) return null;

    // Ожидаем завершения генерации (максимум 30 секунд)
    let attempts = 0;
    const maxAttempts = 6; // 6 попыток по 5 секунд = 30 секунд
    while (attempts < maxAttempts) {
        const imageUrl = await checkImageStatus(taskId);
        if (imageUrl) return imageUrl;
        console.log('⏳ Ожидание генерации изображения, попытка', attempts + 1);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Ждем 5 секунд
        attempts++;
    }
    console.error('❌ Время ожидания генерации истекло для:', prompt);
    return null;
}

// Отправка принципов списком и 4 мотивационных изображений каждый день в 9 утра
cron.schedule('0 5 * * *', async () => {
    await checkConnection();
    const [users] = await connection.execute('SELECT chat_id, lang FROM users WHERE is_active = TRUE');
    if (users.length === 0) {
        console.log('ℹ️ Нет активных пользователей для рассылки.');
        return;
    }

    await loadPrinciples();
    await loadImageData();
    let header = `Ваши советы  на сегодня:`;
    let principlesText = [];
    let selectedPrinciples = [];

    for (const lang of languages) {
        selectedPrinciples[lang] = getRandomElements(principles[lang], 10);
        header = getLocalizedHeader(lang)
        principlesText[lang] = `✅ ${header}\n\n` +
        selectedPrinciples[lang].map((p, i) => `${i + 1}. ${p}`).join('\n');
    }

    await connection.execute(
        'INSERT INTO principles_log (text) VALUES (?) ',
        [principlesText['en']]
    );

    for (const user of users) {
        try {
            const userLanguage = user.lang || 'en';
            await bot.sendMessage(user.chat_id, principlesText[userLanguage]);
            console.log(`🟢 Принципы отправлены пользователю ${user.chat_id}`);
        } catch (err) {
            console.error(`❌ Ошибка отправки принципов пользователю ${user.chat_id}:`, err.message);
            // Если ошибка связана с заблокированным ботом, деактивируем пользователя
            if (err.response && err.response.statusCode === 403) {
                console.log(`Пользователь ${user.chat_id} заблокировал бота. Деактивация.`);
                await connection.execute('UPDATE users SET is_active = FALSE WHERE chat_id = ?', [user.chat_id]);
            }
        }
    }

    // Генерируем и отправляем 4 изображения
    console.log('🟢 Отправка 4 изображений в 9:00');
    for (let i = 0; i < 4; i++) {
        const prompt = createRandomPrompt(imageData.fragments); // Создаем случайный промпт
        const style = getRandomElements(imageData.styles, 1)[0]; // Случайный стиль
        const imageUrl = await generateMotivationalImage(prompt, style);
        if (imageUrl) {
            await connection.execute(
                'INSERT INTO images_prompt (prompt, style) VALUES (?, ?) ',
                [prompt, style]
            );

            for (const user of users) {
                try {
                    const userLanguage = user.lang || 'en';
                    const shuffledPrinciples = getRandomElements(selectedPrinciples[userLanguage], 4);
                    const principle = shuffledPrinciples[i];

                    await bot.sendPhoto(user.chat_id, imageUrl, {
                        caption: `✅ ${principle}`
                    });
                    console.log(`✅ Отправлено изображение пользователю ${user.chat_id}: ${prompt} (стиль: ${style}) с текстом: ${principle}`);
                } catch (err) {
                    console.error(`❌ Ошибка отправки изображения пользователю ${user.chat_id}:`, err.message);
                    if (err.response && err.response.statusCode === 403) {
                        console.log(`Пользователь ${user.chat_id} заблокировал бота. Деактивация.`);
                        await connection.execute('UPDATE users SET is_active = FALSE WHERE chat_id = ?', [user.chat_id]);
                    }
                }
            }
        }
    }
});

// Запускаем инициализацию базы данных и бота
// initializeDatabase().then(() => {
//     console.log('🟢 Бот запущен и готов к работе.');
// }).catch(err => {
//     console.error('Критическая ошибка при запуске бота:', err);
//     process.exit(1);
// });

const getLocalizedHeader = (languageCode) => {
    const headers = {
        'ru': 'Ваши советы  на сегодня:',
        'en': 'Your advices for today:',
        'am': 'Խորհուրդներ այսօրվա համար:'
    };
    return headers[languageCode] || headers['en']; // Default to Russian if language not found
};

// Обработчик команды /start
bot.onText(/\/start/, async (msg) => {
    await checkConnection();
    if (!connection) {
        console.error('❌ Попытка добавить пользователя до установки соединения с БД.');
        await bot.sendMessage(msg.chat.id, 'Sorry, the bot is not ready yet. Please try again in a minute.');
        return;
    }

    const chatId = msg.chat.id.toString();
    const username = msg.from.username || null;
    const firstName = msg.from.first_name || null;
    const lastName = msg.from.last_name || null;
    const info = msg || null;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '⚙️ Settings / Настройки', callback_data: 'settings' }
                ]
            ]
        }
    };

    try {
        await connection.execute(
            'INSERT INTO users (chat_id, username, first_name, last_name, info, is_active) VALUES (?, ?, ?, ?, ?, TRUE) ' +
            'ON DUPLICATE KEY UPDATE username = ?, first_name = ?, last_name = ?, info = ?, is_active = TRUE',
            [chatId, username, firstName, lastName, info, username, firstName, lastName, info]
        );
        await bot.sendMessage(chatId,
            'Hi! I\'m a bot that will send you daily tips and motivational images. Welcome!',
            options);
        console.log(`🟢 Новый пользователь зарегистрирован/активирован: ${chatId}`);
    } catch (error) {
        console.error('❌ Ошибка при добавлении пользователя:', error.message);
        await bot.sendMessage(chatId, 'There was an error registering. Please try again.');
    }
});

bot.on('callback_query', async (callbackQuery) => {

    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    // Обработка настройки
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
        await checkConnection();
        await connection.execute('UPDATE users SET lang = ? WHERE chat_id = ?', [data, msg.chat.id.toString()]);
    }

    await bot.answerCallbackQuery(callbackQuery.id);
});


console.log('🟢 Бот запущен');