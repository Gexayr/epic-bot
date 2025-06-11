import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import axios from 'axios';

// Проверяем переменные окружения
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const freepikApiKey = process.env.FREEPIK_API_KEY;

if (!token) {
    console.error('❌ Ошибка: TELEGRAM_BOT_TOKEN не задан');
    process.exit(1);
}
if (!chatId) {
    console.error('❌ Ошибка: TELEGRAM_CHAT_ID не задан');
    console.log('ℹ️ Напишите боту в Telegram, чтобы узнать chatId');
    process.exit(1);
}
if (!freepikApiKey) {
    console.error('❌ Ошибка: FREEPIK_API_KEY не задан');
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
        console.log('🟢 principles.json загружен:');
    } catch (err) {
        console.error('❌ Ошибка загрузки principles.json:', err.message);
        principles = ['Ошибка: не удалось загрузить принципы'];
    }
}
loadPrinciples();

// Загружаем images.json
let imageData;
function loadImageData() {
    try {
        const data = fs.readFileSync(path.resolve('images.json'), 'utf-8');
        imageData = JSON.parse(data);
        console.log('🟢 images.json загружен:');
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
loadImageData();

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
                person_generation: 'allow_all',
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
    loadPrinciples(); // Перезагружаем principles.json
    loadImageData(); // Перезагружаем images.json
    const selectedPrinciples = getRandomElements(principles, 10);

    // Отправляем принципы списком
    const principlesText = '✅ Ваши принципы на сегодня:\n\n' +
        selectedPrinciples.map((p, i) => `${i + 1}. ${p}`).join('\n');
    try {
        await bot.sendMessage(chatId, principlesText);
        console.log('🟢 Принципы отправлены');
    } catch (err) {
        console.error('❌ Ошибка отправки принципов:', err.message);
    }

    // Генерируем и отправляем 4 изображения
    console.log('🟢 Отправка 4 изображений в 9:00');
    console.log("selectedPrinciples",selectedPrinciples)
    for (let i = 0; i < 4; i++) {
        const prompt = createRandomPrompt(imageData.fragments); // Создаем случайный промпт
        const style = getRandomElements(imageData.styles, 1)[0]; // Случайный стиль
        const principle = getRandomElements(selectedPrinciples, 1)[0];
        const imageUrl = await generateMotivationalImage(prompt, style);
        if (imageUrl) {
            try {
                await bot.sendPhoto(chatId, imageUrl, {
                    caption: `✅ ${principle}`
                });
                console.log(`✅ Отправлено изображение: ${prompt} (стиль: ${style}) с текстом: ${principle}`);
            } catch (err) {
                console.error('❌ Ошибка отправки изображения:', err.message);
            }
        }
    }
});

console.log('🟢 Бот запущен');