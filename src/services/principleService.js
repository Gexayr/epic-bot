import axios from 'axios';
import 'dotenv/config';

const prompt = `Provide 10 inspiring and motivational principles for men, or quotes from famous or influential figures. I want men to be inspired by these principles or quotes. 
Each should be presented in three languages: English, Russian, and Armenian.
The principles should be similar in style and length to these examples:
- "Never stop evolving; a wise man is a lifelong student of life."
- "Use your power to protect the vulnerable and empower the weak."
- "Define yourself by your own values, not by the expectations of the world."

Return the result STRICTLY as a JSON object with this structure:
{
  "en": ["Principle 1 in English", "Principle 2 in English", ...],
  "ru": ["Принцип 1 на русском", "Принцип 2 на русском", ...],
  "am": ["Սկզբունք 1 հայերեն", "Սկզբունք 2 հայերեն", ...]
}
Ensure there are exactly 10 items in each array and they correspond to each other by index.`;

async function generateWithOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not defined in .env');
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a helpful assistant that generates inspirational principles for men.' },
            { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    const result = JSON.parse(response.data.choices[0].message.content);
    console.log('🟢 Принципы загружены из OpenAI');
    return result;
}

// Передаем prompt как аргумент функции
async function generateWithGemini() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in .env');
    }

    if (!prompt) {
        throw new Error('Prompt is required');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    try {
        const response = await axios.post(url, {
            contents: [{
                parts: [{
                    text: prompt + ". Response must be a valid JSON object."
                }]
            }],
            generationConfig: {
                response_mime_type: "application/json",
                temperature: 0.7
            }
        });

        // Проверяем структуру ответа перед парсингом
        const candidate = response.data.candidates?.[0];
        if (!candidate || !candidate.content) {
            throw new Error('Gemini вернул пустой ответ или ошибку безопасности');
        }

        const content = candidate.content.parts[0].text;
        const result = JSON.parse(content);

        console.log('🟢 Успешно получено от Gemini');
        return result;

    } catch (error) {
        // КРИТИЧЕСКИ ВАЖНО для отладки 400 ошибки:
        if (error.response) {
            console.error("❌ Ошибка API (Статус):", error.response.status);
            console.error("❌ Детали ошибки:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("❌ Ошибка запроса:", error.message);
        }
        throw error;
    }
}

async function loadPrinciples() {
    try {
        const generator = (process.env.PRINCIPLE_GENERATOR || 'openai').toLowerCase();
        let result;

        if (generator === 'gemini') {
            result = await generateWithGemini();
        } else {
            result = await generateWithOpenAI();
        }

        return {
            en: result.en || [],
            ru: result.ru || [],
            am: result.am || []
        };
    } catch (err) {
        console.error(`❌ Ошибка загрузки принципов (${process.env.PRINCIPLE_GENERATOR || 'openai'}):`, err.message);
        return { en: [`Error: failed to load principles from ${process.env.PRINCIPLE_GENERATOR || 'openai'}`], ru: [], am: [] };
    }
}

export { loadPrinciples };