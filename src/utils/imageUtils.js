import axios from 'axios';

const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;
const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;

function createRandomPrompt(fragments) {
    const randomSubject = fragments[Math.floor(Math.random() * fragments.length)].subject;
    const randomAction = fragments[Math.floor(Math.random() * fragments.length)].action;
    const randomSetting = fragments[Math.floor(Math.random() * fragments.length)].setting;
    return `${randomSubject} ${randomAction} ${randomSetting}, vibrant colors, uplifting mood, cinematic lighting, epic composition`;
}

function createNotRandomPrompt(fragments, index) {
    const fragment = fragments[index % fragments.length];
    return `${fragment.subject} ${fragment.action} ${fragment.setting}, vibrant colors, uplifting mood, cinematic lighting, epic composition`;
}

async function generateMotivationalImage(prompt, style) {
    try {
        const fullPrompt = style ? `${prompt}, style: ${style}` : prompt;
        const response = await axios.post(
            `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
            { prompt: fullPrompt },
            {
                headers: {
                    Authorization: `Bearer ${cfApiToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        if (!response.data.success || !response.data.result?.image) {
            console.error('❌ Cloudflare Workers AI error:', JSON.stringify(response.data.errors));
            return null;
        }

        const imageBuffer = Buffer.from(response.data.result.image, 'base64');
        console.log('🟢 Cloudflare Workers AI: image generated');
        return imageBuffer;
    } catch (err) {
        console.error('❌ Cloudflare Workers AI error:', err.response?.data ? JSON.stringify(err.response.data) : err.message);
        return null;
    }
}

export { createRandomPrompt, createNotRandomPrompt, generateMotivationalImage };
