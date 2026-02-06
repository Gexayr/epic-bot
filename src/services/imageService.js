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