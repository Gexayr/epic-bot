import axios from 'axios';
import 'dotenv/config';

const fragmentPrompt = `Generate 4 unique and creative image fragments for an image generation prompt.
Each fragment must have exactly three components: 'subject', 'action', and 'setting'.
The style should be inspiring, epic, or cinematic.
Examples of fragments:
- { "subject": "A fearless warrior", "action": "stands on a battlefield at sunset, sword in hand", "setting": "facing the horizon with unwavering resolve" }
- { "subject": "A powerful sorcerer", "action": "raises her staff on a glowing rune-covered platform", "setting": "with a cosmic vortex swirling above" }
- { "subject": "A lone archer", "action": "stands on a hill, bow drawn", "setting": "silhouetted against a fiery sunset, ready to defend their land" }

Return the result STRICTLY as a JSON object with this structure:
{
  "fragments": [
    { "subject": "...", "action": "...", "setting": "..." },
    ...
  ]
}
Ensure there are exactly 4 fragments in the array.`;

async function generateFragmentsWithOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not defined in .env');
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a helpful assistant that generates creative image fragments.' },
            { role: 'user', content: fragmentPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    const result = JSON.parse(response.data.choices[0].message.content);
    console.log('🟢 Фрагменты загружены из OpenAI');
    return result.fragments || [];
}

async function generateFragmentsWithGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in .env');
    }


    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    try {
        const response = await axios.post(url, {
            contents: [{
                parts: [{
                    text: fragmentPrompt + ". Response must be a valid JSON object."
                }]
            }],
            generationConfig: {
                response_mime_type: "application/json",
                temperature: 0.8
            }
        });

        const candidate = response.data.candidates?.[0];
        if (!candidate || !candidate.content) {
            throw new Error('Gemini вернул пустой ответ или ошибку безопасности');
        }

        const content = candidate.content.parts[0].text;
        const result = JSON.parse(content);

        console.log('🟢 Фрагменты успешно получены от Gemini');
        return result.fragments || [];

    } catch (error) {
        if (error.response) {
            console.error("❌ Ошибка API Gemini (Статус):", error.response.status);
            console.error("❌ Детали ошибки:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("❌ Ошибка запроса Gemini:", error.message);
        }
        throw error;
    }
}

async function loadAiFragments() {
    const generator = (process.env.FRAGMENT_GENERATOR || 'gemini').toLowerCase();
    if (generator === 'gemini') {
        return await generateFragmentsWithGemini();
    } else {
        return await generateFragmentsWithOpenAI();
    }
}

export { loadAiFragments };
