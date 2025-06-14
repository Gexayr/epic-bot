import { Principle } from '../database/models/index.js';

async function loadPrinciples() {
    try {
        const allPrinciples = await Principle.findAll();
        const principles = {
            en: allPrinciples.map(row => row.text_en),
            ru: allPrinciples.map(row => row.text_ru),
            am: allPrinciples.map(row => row.text_am)
        };
        console.log('🟢 Принципы загружены');
        return principles;
    } catch (err) {
        console.error('❌ Ошибка загрузки принципов:', err.message);
        return { en: ['Ошибка: не удалось загрузить принципы'], ru: [], am: [] };
    }
}

export { loadPrinciples };