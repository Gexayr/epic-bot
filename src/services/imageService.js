import { checkConnection } from '../database/db.js';
import { ImageFragment, ImageStyle } from '../database/models/index.js';

async function loadImageData() {
    try {
        await checkConnection();
        const fragments = await ImageFragment.findAll();
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