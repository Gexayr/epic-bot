'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed Principles
    const principlesCount = await queryInterface.sequelize.query(
        `SELECT COUNT(*) FROM principles;`,
        { type: Sequelize.QueryTypes.SELECT }
    );

    if (principlesCount[0]['COUNT(*)'] === 0) {
      const principlesData = [
        { text_ru: 'Стремись к знаниям', text_en: 'Strive for knowledge', text_am: 'Ձգտիր գիտելիքների' },
        { text_ru: 'Ищи баланс в жизни', text_en: 'Seek balance in life', text_am: 'Փնտրիր հավասարակշռություն կյանքում' },
        { text_ru: 'Говори правду, даже когда трудно', text_en: 'Tell the truth, even when it’s hard', text_am: 'Խոսիր ճշմարտությունը, նույնիսկ երբ դժվար է' },
        { text_ru: 'Держи своё слово — обещание для мужчины свято', text_en: 'Keep your word — a man’s promise is sacred', text_am: 'Պահիր խոսքդ՝ տղամարդու խոստումը սուրբ է' },
        { text_ru: 'Уважай женщин — рыцарь не унижает, а защищает', text_en: 'Respect women — a knight protects, not degrades', text_am: 'Հարգիր կանանց՝ ասպետը չի նվաստացնում, այլ պաշտպանում է' },
        { text_ru: 'Защищай слабых и невинных', text_en: 'Protect the weak and innocent', text_am: 'Պաշտպանիր թույլերին և անմեղներին' },
        { text_ru: 'Будь честен перед собой', text_en: 'Be honest with yourself', text_am: 'Ազնիվ եղիր ինքդ քո հետ' },
        { text_ru: 'Следуй своему пути, даже если он труден', text_en: 'Follow your path, even if it’s difficult', text_am: 'Հետևիր քո ճանապարհին, նույնիսկ եթե այն դժվար է' },
        { text_ru: 'Не говори за спиной — говори в лицо', text_en: 'Don’t talk behind someone’s back — speak face-to-face', text_am: 'Մի խոսիր մեջքի հետևում, խոսիր դեմ առ դեմ' },
        { text_ru: 'Не оправдывайся, действуй', text_en: 'Don’t make excuses, act', text_am: 'Մի արդարացիր, գործիր' },
        { text_ru: 'Учись контролировать свои эмоции', text_en: 'Learn to control your emotions', text_am: 'Սովորիր կառավարել քո հույզերը' },
        { text_ru: 'Не вини других за свои неудачи', text_en: 'Don’t blame others for your failures', text_am: 'Մի մեղադրիր ուրիշներին քո ձախողումների համար' },
        { text_ru: 'Воспринимай поражение как урок', text_en: 'Treat defeat as a lesson', text_am: 'Ընդունիր պարտությունը որպես դաս' },
        { text_ru: 'Помогай без ожидания награды', text_en: 'Help without expecting a reward', text_am: 'Օգնիր առանց պարգև սպասելու' },
        { text_ru: 'Береги честь с молоду', text_en: 'Guard your honor from youth', text_am: 'Պահպանիր պատիվդ երիտասարդությունից' },
        { text_ru: 'Защищай своих близких любой ценой', text_en: 'Protect your loved ones at all costs', text_am: 'Պաշտպանիր քո հարազատներին ցանկացած գնով' },
        { text_ru: 'Заботься о своём теле — оно твой храм', text_en: 'Care for your body — it’s your temple', text_am: 'Հոգ տար քո մարմնի մասին, այն քո տաճարն է' },
        { text_ru: 'Стой прямо, даже перед страхом', text_en: 'Stand tall, even in the face of fear', text_am: 'Կանգնիր ուղիղ, նույնիսկ վախի առաջ' },
        { text_ru: 'Не прячься от проблем — решай их', text_en: 'Don’t hide from problems — solve them', text_am: 'Մի թաքնվիր խնդիրներից, լուծիր դրանք' },
        { text_ru: 'Борись за правду', text_en: 'Fight for the truth', text_am: 'Պայքարիր ճշմարտության համար' },
        { text_ru: 'Не поддавайся стадному инстинкту', text_en: 'Don’t follow the herd instinct', text_am: 'Մի տրվիր հոտի բնազդին' },
        { text_ru: 'Будь готов защищать свои идеалы', text_en: 'Be ready to defend your ideals', text_am: 'Պատրաստ եղիր պաշտպանել քո իդեալները' },
        { text_ru: 'Страдание делает сильнее — принимай его с честью', text_en: 'Suffering makes you stronger — accept it with honor', text_am: 'Տառապանքը քեզ ավելի ուժեղ է դարձնում, ընդունիր այն պատվով' },
        { text_ru: 'Иди туда, где трудно, но нужно', text_en: 'Go where it’s hard but necessary', text_am: 'Գնա այնտեղ, որտեղ դժվար է, բայց անհրաժեշտ' },
        { text_ru: 'Стой на ногах, когда другие падают', text_en: 'Stand firm when others fall', text_am: 'Կանգնիր ամուր, երբ ուրիշները ընկնում են' },
        { text_ru: 'Преодолевай себя ежедневно', text_en: 'Overcome yourself daily', text_am: 'Հաղթահարիր ինքդ քեզ ամեն օր' },
        { text_ru: 'Настоящий воин — тот, кто не сдаётся', text_en: 'A true warrior is one who never gives up', text_am: 'Իսկական մարտիկը նա է, ով երբեք չի հանձնվում' },
        { text_ru: 'Слушай больше, чем говоришь', text_en: 'Listen more than you speak', text_am: 'Լսիր ավելի շատ, քան խոսում ես' },
        { text_ru: 'Читай книги — питай ум', text_en: 'Read books — nourish your mind', text_am: 'Կարդա գրքեր, սնիր միտքդ' },
        { text_ru: 'Молчи, если слова не принесут пользы', text_en: 'Stay silent if your words bring no value', text_am: 'Լռիր, եթե խոսքերդ օգուտ չեն բերի' },
        { text_ru: 'Учись на ошибках — своих и чужих', text_en: 'Learn from mistakes — yours and others’', text_am: 'Սովորիր սխալներից՝ քո և ուրիշների' },
        { text_ru: 'Будь терпелив', text_en: 'Be patient', text_am: 'Համբերատար եղիր' },
        { text_ru: 'Изучай своё сердце', text_en: 'Explore your heart', text_am: 'Հետազոտիր քո սիրտը' },
        { text_ru: 'Найди наставника и стань наставником', text_en: 'Find a mentor and become one', text_am: 'Գտիր դաստիարակ և դարձիր դաստիարակ' },
        { text_ru: 'Не ленись — лень убивает дух', text_en: 'Don’t be lazy — laziness kills the spirit', text_am: 'Մի ծուլացիր, ծուլությունը սպանում է հոգին' },
        { text_ru: 'Дисциплина важнее мотивации', text_en: 'Discipline is more important than motivation', text_am: 'Կարգապահությունը ավելի կարևոր է, քան մոտիվացիան' },
        { text_ru: 'Действуй в тишине — результат скажет за тебя', text_en: 'Act quietly — let results speak for you', text_am: 'Գործիր լուռ, արդյունքը կխոսի քո փոխարեն' },
        { text_ru: 'Будь верен слову, семье', text_en: 'Be loyal to your word and family', text_am: 'Հավատարիմ եղիր խոսքիդ և ընտանիքիդ' },
        { text_ru: 'Уходи достойно, если надо', text_en: 'Leave with dignity if you must', text_am: 'Հեռացիր արժանապատվությամբ, եթե պետք է' },
        { text_ru: 'Не бойся остаться один, если это по чести', text_en: 'Don’t fear being alone if it’s honorable', text_am: 'Մի վախեցիր մենակ մնալուց, եթե դա պատվով է' },
        { text_ru: 'Будь примером для младших', text_en: 'Be a role model for the young', text_am: 'Օրինակ եղիր երիտասարդների համար' },
        { text_ru: 'Не меняйся ради одобрения', text_en: 'Don’t change for others’ approval', text_am: 'Մի փոխվիր ուրիշների հավանության համար' },
        { text_ru: 'Думай, что ты оставишь после себя', text_en: 'Think about what you’ll leave behind', text_am: 'Մտածիր, թե ինչ կթողնես քո հետևից' },
        { text_ru: 'Не ищи смысла вовне — строй его сам', text_en: 'Don’t seek meaning externally — build it yourself', text_am: 'Մի փնտրիր իմաստը դրսում, կառուցիր այն ինքդ' },
        { text_ru: 'Будь готов умереть за то, во что веришь', text_en: 'Be ready to die for what you believe in', text_am: 'Պատրաստ եղիր մեռնել հանուն այն ամենի, ինչին հավատում ես' },
        { text_ru: 'Делай добро втайне', text_en: 'Do good secretly', text_am: 'Բարի գործեր արա գաղտնի' },
        { text_ru: 'Будь благодарен за испытания', text_en: 'Be grateful for challenges', text_am: 'Երախտապարտ եղիր փորձությունների համար' },
        { text_ru: 'Следуй своему предназначению', text_en: 'Follow your purpose', text_am: 'Հետևիր քո կոչմանը' },
        { text_ru: 'Не будь рабом ни удовольствий, ни боли', text_en: 'Don’t be a slave to pleasure or pain', text_am: 'Մի եղիր հաճույքների կամ ցավի ստրուկ' },
        { text_ru: 'Управляй страстями, а не подчиняйся им', text_en: 'Master your passions, don’t obey them', text_am: 'Կառավարիր կրքերդ, մի ենթարկվիր նրանց' },
        { text_ru: 'Будь спокойным в гневе', text_en: 'Stay calm in anger', text_am: 'Հանգիստ եղիր զայրույթի մեջ' },
        { text_ru: 'Наслаждайся, но не растворяйся в наслаждении', text_en: 'Enjoy pleasure but don’t lose yourself in it', text_am: 'Վայելիր, բայց մի կորսվիր հաճույքի մեջ' },
        { text_ru: 'Тренируй дух, тело и ум одновременно', text_en: 'Train your spirit, body, and mind together', text_am: 'Մարզիր հոգիդ, մարմինդ և միտքդ միաժամանակ' },
        { text_ru: 'Не сравнивай себя с другими', text_en: 'Don’t compare yourself to others', text_am: 'Մի համեմատիր քեզ ուրիշների հետ' },
        { text_ru: 'Научись быть одному', text_en: 'Learn to be at peace alone', text_am: 'Սովորիր հանգիստ մենակ լինել' },
        { text_ru: 'Верь в себя — без высокомерия', text_en: 'Believe in yourself — without arrogance', text_am: 'Հավատա ինքդ քեզ, առանց ամբարտավանության' },
        { text_ru: 'Помни: власть над собой — высшая форма силы', text_en: 'Remember: self-mastery is the highest form of strength', text_am: 'Հիշիր՝ ինքդ քեզ վրա իշխանությունը ուժի բարձրագույն ձևն է' },
        { text_ru: 'Учись постоянно', text_en: 'Never stop learning', text_am: 'Անընդհատ սովորիր' },
        { text_ru: 'Старайся стать лучше каждый день', text_en: 'Strive to improve every day', text_am: 'Ձգտիր ամեն օր դառնալ ավելի լավը' },
        { text_ru: 'Преодолевай старые слабости', text_en: 'Overcome your old weaknesses', text_am: 'Հաղթահարիր հին թուլություններդ' },
        { text_ru: 'Развивай лидерство', text_en: 'Develop leadership', text_am: 'Զարգացրու առաջնորդությունը' },
        { text_ru: 'Не бойся перемен — расти в них', text_en: 'Don’t fear change — grow through it', text_am: 'Մի վախեցիր փոփոխություններից, աճիր դրանց միջով' },
        { text_ru: 'Не сдавайся при первых трудностях', text_en: 'Don’t give up at the first obstacle', text_am: 'Մի հանձնվիր առաջին դժվարությունների ժամանակ' },
        { text_ru: 'Находи смысл даже в падениях', text_en: 'Find meaning even in failure', text_am: 'Իմաստ գտիր նույնիսկ անհաջողությունների մեջ' },
        { text_ru: 'Будь собой — подлинно и смело', text_en: 'Be yourself — authentically and boldly', text_am: 'Եղիր ինքդ, անկեղծ և համարձակ' },
        { text_ru: 'Живи так, чтобы тобой гордились', text_en: 'Live so others are proud of you', text_am: 'Ապրիր այնպես, որ քեզնով հպարտանան' },
        { text_ru: 'Воспитай будущих мужчин', text_en: 'Raise future men', text_am: 'Դաստիարակիր ապագա տղամարդկանց' },
        { text_ru: 'Защищай природу и жизнь', text_en: 'Protect nature and life', text_am: 'Պաշտպանիր բնությունը և կյանքը' },
        { text_ru: 'Помни о своей смертности — и живи осознанно', text_en: 'Remember your mortality — live consciously', text_am: 'Հիշիր քո մահկանացու լինելը և ապրիր գիտակցաբար' },
        { text_ru: 'Даруй свет, даже если вокруг тьма', text_en: 'Shine light, even in darkness', text_am: 'Լույս տուր, նույնիսկ եթե շուրջը խավար է' },
        { text_ru: 'Не жди лучшего времени — твори сейчас', text_en: 'Don’t wait for the perfect time — create now', text_am: 'Մի սպասիր ավելի լավ ժամանակի, ստեղծիր հիմա' },
        { text_ru: 'Сделай мир хоть немного лучше', text_en: 'Make the world a little better', text_am: 'Աշխարհը գոնե մի փոքր ավելի լավը դարձրու' },
        { text_ru: 'Помни, кем ты был — и кем хочешь стать', text_en: 'Remember who you were — and who you want to be', text_am: 'Հիշիր, թե ով ես եղել և ով ես ուզում դառնալ' },
        { text_ru: 'Будь мужчиной, которому ты бы сам доверился', text_en: 'Be a man you’d trust yourself', text_am: 'Եղիր այն տղամարդը, որին ինքդ կվստահեիր' },
        { text_ru: 'Слово — это клятва. Говори мало, делай много', text_en: 'Your word is your oath. Speak little, do much', text_am: 'Խոսքը երդում է. Քիչ խոսիր, շատ արա' },
        { text_ru: 'Страх — сигнал, а не приговор. Преодолевай', text_en: 'Fear is a signal, not a sentence. Overcome it', text_am: 'Վախը ազդանշան է, ոչ թե դատավճիռ: Հաղթահարիր այն' },
        { text_ru: 'Выбирай трудное ради великой цели', text_en: 'Choose the hard path for a great goal', text_am: 'Ընտրիր դժվար ճանապարհը մեծ նպատակի համար' },
        { text_ru: 'Не обвиняй — ищи решение', text_en: 'Don’t blame — find solutions', text_am: 'Մի մեղադրիր, լուծումներ փնտրիր' },
        { text_ru: 'Твоя сила — в ответственности', text_en: 'Your strength lies in responsibility', text_am: 'Քո ուժը պատասխանատվության մեջ է' },
        { text_ru: 'Мужчина не жалуется — он действует', text_en: 'A man doesn’t complain — he acts', text_am: 'Տղամարդը չի բողոքում, նա գործում է' },
        { text_ru: 'Ошибся — признай, исправь, расти', text_en: 'If you err, admit it, fix it, grow', text_am: 'Սխալվել ես՝ ընդունիր, ուղղիր, աճիր' },
        { text_ru: 'Будь опорой для тех, кто слабее', text_en: 'Be a pillar for those weaker than you', text_am: 'Հենարան եղիր նրանց համար, ովքեր ավելի թույլ են' },
        { text_ru: 'Не сравнивай себя с другими — сравнивай с собой вчерашним', text_en: 'Don’t compare yourself to others — compare to yesterday’s you', text_am: 'Մի համեմատիր քեզ ուրիշների հետ, համեմատիր երեկվա քեզ հետ' },
        { text_ru: 'Настоящий лидер — тот, кто служит', text_en: 'A true leader serves', text_am: 'Իսկական առաջնորդը նա է, ով ծառայում է' },
        { text_ru: 'Молчание — тоже ответ. Учись слушать', text_en: 'Silence is also an answer. Learn to listen', text_am: 'Լռությունը նույնպես պատասխան է: Սովորիր լսել' },
        { text_ru: 'Будь хозяином своих эмоций', text_en: 'Be the master of your emotions', text_am: 'Եղիր քո հույզերի տերը' },
        { text_ru: 'Умей прощать, но не забывай урок', text_en: 'Forgive, but don’t forget the lesson', text_am: 'Կարողացիր ներել, բայց մի մոռացիր դասը' },
        { text_ru: 'Уважай старших и тех, кто прошёл больше тебя', text_en: 'Respect elders and those who’ve walked further', text_am: 'Հարգիր մեծերին և նրանց, ովքեր ավելի շատ են անցել' },
        { text_ru: 'Отношения — это не слабость, а сила, если в них честь', text_en: 'Relationships aren’t weakness — they’re strength, if honorable', text_am: 'Հարաբերությունները թուլություն չեն, այլ ուժ, եթե դրանք պատվով են' },
        { text_ru: 'Учись каждый день. Мужчина не перестаёт развиваться', text_en: 'Learn every day. A man never stops growing', text_am: 'Ամեն օր սովորիր: Տղամարդը երբեք չի դադարում զարգանալ' },
        { text_ru: 'Верь в то, что делаешь. Без веры — нет силы', text_en: 'Believe in what you do. Without faith, there’s no strength', text_am: 'Հավատա այն ամենին, ինչ անում ես: Առանց հավատի ուժ չկա' },
        { text_ru: 'Победа — это настойчивость, а не везение', text_en: 'Victory is persistence, not luck', text_am: 'Հաղթանակը համառությունն է, ոչ թե բախտը' },
        { text_ru: 'Умей проигрывать с достоинством', text_en: 'Lose with dignity', text_am: 'Կարողացիր պարտվել արժանապատվությամբ' },
        { text_ru: 'Настоящий мужчина умеет сказать "нет"', text_en: 'A true man knows how to say “no”', text_am: 'Իսկական տղամարդը գիտի, թե ինչպես ասել «ոչ»' },
        { text_ru: 'Не кайся в доброте — кайся в слабости', text_en: 'Don’t regret kindness — regret weakness', text_am: 'Մի զղջա բարության համար, զղջա թուլության համար' },
        { text_ru: 'Дисциплина — выше мотивации', text_en: 'Discipline surpasses motivation', text_am: 'Կարգապահությունը գերազանցում է մոտիվացիային' },
        { text_ru: 'Твои друзья — это твоё отражение', text_en: 'Your friends reflect you', text_am: 'Քո ընկերները քո արտացոլանքն են' },
        { text_ru: 'Стиль — это чистота, простота и уверенность', text_en: 'Style is cleanliness, simplicity, and confidence', text_am: 'Ոճը մաքրություն է, պարզություն և վստահություն' },
        { text_ru: 'Научись быть один, чтобы быть сильным в обществе', text_en: 'Learn to be alone to be strong in company', text_am: 'Սովորիր մենակ լինել, որպեսզի ուժեղ լինես հասարակության մեջ' },
        { text_ru: 'Будь непоколебим в своих принципах', text_en: 'Be unwavering in your principles', text_am: 'Անսասան եղիր քո սկզբունքներում' },
        { text_ru: 'Относись к деньгам как к ресурсу, а не как к цели', text_en: 'Treat money as a resource, not a goal', text_am: 'Վերաբերվիր փողին որպես ռեսուրսի, ոչ թե նպատակի' },
        { text_ru: 'Твоя репутация — твоя тень. Береги её', text_en: 'Your reputation is your shadow. Protect it', text_am: 'Քո հեղինակությունը քո ստվերն է: Պաշտպանիր այն' },
        { text_ru: 'Настоящая сила — в умении управлять собой', text_en: 'True strength is in self-control', text_am: 'Իսկական ուժը ինքնակառավարման մեջ է' },
        { text_ru: 'Не позволяй слабым привычкам управлять собой', text_en: 'Don’t let weak habits rule you', text_am: 'Թույլ մի տուր, որ թույլ սովորությունները կառավարեն քեզ' },
        { text_ru: 'Учись у всех — гордость ослепляет', text_en: 'Learn from everyone — pride blinds', text_am: 'Սովորիր բոլորից, հպարտությունը կուրացնում է' },
        { text_ru: 'Женщины любят мужчин, которые уважают себя', text_en: 'Women love men who respect themselves', text_am: 'Կանայք սիրում են տղամարդկանց, ովքեր հարգում են իրենց' },
        { text_ru: 'Не бойся выглядеть глупо — бойся не попробовать', text_en: 'Don’t fear looking foolish — fear not trying', text_am: 'Մի վախեցիր հիմար երևալուց, վախեցիր չփորձելուց' },
        { text_ru: 'Сдержанность — это корень уважения', text_en: 'Restraint is the root of respect', text_am: 'Զսպվածությունը հարգանքի արմատն է' },
        { text_ru: 'Уважай личные границы — свои и чужие', text_en: 'Respect boundaries — yours and others’', text_am: 'Հարգիր անձնական սահմանները՝ քո և ուրիշների' },
        { text_ru: 'Настоящая свобода — это ответственность', text_en: 'True freedom is responsibility', text_am: 'Իսկական ազատությունը պատասխանատվությունն է' },
        { text_ru: 'Успех — это побочный эффект верного пути', text_en: 'Success is a byproduct of the right path', text_am: 'Հաջողությունը ճիշտ ճանապարհի կողմնակի արդյունք է' },
        { text_ru: 'Уважай своё время — и чужое', text_en: 'Respect your time — and others’', text_am: 'Հարգիր քո ժամանակը և ուրիշներինը' },
        { text_ru: 'Боль временна, позор — навсегда', text_en: 'Pain is temporary, shame is forever', text_am: 'Ցավը ժամանակավոր է, ամոթը՝ հավերժ' },
        { text_ru: 'Цени молчаливую уверенность выше громких слов', text_en: 'Value quiet confidence over loud words', text_am: 'Գնահատիր լուռ վստահությունը բարձր խոսքերից ավելի' },
        { text_ru: 'Будь примером, а не проповедником', text_en: 'Be an example, not a preacher', text_am: 'Օրինակ եղիր, ոչ թե քարոզիչ' },
        { text_ru: 'Действуй, даже если страшно', text_en: 'Act, even if you’re afraid', text_am: 'Գործիր, նույնիսկ եթե վախենում ես' },
        { text_ru: 'Помни: мальчики требуют, мужчины создают', text_en: 'Boys demand, men create', text_am: 'Հիշիր՝ տղաները պահանջում են, տղամարդիկ ստեղծում են' },
        { text_ru: 'Не ищи лёгких путей — ищи правильные', text_en: 'Don’t seek easy paths — seek the right ones', text_am: 'Մի փնտրիր հեշտ ճանապարհներ, փնտրիր ճիշտ ճանապարհներ' },
        { text_ru: 'Всегда ищи новые знания — мир огромен, и возможности для роста бесконечны', text_en: 'Always seek new knowledge — the world is vast, and growth is endless', text_am: 'Միշտ փնտրիր նոր գիտելիքներ, աշխարհը հսկայական է, և աճի հնարավորությունները անվերջ են' },
        { text_ru: 'Изучай историю — в ней уроки прошлого, которые помогут тебе не повторять ошибки', text_en: 'Study history — it holds lessons to avoid past mistakes', text_am: 'Ուսումնասիրիր պատմությունը, այն պարունակում է անցյալի դասեր, որոնք կօգնեն խուսափել սխալներից' },
        { text_ru: 'Развивай своё ремесло — будь мастером своего дела, стремись к совершенству в том, что ты делаешь', text_en: 'Hone your craft — be a master of your work, aim for perfection', text_am: 'Զարգացրու քո արհեստը, եղիր քո գործի վարպետ, ձգտիր կատարելության' },
        { text_ru: 'Не бойся одиночества — иногда это лучшее время для самопознания и роста', text_en: 'Don’t fear solitude — it’s often the best time for self-discovery and growth', text_am: 'Մի վախեցիր մենակությունից, երբեմն դա լավագույն ժամանակն է ինքնաճանաչման և աճի համար' },
        { text_ru: 'Будь честен с собой — признавай свои слабости, чтобы работать над ними', text_en: 'Be honest with yourself — acknowledge weaknesses to work on them', text_am: 'Ազնիվ եղիր ինքդ քո հետ, ընդունիր թուլություններդ, որպեսզի աշխատես դրանց վրա' },
        { text_ru: 'Отдавай должное другим — признавай их заслуги и достижения', text_en: 'Give credit to others — recognize their merits and achievements', text_am: 'Հարգանք տուր ուրիշներին, ընդունիր նրանց վաստակն ու ձեռքբերումները' },
        { text_ru: 'Не сравнивай себя с другими — твой путь уникален, иди по нему с достоинством', text_en: 'Don’t compare yourself to others — your path is unique, walk it with dignity', text_am: 'Մի համեմատիր քեզ ուրիշների հետ, քո ճանապարհը եզակի է, քայլիր այն արժանապատվությամբ' },
        { text_ru: 'Помогай слабым — истинная сила проявляется в защите тех, кто не может постоять за себя', text_en: 'Help the weak — true strength shows in protecting those who can’t defend themselves', text_am: 'Օգնիր թույլերին, իսկական ուժը դրսևորվում է նրանց պաշտպանելու մեջ, ովքեր չեն կարող ինքնապաշտպանվել' },
        { text_ru: 'Будь надёжен — твоё слово должно быть твёрже камня', text_en: 'Be reliable — your word must be stronger than stone', text_am: 'Հուսալի եղիր, քո խոսքը պետք է քարից ամուր լինի' },
        { text_ru: 'Цени своих учителей — они делятся мудростью, которая может осветить твой путь', text_en: 'Value your teachers — they share wisdom that lights your path', text_am: 'Գնահատիր քո ուսուցիչներին, նրանք կիսում են իմաստություն, որն օգնում է լուսավորել քո ճանապարհը' },
        { text_ru: 'Будь благодарен — цени то, что у тебя есть, и тех, кто рядом', text_en: 'Be grateful — appreciate what you have and those around you', text_am: 'Երախտապարտ եղիր, գնահատիր այն, ինչ ունես, և նրանց, ովքեր կողքիդ են' },
        { text_ru: 'Развивай дисциплину — она ключ к достижению любых целей', text_en: 'Build discipline — it’s the key to achieving any goal', text_am: 'Զարգացրու կարգապահություն, այն ցանկացած նպատակի հասնելու բանալին է' },
        { text_ru: 'Учись принимать критику — она может быть болезненной, но часто ведёт к улучшению', text_en: 'Learn to accept criticism — it may hurt but often leads to improvement', text_am: 'Սովորիր ընդունել քննադատությունը, այն կարող է ցավոտ լինել, բայց հաճախ բերում է կատարելագործման' },
        { text_ru: 'Не бойся ошибок — они не поражения, а ступени к успеху', text_en: 'Don’t fear mistakes — they’re not failures but steps to success', text_am: 'Մի վախեցիր սխալներից, դրանք պարտություններ չեն, այլ հաջողության աստիճաններ' },
        { text_ru: 'Помни о своих корнях — знай, откуда ты родом, и чьё наследие несёшь', text_en: 'Remember your roots — know where you come from and whose legacy you carry', text_am: 'Հիշիր քո արմատները, իմացիր, թե որտեղից ես գալիս և ում ժառանգությունն ես կրում' },
        { text_ru: 'Будь готов к переменам — мир не стоит на месте, и тебе тоже нужно двигаться вперёд', text_en: 'Be ready for change — the world moves, and so must you', text_am: 'Պատրաստ եղիր փոփոխությունների, աշխարհը կանգ չի առնում, և դու նույնպես պետք է առաջ գնաս' },
        { text_ru: 'Живи настоящим моментом — прошлое ушло, будущее ещё не наступило', text_en: 'Live in the present — the past is gone, the future isn’t here', text_am: 'Ապրիր ներկա պահով, անցյալն անցել է, ապագան դեռ չի եկել' },
        { text_ru: 'Доверяй своей интуиции — иногда внутренний голос знает лучше', text_en: 'Trust your intuition — sometimes your inner voice knows best', text_am: 'Վստահիր քո ինտուիցիային, երբեմն ներքին ձայնն ավելի լավ է իմանում' },
        { text_ru: 'Учись прощать — обиды лишь отягощают душу, освободись от них', text_en: 'Learn to forgive — grudges weigh down the soul, let them go', text_am: 'Սովորիր ներել, վիրավորանքները ծանրացնում են հոգին, ազատվիր դրանցից' },
        { text_ru: 'Не сдавайся перед трудностями — именно они показывают твою истинную силу и стойкость', text_en: 'Don’t give up in the face of hardship — it reveals your true strength and resilience', text_am: 'Մի հանձնվիր դժվարությունների առաջ, դրանք ցույց են տալիս քո իսկական ուժն ու տոկունությունը' },
        { text_ru: 'Будь терпелив — великие дела не делаются в спешке', text_en: 'Be patient — great things aren’t done in haste', text_am: 'Համբերատար եղիր, մեծ գործերը չեն արվում շտապողությամբ' },
        { text_ru: 'Заботься о своём разуме — постоянно развивай его, читая, размышляя и учась', text_en: 'Care for your mind — keep developing it through reading, thinking, and learning', text_am: 'Հոգ տար քո մտքի մասին, անընդհատ զարգացրու այն՝ կարդալով, մտածելով և սովորելով' },
        { text_ru: 'Найди своё призвание — делай то, что наполняет тебя смыслом и энергией', text_en: 'Find your calling — do what fills you with meaning and energy', text_am: 'Գտիր քո կոչումը, արա այն, ինչը քեզ լցնում է իմաստով և էներգիայով' },
        { text_ru: 'Не ищи лёгких путей — истинная ценность в том, что достигается с трудом', text_en: 'Don’t seek easy paths — true value lies in what’s earned through effort', text_am: 'Մի փնտրիր հեշտ ճանապարհներ, իսկական արժեքը ջանքերով ձեռք բերվածի մեջ է' },
        { text_ru: 'Учись слушать тишину — иногда в ней скрыты самые важные ответы', text_en: 'Learn to listen to silence — it often holds the most important answers', text_am: 'Սովորիր լսել լռությունը, երբեմն դրա մեջ են թաքնված ամենակարևոր պատասխանները' },
        { text_ru: 'Будь стоек в своих убеждениях — если они основаны на правде', text_en: 'Stand firm in your convictions — if they’re rooted in truth', text_am: 'Անսասան եղիր քո համոզմունքներում, եթե դրանք հիմնված են ճշմարտության վրա' },
        { text_ru: 'Не забывай о своих обещаниях — особенно данных себе', text_en: 'Don’t forget your promises — especially those to yourself', text_am: 'Մի մոռացիր քո խոստումները, հատկապես քեզ տվածները' },
        { text_ru: 'Развивай свою внутреннюю силу — она поможет тебе выстоять в любой буре', text_en: 'Build inner strength — it will carry you through any storm', text_am: 'Զարգացրու քո ներքին ուժը, այն կօգնի քեզ դիմակայել ցանկացած փոթորիկ' },
        { text_ru: 'Вставай каждый раз, когда падаешь — и делай это с большей решимостью', text_en: 'Rise each time you fall — with greater resolve', text_am: 'Վեր կաց ամեն անգամ, երբ ընկնում ես, և արա դա ավելի մեծ վճռականությամբ' },
        { text_ru: 'Будь внимателен к мелочам — часто в них кроется разница между успехом и неудачей', text_en: 'Pay attention to details — they often make the difference between success and failure', text_am: 'Ուշադիր եղիր մանրուքների նկատմամբ, հաճախ դրանք են տարբերություն ստեղծում հաջողության և ձախողման միջև' },
        { text_ru: 'Учись быть лидером — не только для других, но и для себя самого', text_en: 'Learn to be a leader — not just for others, but for yourself', text_am: 'Սովորիր առաջնորդ լինել՝ ոչ միայն ուրիշների, այլև ինքդ քո համար' },
        { text_ru: 'Не теряй веры в добро — даже когда мир кажется мрачным', text_en: 'Don’t lose faith in goodness — even when the world seems dark', text_am: 'Մի կորցրու հավատը բարության հանդեպ, նույնիսկ երբ աշխարհը մութ է թվում' },
        { text_ru: 'Будь открыт новым идеям — они могут прийти откуда угодно', text_en: 'Be open to new ideas — they can come from anywhere', text_am: 'Բաց եղիր նոր գաղափարների համար, դրանք կարող են գալ ցանկացած տեղից' },
        { text_ru: 'Помни о своей смертности — это придаёт ценность каждому дню', text_en: 'Remember your mortality — it gives value to each day', text_am: 'Հիշիր քո մահկանացու լինելը, դա արժեք է հաղորդում յուրաքանչյուր օրվա' },
        { text_ru: 'Ищи красоту во всём — даже в самых обыденных вещах', text_en: 'Find beauty in everything — even the mundane', text_am: 'Գտիր գեղեցկությունը ամեն ինչում, նույնիսկ ամենօրյա բաներում' },
        { text_ru: 'Учись отдыхать — чтобы твои силы восстанавливались', text_en: 'Learn to rest — to restore your strength', text_am: 'Սովորիր հանգստանալ, որպեսզի քո ուժերը վերականգնվեն' },
        { text_ru: 'Будь умерен во всём — как в радостях, так и в лишениях', text_en: 'Be moderate in all things — in joy and in hardship', text_am: 'Չափավոր եղիր ամեն ինչում՝ ուրախությունների և զրկանքների մեջ' },
        { text_ru: 'Не бойся быть уязвимым — это признак силы, а не слабости', text_en: 'Don’t fear vulnerability — it’s a sign of strength, not weakness', text_am: 'Մի վախեցիր խոցելի լինելուց, դա ուժի նշան է, ոչ թե թուլության' },
        { text_ru: 'Учись управлять своим временем — оно бесценно', text_en: 'Manage your time — it’s priceless', text_am: 'Սովորիր կառավարել քո ժամանակը, այն անգին է' },
        { text_ru: 'Держи своё слово — твоя репутация зависит от этого', text_en: 'Keep your word — your reputation depends on it', text_am: 'Պահիր խոսքդ, քո հեղինակությունը կախված է դրանից' },
        { text_ru: 'Учись быть наблюдательным — замечай детали, которые другие упускают', text_en: 'Be observant — notice details others miss', text_am: 'Սովորիր դիտող լինել, նկատիր մանրուքներ, որոնք ուրիշները բաց են թողնում' },
        { text_ru: 'Не позволяй страху сковывать тебя — действуй, несмотря на него', text_en: 'Don’t let fear paralyze you — act despite it', text_am: 'Թույլ մի տուր, որ վախը կաշկանդի քեզ, գործիր՝ չնայած դրան' },
        { text_ru: 'Будь гибким — иногда нужно изменить план, чтобы достичь цели', text_en: 'Be flexible — sometimes plans must change to reach the goal', text_am: 'Ճկուն եղիր, երբեմն պետք է փոխել պլանը՝ նպատակին հասնելու համար' },
        { text_ru: 'Помогай другим найти свой путь — делиться мудростью — это благородно', text_en: 'Help others find their path — sharing wisdom is noble', text_am: 'Օգնիր ուրիշներին գտնել իրենց ճանապարհը, իմաստություն կիսելը ազնիվ է' },
        { text_ru: 'Развивай эмпатию — понимание других делает тебя сильнее', text_en: 'Develop empathy — understanding others makes you stronger', text_am: 'Զարգացրու կարեկցանք, ուրիշներին հասկանալը քեզ ավելի ուժեղ է դարձնում' },
        { text_ru: 'Ищи смысл во всём, что делаешь — это придаёт цель', text_en: 'Find meaning in all you do — it gives purpose', text_am: 'Իմաստ փնտրիր այն ամենում, ինչ անում ես, դա նպատակ է տալիս' },
        { text_ru: 'Не бойся говорить "нет" — когда это необходимо для твоей целостности', text_en: 'Don’t fear saying “no” — when it’s needed for your integrity', text_am: 'Մի վախեցիր ասել «ոչ», երբ դա անհրաժեշտ է քո ամբողջականության համար' },
        { text_ru: 'Постоянно совершенствуйся — каждый день иди к лучшей версии себя', text_en: 'Constantly improve — strive to be better than yesterday', text_am: 'Անընդհատ կատարելագործվիր, ամեն օր ձգտիր դառնալ քո լավագույն տարբերակը' },
        { text_ru: 'Помни, что истинная сила — во внутренней гармонии', text_en: 'Remember true strength lies in inner harmony', text_am: 'Հիշիր, որ իսկական ուժը ներքին ներդաշնակության մեջ է' },
        { text_ru: 'Будь примером — твои действия говорят громче, чем слова', text_en: 'Be an example — your actions speak louder than words', text_am: 'Օրինակ եղիր, քո գործողությունները ավելի բարձր են խոսում, քան խոսքերը' }
      ];
      await queryInterface.bulkInsert('principles', principlesData, {});
      console.log('🟢 Принципы инициализированы');
    }

    // Seed Image Fragments
    const fragmentsCount = await queryInterface.sequelize.query(
        `SELECT COUNT(*) FROM image_fragments;`, // Assuming 'image_fragments' as table name for ImageFragment model
        { type: Sequelize.QueryTypes.SELECT }
    );

    if (fragmentsCount[0]['COUNT(*)'] === 0) {
      const fragmentsData = [
        { subject: 'A fearless warrior', action: 'stands on a battlefield at sunset, sword in hand', setting: 'facing the horizon with unwavering resolve' },
        { subject: 'A charismatic leader', action: 'addresses a roaring crowd from a high balcony', setting: 'city lights sparkling below under a starry sky' },
        { subject: 'A lone knight', action: 'kneels in a misty forest, armor gleaming under moonlight', setting: 'holding a glowing sword' },
        { subject: 'A defiant hero', action: 'stands on a crumbling fortress wall, flag in hand', setting: 'as storm clouds gather overhead' },
        { subject: 'A weary traveler', action: 'reaches the peak of a mountain at dawn', setting: 'gazing at a golden valley below, filled with hope' },
        { subject: 'A brave captain', action: 'stands at the helm of a ship', setting: 'facing a raging sea storm, with lightning illuminating the waves' },
        { subject: 'A lone archer', action: 'stands on a hill, bow drawn', setting: 'silhouetted against a fiery sunset, ready to defend their land' },
        { subject: 'A powerful sorceress', action: 'raises her staff on a glowing rune-covered platform', setting: 'with a cosmic vortex swirling above' },
        { subject: 'A battle-scarred general', action: 'rallies their troops in a rain-soaked valley', setting: 'holding a banner high under a turbulent sky' },
        { subject: 'A young hero', action: 'stands at the edge of a glowing portal, sword raised', setting: 'ready to step into an unknown world' },
        { subject: 'A victorious general', action: 'raises a gleaming sword before a cheering army', setting: 'a vast plain stretching to the distant mountains' },
        { subject: 'A fire-eyed leader', action: 'raises their arms beneath a stormy sky, voice thundering as the crowd roars in awe', setting: 'a grand amphitheater under a setting sun' },
        { subject: 'An ancient king', action: 'leads a mighty host into a decisive battle', setting: 'a desolate valley echoing with war cries' },
        { subject: 'An ancient sorcerer', action: 'casts a powerful spell in a hidden chamber', setting: 'ancient runes glowing on the walls' },
        { subject: 'A clever rogue', action: 'silently infiltrates a heavily guarded fortress', setting: 'shadows stretching long in the moonlit courtyard' },
        { subject: 'A mystical healer', action: 'tends to a wounded beast in a sun-dappled grove', setting: 'fragrant herbs laid out on mossy stones' },
        { subject: 'A seasoned explorer', action: 'discovers a lost artifact in a forgotten tomb', setting: 'dust motes dancing in the single shaft of light' },
        { subject: 'A young inventor', action: 'launches a fantastical contraption into the sky', setting: 'a bustling cityscape far below' }
      ];
      await queryInterface.bulkInsert('image_fragments', fragmentsData, {});
      console.log('🟢 Фрагменты изображений инициализированы');
    }

    // Seed Image Styles
    const stylesCount = await queryInterface.sequelize.query(
        `SELECT COUNT(*) FROM image_styles;`,
        { type: Sequelize.QueryTypes.SELECT }
    );

    if (stylesCount[0]['COUNT(*)'] === 0) {
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
      await queryInterface.bulkInsert('image_styles', stylesData, {});
      console.log('🟢 Стили изображений инициализированы');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('principles', null, {});
    await queryInterface.bulkDelete('image_fragments', null, {});
    await queryInterface.bulkDelete('image_styles', null, {});
    console.log('🔴 Инициализированные данные удалены (down seeder)');
  }
};
