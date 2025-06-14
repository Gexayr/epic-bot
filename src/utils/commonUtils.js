function getRandomElements(arr, count) {
    const shuffled = arr.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, arr.length));
}

function getLocalizedHeader(languageCode) {
    const headers = {
        'ru': 'Ваши советы на сегодня:',
        'en': 'Your advice for today:',
        'am': 'Խորհուրդներ այսօրվա համար:'
    };
    return headers[languageCode] || headers['en'];
}

export { getRandomElements, getLocalizedHeader };