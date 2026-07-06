import axios from 'axios';

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
        const encodedPrompt = encodeURIComponent(fullPrompt);
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&model=flux`;

        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 60000
        });

        const imageBuffer = Buffer.from(response.data);
        console.log('🟢 Pollinations: image generated');
        return imageBuffer;
    } catch (err) {
        console.error('❌ Pollinations error:', err.message);
        return null;
    }
}

export { createRandomPrompt, createNotRandomPrompt, generateMotivationalImage };
