import axios from 'axios';
import 'dotenv/config';

const freepikApiKey = process.env.FREEPIK_API_KEY;

function createRandomPrompt(fragments) {
    const randomSubject = fragments[Math.floor(Math.random() * fragments.length)].subject;
    const randomAction = fragments[Math.floor(Math.random() * fragments.length)].action;
    const randomSetting = fragments[Math.floor(Math.random() * fragments.length)].setting;
    return `${randomSubject} ${randomAction} ${randomSetting}, vibrant colors, uplifting mood, cinematic lighting, epic composition`;
}
function createNotRandomPrompt(fragments) {
    const index = Math.floor(Math.random() * fragments.length);
    const randomSubject = fragments[index].subject;
    const randomAction = fragments[index].action;
    const randomSetting = fragments[index].setting;
    return `${randomSubject} ${randomAction} ${randomSetting}, vibrant colors, uplifting mood, cinematic lighting, epic composition`;
}

async function initiateImageGeneration(prompt, style) {
    try {
        const response = await axios.post(
            'https://api.freepik.com/v1/ai/text-to-image/imagen3',
            {
                prompt: prompt,
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

async function checkImageStatus(taskId) {
    try {
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

async function generateMotivationalImage(prompt, style) {
    const taskId = await initiateImageGeneration(prompt, style);
    if (!taskId) return null;

    let attempts = 0;
    const maxAttempts = 6;
    while (attempts < maxAttempts) {
        const imageUrl = await checkImageStatus(taskId);
        if (imageUrl) return imageUrl;
        console.log('⏳ Ожидание генерации изображения, попытка', attempts + 1);
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
    }
    console.error('❌ Время ожидания генерации истекло для:', prompt);
    return null;
}

export { createRandomPrompt, createNotRandomPrompt, generateMotivationalImage };