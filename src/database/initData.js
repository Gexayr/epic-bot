import { Principle, ImageFragment, ImageStyle } from './models/index.js';

async function initializeData() {
    try {
        // Инициализация принципов
        const principlesCount = await Principle.count();
        if (principlesCount === 0) {
            const principlesData = [
                { text_ru: 'Стремись к знаниям', text_en: 'Strive for knowledge', text_am: 'Ձգտիր գիտելիքների' },
                { text_ru: 'Ищи баланс в жизни', text_en: 'Seek balance in life', text_am: 'Փնտրիր հավասարակշռություն կյանքում' },
                // ... остальные 160 принципов
                { text_ru: 'Будь примером — твои действия говорят громче, чем слова', text_en: 'Be an example — your actions speak louder than words', text_am: 'Օրինակ եղիր, քո գործողությունները ավելի բարձր են խոսում, քան խոսքերը' }
            ];
            await Principle.bulkCreate(principlesData);
            console.log('🟢 Принципы инициализированы');
        }

        // Инициализация фрагментов изображений
        const fragmentsCount = await ImageFragment.count();
        if (fragmentsCount === 0) {
            const fragmentsData = [
                { subject: 'A fearless warrior', action: 'stands on a battlefield at sunset, sword in hand', setting: 'facing the horizon with unwavering resolve' },
                { subject: 'A charismatic leader', action: 'addresses a roaring crowd from a high balcony', setting: 'city lights sparkling below under a starry sky' },
                // ... остальные 16 фрагментов
                { subject: 'A young inventor', action: 'launches a fantastical contraption into the sky', setting: 'a bustling cityscape far below' }
            ];
            await ImageFragment.bulkCreate(fragmentsData);
            console.log('🟢 Фрагменты изображений инициализированы');
        }

        // Инициализация стилей изображений
        const stylesCount = await ImageStyle.count();
        if (stylesCount === 0) {
            const stylesData = [
                { style_name: 'dark' },
                { style_name: 'digital-art' },
                { style_name: 'fantasy' },
                { style_name: 'photo' },
                { style_name: 'painting' },
                { style_name: 'cyberpunk' },
                { style_name: 'surreal' },
                { style_name: 'art-nouveau' }
            ];
            await ImageStyle.bulkCreate(stylesData);
            console.log('🟢 Стили изображений инициализированы');
        }
    } catch (error) {
        console.error('❌ Ошибка инициализации данных:', error.message);
    }
}

export { initializeData };