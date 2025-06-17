function getRandomElements(arr, count) {
    const shuffled = arr.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, arr.length));
}

function getLocalizedHeader(languageCode) {
    const headers = [
        {
            ru: 'Ваши советы на сегодня:',
            en: 'Your advice for today:',
            am: 'Խորհուրդներ այսօրվա համար:',
        },
        {
            ru: 'Мысли дня:',
            en: 'Thoughts of the day:',
            am: 'Օրվա մտքերը',
        },
        {
            ru: 'Подумай об этом сегодня:',
            en: 'Reflect on this today:',
            am: 'Մտածիր սրա մասին այսօր',
        },
        {
            ru: 'Сегодняшняя мотивация для вас:',
            en: 'Today’s motivation for you:',
            am: 'Այսօրվա ոգեշնչումը քեզ համար',
        },
        {
            ru: 'Это напоминание — для тебя:',
            en: 'A reminder — just for you:',
            am: 'Հիշեցում քո համար',
        }
    ];
    const randomHeader = headers[Math.floor(Math.random() * headers.length)];

    console.log("languageCode, randomHeader[languageCode]")
    console.log(languageCode, randomHeader[languageCode])
    return randomHeader[languageCode] || headers[0]['en'];
}

export { getRandomElements, getLocalizedHeader };