import { checkConnection } from '../database/db.js';
import { ImageFragment, ImageStyle } from '../database/models/index.js';
import { loadAiFragments } from './aiFragmentService.js';

async function loadImageData() {
    try {
        await checkConnection();
        let fragments;
        try {
            fragments = await loadAiFragments();
            if (!fragments || fragments.length === 0) {
                throw new Error('AI returned no fragments');
            }
        } catch (aiErr) {
            console.error('⚠️ Ошибка AI генерации фрагментов, используем БД:', aiErr.message);
            fragments = await ImageFragment.findAll();
            if (!fragments || fragments.length === 0) {
                fragments = [
                    { subject: 'A lone warrior', action: 'stands tall', setting: 'on a mountain peak at dawn' },
                    { subject: 'A determined man', action: 'pushes forward', setting: 'through a storm with fierce resolve' },
                    { subject: 'A wise leader', action: 'gazes ahead', setting: 'over a vast golden horizon' },
                    { subject: 'A strong champion', action: 'rises again', setting: 'after falling in the arena of life' }
                ];
            }
        }

        const styles = await ImageStyle.findAll();
        const imageData = {
            fragments,
            styles: styles.map(row => row.style_name)
        };
        console.log('🟢 Данные изображений загружены');
        return imageData;
    } catch (err) {
        console.error('❌ Ошибка загрузки данных изображений:', err.message);
        return {
            fragments: [
                { subject: "A lone hero", action: "stands tall", setting: "on a cliff" }
            ],
            styles: ['fantasy']
        };
    }
}

export { loadImageData };