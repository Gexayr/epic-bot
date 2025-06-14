###

create table if not exists telegram_bot_db.image_prompt
(
    id         int auto_increment
    primary key,
    prompt     varchar(1000)                      null,
    style      varchar(255)                       null,
    created_at datetime default CURRENT_TIMESTAMP null
    );


###

create table telegram_bot_db.principles_log
(
    id         int auto_increment
        primary key,
    text       text                               not null,
    created_at datetime default CURRENT_TIMESTAMP null
);

###

create table telegram_bot_db.users
(
    id         int auto_increment
        primary key,
    chat_id    varchar(255)                         not null,
    username   varchar(255)                         null,
    first_name varchar(255)                         null,
    last_name  varchar(255)                         null,
    lang       varchar(5) default 'en'            null,
    info       json                                 null,
    is_active  tinyint(1) default 1                 null,
    created_at datetime   default CURRENT_TIMESTAMP null,
    constraint chat_id
        unique (chat_id)
);

###

CREATE TABLE IF NOT EXISTS image_styles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        style_name VARCHAR(255) NOT NULL UNIQUE
    );


###

CREATE TABLE IF NOT EXISTS image_fragments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject VARCHAR(255),
        action VARCHAR(255),
        setting VARCHAR(255)
    );

###

CREATE TABLE IF NOT EXISTS principles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text_am TEXT NULL,
      text_ru TEXT NULL,
      text_en TEXT NULL
);

###

INSERT INTO principles (text_ru, text_en, text_am) VALUES
('Стремись к знаниям', 'Strive for knowledge', 'Ձգտիր գիտելիքների'),
('Ищи баланс в жизни', 'Seek balance in life', 'Փնտրիր հավասարակշռություն կյանքում'),
('Говори правду, даже когда трудно', 'Tell the truth, even when it’s hard', 'Խոսիր ճշմարտությունը, նույնիսկ երբ դժվար է'),
('Держи своё слово — обещание для мужчины свято', 'Keep your word — a man’s promise is sacred', 'Պահիր խոսքդ՝ տղամարդու խոստումը սուրբ է'),
('Уважай женщин — рыцарь не унижает, а защищает', 'Respect women — a knight protects, not degrades', 'Հարգիր կանանց՝ ասպետը չի նվաստացնում, այլ պաշտպանում է'),
('Защищай слабых и невинных', 'Protect the weak and innocent', 'Պաշտպանիր թույլերին և անմեղներին'),
('Будь честен перед собой', 'Be honest with yourself', 'Ազնիվ եղիր ինքդ քո հետ'),
('Следуй своему пути, даже если он труден', 'Follow your path, even if it’s difficult', 'Հետևիր քո ճանապարհին, նույնիսկ եթե այն դժվար է'),
('Не говори за спиной — говори в лицо', 'Don’t talk behind someone’s back — speak face-to-face', 'Մի խոսիր մեջքի հետևում, խոսիր դեմ առ դեմ'),
('Не оправдывайся, действуй', 'Don’t make excuses, act', 'Մի արդարացիր, գործիր'),
('Учись контролировать свои эмоции', 'Learn to control your emotions', 'Սովորիր կառավարել քո հույզերը'),
('Не вини других за свои неудачи', 'Don’t blame others for your failures', 'Մի մեղադրիր ուրիշներին քո ձախողումների համար'),
('Воспринимай поражение как урок', 'Treat defeat as a lesson', 'Ընդունիր պարտությունը որպես դաս'),
('Помогай без ожидания награды', 'Help without expecting a reward', 'Օգնիր առանց պարգև սպասելու'),
('Береги честь с молоду', 'Guard your honor from youth', 'Պահպանիր պատիվդ երիտասարդությունից'),
('Защищай своих близких любой ценой', 'Protect your loved ones at all costs', 'Պաշտպանիր քո հարազատներին ցանկացած գնով'),
('Заботься о своём теле — оно твой храм', 'Care for your body — it’s your temple', 'Հոգ տար քո մարմնի մասին, այն քո տաճարն է'),
('Стой прямо, даже перед страхом', 'Stand tall, even in the face of fear', 'Կանգնիր ուղիղ, նույնիսկ վախի առաջ'),
('Не прячься от проблем — решай их', 'Don’t hide from problems — solve them', 'Մի թաքնվիր խնդիրներից, լուծիր դրանք'),
('Борись за правду', 'Fight for the truth', 'Պայքարիր ճշմարտության համար'),
('Не поддавайся стадному инстинкту', 'Don’t follow the herd instinct', 'Մի տրվիր հոտի բնազդին'),
('Будь готов защищать свои идеалы', 'Be ready to defend your ideals', 'Պատրաստ եղիր պաշտպանել քո իդեալները'),
('Страдание делает сильнее — принимай его с честью', 'Suffering makes you stronger — accept it with honor', 'Տառապանքը քեզ ավելի ուժեղ է դարձնում, ընդունիր այն պատվով'),
('Иди туда, где трудно, но нужно', 'Go where it’s hard but necessary', 'Գնա այնտեղ, որտեղ դժվար է, բայց անհրաժեշտ'),
('Стой на ногах, когда другие падают', 'Stand firm when others fall', 'Կանգնիր ամուր, երբ ուրիշները ընկնում են'),
('Преодолевай себя ежедневно', 'Overcome yourself daily', 'Հաղթահարիր ինքդ քեզ ամեն օր'),
('Настоящий воин — тот, кто не сдаётся', 'A true warrior is one who never gives up', 'Իսկական մարտիկը նա է, ով երբեք չի հանձնվում'),
('Слушай больше, чем говоришь', 'Listen more than you speak', 'Լսիր ավելի շատ, քան խոսում ես'),
('Читай книги — питай ум', 'Read books — nourish your mind', 'Կարդա գրքեր, սնիր միտքդ'),
('Молчи, если слова не принесут пользы', 'Stay silent if your words bring no value', 'Լռիր, եթե խոսքերդ օգուտ չեն բերի'),
('Учись на ошибках — своих и чужих', 'Learn from mistakes — yours and others’', 'Սովորիր սխալներից՝ քո և ուրիշների'),
('Будь терпелив', 'Be patient', 'Համբերատար եղիր'),
('Изучай своё сердце', 'Explore your heart', 'Հետազոտիր քո սիրտը'),
('Найди наставника и стань наставником', 'Find a mentor and become one', 'Գտիր դաստիարակ և դարձիր դաստիարակ'),
('Не ленись — лень убивает дух', 'Don’t be lazy — laziness kills the spirit', 'Մի ծուլացիր, ծուլությունը սպանում է հոգին'),
('Дисциплина важнее мотивации', 'Discipline is more important than motivation', 'Կարգապահությունը ավելի կարևոր է, քան մոտիվացիան'),
('Действуй в тишине — результат скажет за тебя', 'Act quietly — let results speak for you', 'Գործիր լուռ, արդյունքը կխոսի քո փոխարեն'),
('Будь верен слову, семье', 'Be loyal to your word and family', 'Հավատարիմ եղիր խոսքիդ և ընտանիքիդ'),
('Уходи достойно, если надо', 'Leave with dignity if you must', 'Հեռացիր արժանապատվությամբ, եթե պետք է'),
('Не бойся остаться один, если это по чести', 'Don’t fear being alone if it’s honorable', 'Մի վախեցիր մենակ մնալուց, եթե դա պատվով է'),
('Будь примером для младших', 'Be a role model for the young', 'Օրինակ եղիր երիտասարդների համար'),
('Не меняйся ради одобрения', 'Don’t change for others’ approval', 'Մի փոխվիր ուրիշների հավանության համար'),
('Думай, что ты оставишь после себя', 'Think about what you’ll leave behind', 'Մտածիր, թե ինչ կթողնես քո հետևից'),
('Не ищи смысла вовне — строй его сам', 'Don’t seek meaning externally — build it yourself', 'Մի փնտրիր իմաստը դրսում, կառուցիր այն ինքդ'),
('Будь готов умереть за то, во что веришь', 'Be ready to die for what you believe in', 'Պատրաստ եղիր մեռնել հանուն այն ամենի, ինչին հավատում ես'),
('Делай добро втайне', 'Do good secretly', 'Բարի գործեր արա գաղտնի'),
('Будь благодарен за испытания', 'Be grateful for challenges', 'Երախտապարտ եղիր փորձությունների համար'),
('Следуй своему предназначению', 'Follow your purpose', 'Հետևիր քո կոչմանը'),
('Не будь рабом ни удовольствий, ни боли', 'Don’t be a slave to pleasure or pain', 'Մի եղիր հաճույքների կամ ցավի ստրուկ'),
('Управляй страстями, а не подчиняйся им', 'Master your passions, don’t obey them', 'Կառավարիր կրքերդ, մի ենթարկվիր նրանց'),
('Будь спокойным в гневе', 'Stay calm in anger', 'Հանգիստ եղիր զայրույթի մեջ'),
('Наслаждайся, но не растворяйся в наслаждении', 'Enjoy pleasure but don’t lose yourself in it', 'Վայելիր, բայց մի կորսվիր հաճույքի մեջ'),
('Тренируй дух, тело и ум одновременно', 'Train your spirit, body, and mind together', 'Մարզիր հոգիդ, մարմինդ և միտքդ միաժամանակ'),
('Не сравнивай себя с другими', 'Don’t compare yourself to others', 'Մի համեմատիր քեզ ուրիշների հետ'),
('Научись быть одному', 'Learn to be at peace alone', 'Սովորիր հանգիստ մենակ լինել'),
('Верь в себя — без высокомерия', 'Believe in yourself — without arrogance', 'Հավատա ինքդ քեզ, առանց ամբարտավանության'),
('Помни: власть над собой — высшая форма силы', 'Remember: self-mastery is the highest form of strength', 'Հիշիր՝ ինքդ քեզ վրա իշխանությունը ուժի բարձրագույն ձևն է'),
('Учись постоянно', 'Never stop learning', 'Անընդհատ սովորիր'),
('Старайся стать лучше каждый день', 'Strive to improve every day', 'Ձգտիր ամեն օր դառնալ ավելի լավը'),
('Преодолевай старые слабости', 'Overcome your old weaknesses', 'Հաղթահարիր հին թուլություններդ'),
('Развивай лидерство', 'Develop leadership', 'Զարգացրու առաջնորդությունը'),
('Не бойся перемен — расти в них', 'Don’t fear change — grow through it', 'Մի վախեցիր փոփոխություններից, աճիր դրանց միջով'),
('Не сдавайся при первых трудностях', 'Don’t give up at the first obstacle', 'Մի հանձնվիր առաջին դժվարությունների ժամանակ'),
('Находи смысл даже в падениях', 'Find meaning even in failure', 'Իմաստ գտիր նույնիսկ անհաջողությունների մեջ'),
('Будь собой — подлинно и смело', 'Be yourself — authentically and boldly', 'Եղիր ինքդ, անկեղծ և համարձակ'),
('Живи так, чтобы тобой гордились', 'Live so others are proud of you', 'Ապրիր այնպես, որ քեզնով հպարտանան'),
('Воспитай будущих мужчин', 'Raise future men', 'Դաստիարակիր ապագա տղամարդկանց'),
('Защищай природу и жизнь', 'Protect nature and life', 'Պաշտպանիր բնությունը և կյանքը'),
('Помни о своей смертности — и живи осознанно', 'Remember your mortality — live consciously', 'Հիշիր քո մահկանացու լինելը և ապրիր գիտակցաբար'),
('Даруй свет, даже если вокруг тьма', 'Shine light, even in darkness', 'Լույս տուր, նույնիսկ եթե շուրջը խավար է'),
('Не жди лучшего времени — твори сейчас', 'Don’t wait for the perfect time — create now', 'Մի սպասիր ավելի լավ ժամանակի, ստեղծիր հիմա'),
('Сделай мир хоть немного лучше', 'Make the world a little better', 'Աշխարհը գոնե մի փոքր ավելի լավը դարձրու'),
('Помни, кем ты был — и кем хочешь стать', 'Remember who you were — and who you want to be', 'Հիշիր, թե ով ես եղել և ով ես ուզում դառնալ'),
('Будь мужчиной, которому ты бы сам доверился', 'Be a man you’d trust yourself', 'Եղիր այն տղամարդը, որին ինքդ կվստահեիր'),
('Слово — это клятва. Говори мало, делай много', 'Your word is your oath. Speak little, do much', 'Խոսքը երդում է. Քիչ խոսիր, շատ արա'),
('Страх — сигнал, а не приговор. Преодолевай', 'Fear is a signal, not a sentence. Overcome it', 'Վախը ազդանշան է, ոչ թե դատավճիռ: Հաղթահարիր այն'),
('Выбирай трудное ради великой цели', 'Choose the hard path for a great goal', 'Ընտրիր դժվար ճանապարհը մեծ նպատակի համար'),
('Не обвиняй — ищи решение', 'Don’t blame — find solutions', 'Մի մեղադրիր, լուծումներ փնտրիր'),
('Твоя сила — в ответственности', 'Your strength lies in responsibility', 'Քո ուժը պատասխանատվության մեջ է'),
('Мужчина не жалуется — он действует', 'A man doesn’t complain — he acts', 'Տղամարդը չի բողոքում, նա գործում է'),
('Ошибся — признай, исправь, расти', 'If you err, admit it, fix it, grow', 'Սխալվել ես՝ ընդունիր, ուղղիր, աճիր'),
('Будь опорой для тех, кто слабее', 'Be a pillar for those weaker than you', 'Հենարան եղիր նրանց համար, ովքեր ավելի թույլ են'),
('Не сравнивай себя с другими — сравнивай с собой вчерашним', 'Don’t compare yourself to others — compare to yesterday’s you', 'Մի համեմատիր քեզ ուրիշների հետ, համեմատիր երեկվա քեզ հետ'),
('Настоящий лидер — тот, кто служит', 'A true leader serves', 'Իսկական առաջնորդը նա է, ով ծառայում է'),
('Молчание — тоже ответ. Учись слушать', 'Silence is also an answer. Learn to listen', 'Լռությունը նույնպես պատասխան է: Սովորիր լսել'),
('Будь хозяином своих эмоций', 'Be the master of your emotions', 'Եղիր քո հույզերի տերը'),
('Умей прощать, но не забывай урок', 'Forgive, but don’t forget the lesson', 'Կարողացիր ներել, բայց մի մոռացիր դասը'),
('Уважай старших и тех, кто прошёл больше тебя', 'Respect elders and those who’ve walked further', 'Հարգիր մեծերին և նրանց, ովքեր ավելի շատ են անցել'),
('Отношения — это не слабость, а сила, если в них честь', 'Relationships aren’t weakness — they’re strength, if honorable', 'Հարաբերությունները թուլություն չեն, այլ ուժ, եթե դրանք պատվով են'),
('Учись каждый день. Мужчина не перестаёт развиваться', 'Learn every day. A man never stops growing', 'Ամեն օր սովորիր: Տղամարդը երբեք չի դադարում զարգանալ'),
('Верь в то, что делаешь. Без веры — нет силы', 'Believe in what you do. Without faith, there’s no strength', 'Հավատա այն ամենին, ինչ անում ես: Առանց հավատի ուժ չկա'),
('Победа — это настойчивость, а не везение', 'Victory is persistence, not luck', 'Հաղթանակը համառությունն է, ոչ թե բախտը'),
('Умей проигрывать с достоинством', 'Lose with dignity', 'Կարողացիր պարտվել արժանապատվությամբ'),
('Настоящий мужчина умеет сказать "нет"', 'A true man knows how to say “no”', 'Իսկական տղամարդը գիտի, թե ինչպես ասել «ոչ»'),
('Не кайся в доброте — кайся в слабости', 'Don’t regret kindness — regret weakness', 'Մի զղջա բարության համար, զղջա թուլության համար'),
('Дисциплина — выше мотивации', 'Discipline surpasses motivation', 'Կարգապահությունը գերազանցում է մոտիվացիային'),
('Твои друзья — это твоё отражение', 'Your friends reflect you', 'Քո ընկերները քո արտացոլանքն են'),
('Стиль — это чистота, простота и уверенность', 'Style is cleanliness, simplicity, and confidence', 'Ոճը մաքրություն է, պարզություն և վստահություն'),
('Научись быть один, чтобы быть сильным в обществе', 'Learn to be alone to be strong in company', 'Սովորիր մենակ լինել, որպեսզի ուժեղ լինես հասարակության մեջ'),
('Будь непоколебим в своих принципах', 'Be unwavering in your principles', 'Անսասան եղիր քո սկզբունքներում'),
('Относись к деньгам как к ресурсу, а не как к цели', 'Treat money as a resource, not a goal', 'Վերաբերվիր փողին որպես ռեսուրսի, ոչ թե նպատակի'),
('Твоя репутация — твоя тень. Береги её', 'Your reputation is your shadow. Protect it', 'Քո հեղինակությունը քո ստվերն է: Պաշտպանիր այն'),
('Настоящая сила — в умении управлять собой', 'True strength is in self-control', 'Իսկական ուժը ինքնակառավարման մեջ է'),
('Не позволяй слабым привычкам управлять собой', 'Don’t let weak habits rule you', 'Թույլ մի տուր, որ թույլ սովորությունները կառավարեն քեզ'),
('Учись у всех — гордость ослепляет', 'Learn from everyone — pride blinds', 'Սովորիր բոլորից, հպարտությունը կուրացնում է'),
('Женщины любят мужчин, которые уважают себя', 'Women love men who respect themselves', 'Կանայք սիրում են տղամարդկանց, ովքեր հարգում են իրենց'),
('Не бойся выглядеть глупо — бойся не попробовать', 'Don’t fear looking foolish — fear not trying', 'Մի վախեցիր հիմար երևալուց, վախեցիր չփորձելուց'),
('Сдержанность — это корень уважения', 'Restraint is the root of respect', 'Զսպվածությունը հարգանքի արմատն է'),
('Уважай личные границы — свои и чужие', 'Respect boundaries — yours and others’', 'Հարգիր անձնական սահմանները՝ քո և ուրիշների'),
('Настоящая свобода — это ответственность', 'True freedom is responsibility', 'Իսկական ազատությունը պատասխանատվությունն է'),
('Успех — это побочный эффект верного пути', 'Success is a byproduct of the right path', 'Հաջողությունը ճիշտ ճանապարհի կողմնակի արդյունք է'),
('Уважай своё время — и чужое', 'Respect your time — and others’', 'Հարգիր քո ժամանակը և ուրիշներինը'),
('Боль временна, позор — навсегда', 'Pain is temporary, shame is forever', 'Ցավը ժամանակավոր է, ամոթը՝ հավերժ'),
('Цени молчаливую уверенность выше громких слов', 'Value quiet confidence over loud words', 'Գնահատիր լուռ վստահությունը բարձր խոսքերից ավելի'),
('Будь примером, а не проповедником', 'Be an example, not a preacher', 'Օրինակ եղիր, ոչ թե քարոզիչ'),
('Действуй, даже если страшно', 'Act, even if you’re afraid', 'Գործիր, նույնիսկ եթե վախենում ես'),
('Помни: мальчики требуют, мужчины создают', 'Boys demand, men create', 'Հիշիր՝ տղաները պահանջում են, տղամարդիկ ստեղծում են'),
('Не ищи лёгких путей — ищи правильные', 'Don’t seek easy paths — seek the right ones', 'Մի փնտրիր հեշտ ճանապարհներ, փնտրիր ճիշտ ճանապարհներ'),
('Всегда ищи новые знания — мир огромен, и возможности для роста бесконечны', 'Always seek new knowledge — the world is vast, and growth is endless', 'Միշտ փնտրիր նոր գիտելիքներ, աշխարհը հսկայական է, և աճի հնարավորությունները անվերջ են'),
('Изучай историю — в ней уроки прошлого, которые помогут тебе не повторять ошибки', 'Study history — it holds lessons to avoid past mistakes', 'Ուսումնասիրիր պատմությունը, այն պարունակում է անցյալի դասեր, որոնք կօգնեն խուսափել սխալներից'),
('Развивай своё ремесло — будь мастером своего дела, стремись к совершенству в том, что ты делаешь', 'Hone your craft — be a master of your work, aim for perfection', 'Զարգացրու քո արհեստը, եղիր քո գործի վարպետ, ձգտիր կատարելության'),
('Не бойся одиночества — иногда это лучшее время для самопознания и роста', 'Don’t fear solitude — it’s often the best time for self-discovery and growth', 'Մի վախեցիր մենակությունից, երբեմն դա լավագույն ժամանակն է ինքնաճանաչման և աճի համար'),
('Будь честен с собой — признавай свои слабости, чтобы работать над ними', 'Be honest with yourself — acknowledge weaknesses to work on them', 'Ազնիվ եղիր ինքդ քո հետ, ընդունիր թուլություններդ, որպեսզի աշխատես դրանց վրա'),
('Отдавай должное другим — признавай их заслуги и достижения', 'Give credit to others — recognize their merits and achievements', 'Հարգանք տուր ուրիշներին, ընդունիր նրանց վաստակն ու ձեռքբերումները'),
('Не сравнивай себя с другими — твой путь уникален, иди по нему с достоинством', 'Don’t compare yourself to others — your path is unique, walk it with dignity', 'Մի համեմատիր քեզ ուրիշների հետ, քո ճանապարհը եզակի է, քայլիր այն արժանապատվությամբ'),
('Помогай слабым — истинная сила проявляется в защите тех, кто не может постоять за себя', 'Help the weak — true strength shows in protecting those who can’t defend themselves', 'Օգնիր թույլերին, իսկական ուժը դրսևորվում է նրանց պաշտպանելու մեջ, ովքեր չեն կարող ինքնապաշտպանվել'),
('Будь надёжен — твоё слово должно быть твёрже камня', 'Be reliable — your word must be stronger than stone', 'Հուսալի եղիր, քո խոսքը պետք է քարից ամուր լինի'),
('Цени своих учителей — они делятся мудростью, которая может осветить твой путь', 'Value your teachers — they share wisdom that lights your path', 'Գնահատիր քո ուսուցիչներին, նրանք կիսում են իմաստություն, որն օգնում է լուսավորել քո ճանապարհը'),
('Будь благодарен — цени то, что у тебя есть, и тех, кто рядом', 'Be grateful — appreciate what you have and those around you', 'Երախտապարտ եղիր, գնահատիր այն, ինչ ունես, և նրանց, ովքեր կողքիդ են'),
('Развивай дисциплину — она ключ к достижению любых целей', 'Build discipline — it’s the key to achieving any goal', 'Զարգացրու կարգապահություն, այն ցանկացած նպատակի հասնելու բանալին է'),
('Учись принимать критику — она может быть болезненной, но часто ведёт к улучшению', 'Learn to accept criticism — it may hurt but often leads to improvement', 'Սովորիր ընդունել քննադատությունը, այն կարող է ցավոտ լինել, բայց հաճախ բերում է կատարելագործման'),
('Не бойся ошибок — они не поражения, а ступени к успеху', 'Don’t fear mistakes — they’re not failures but steps to success', 'Մի վախեցիր սխալներից, դրանք պարտություններ չեն, այլ հաջողության աստիճաններ'),
('Помни о своих корнях — знай, откуда ты родом, и чьё наследие несёшь', 'Remember your roots — know where you come from and whose legacy you carry', 'Հիշիր քո արմատները, իմացիր, թե որտեղից ես գալիս և ում ժառանգությունն ես կրում'),
('Будь готов к переменам — мир не стоит на месте, и тебе тоже нужно двигаться вперёд', 'Be ready for change — the world moves, and so must you', 'Պատրաստ եղիր փոփոխությունների, աշխարհը կանգ չի առնում, և դու նույնպես պետք է առաջ գնաս'),
('Живи настоящим моментом — прошлое ушло, будущее ещё не наступило', 'Live in the present — the past is gone, the future isn’t here', 'Ապրիր ներկա պահով, անցյալն անցել է, ապագան դեռ չի եկել'),
('Доверяй своей интуиции — иногда внутренний голос знает лучше', 'Trust your intuition — sometimes your inner voice knows best', 'Վստահիր քո ինտուիցիային, երբեմն ներքին ձայնն ավելի լավ է իմանում'),
('Учись прощать — обиды лишь отягощают душу, освободись от них', 'Learn to forgive — grudges weigh down the soul, let them go', 'Սովորիր ներել, վիրավորանքները ծանրացնում են հոգին, ազատվիր դրանցից'),
('Не сдавайся перед трудностями — именно они показывают твою истинную силу и стойкость', 'Don’t give up in the face of hardship — it reveals your true strength and resilience', 'Մի հանձնվիր դժվարությունների առաջ, դրանք ցույց են տալիս քո իսկական ուժն ու տոկունությունը'),
('Будь терпелив — великие дела не делаются в спешке', 'Be patient — great things aren’t done in haste', 'Համբերատար եղիր, մեծ գործերը չեն արվում շտապողությամբ'),
('Заботься о своём разуме — постоянно развивай его, читая, размышляя и учась', 'Care for your mind — keep developing it through reading, thinking, and learning', 'Հոգ տար քո մտքի մասին, անընդհատ զարգացրու այն՝ կարդալով, մտածելով և սովորելով'),
('Найди своё призвание — делай то, что наполняет тебя смыслом и энергией', 'Find your calling — do what fills you with meaning and energy', 'Գտիր քո կոչումը, արա այն, ինչը քեզ լցնում է իմաստով և էներգիայով'),
('Не ищи лёгких путей — истинная ценность в том, что достигается с трудом', 'Don’t seek easy paths — true value lies in what’s earned through effort', 'Մի փնտրիր հեշտ ճանապարհներ, իսկական արժեքը ջանքերով ձեռք բերվածի մեջ է'),
('Учись слушать тишину — иногда в ней скрыты самые важные ответы', 'Learn to listen to silence — it often holds the most important answers', 'Սովորիր լսել լռությունը, երբեմն դրա մեջ են թաքնված ամենակարևոր պատասխանները'),
('Будь стоек в своих убеждениях — если они основаны на правде', 'Stand firm in your convictions — if they’re rooted in truth', 'Անսասան եղիր քո համոզմունքներում, եթե դրանք հիմնված են ճշմարտության վրա'),
('Не забывай о своих обещаниях — особенно данных себе', 'Don’t forget your promises — especially those to yourself', 'Մի մոռացիր քո խոստումները, հատկապես քեզ տվածները'),
('Развивай свою внутреннюю силу — она поможет тебе выстоять в любой буре', 'Build inner strength — it will carry you through any storm', 'Զարգացրու քո ներքին ուժը, այն կօգնի քեզ դիմակայել ցանկացած փոթորիկ'),
('Вставай каждый раз, когда падаешь — и делай это с большей решимостью', 'Rise each time you fall — with greater resolve', 'Վեր կաց ամեն անգամ, երբ ընկնում ես, և արա դա ավելի մեծ վճռականությամբ'),
('Будь внимателен к мелочам — часто в них кроется разница между успехом и неудачей', 'Pay attention to details — they often make the difference between success and failure', 'Ուշադիր եղիր մանրուքների նկատմամբ, հաճախ դրանք են տարբերություն ստեղծում հաջողության և ձախողման միջև'),
('Учись быть лидером — не только для других, но и для себя самого', 'Learn to be a leader — not just for others, but for yourself', 'Սովորիր առաջնորդ լինել՝ ոչ միայն ուրիշների, այլև ինքդ քո համար'),
('Не теряй веры в добро — даже когда мир кажется мрачным', 'Don’t lose faith in goodness — even when the world seems dark', 'Մի կորցրու հավատը բարության հանդեպ, նույնիսկ երբ աշխարհը մութ է թվում'),
('Будь открыт новым идеям — они могут прийти откуда угодно', 'Be open to new ideas — they can come from anywhere', 'Բաց եղիր նոր գաղափարների համար, դրանք կարող են գալ ցանկացած տեղից'),
('Помни о своей смертности — это придаёт ценность каждому дню', 'Remember your mortality — it gives value to each day', 'Հիշիր քո մահկանացու լինելը, դա արժեք է հաղորդում յուրաքանչյուր օրվա'),
('Ищи красоту во всём — даже в самых обыденных вещах', 'Find beauty in everything — even the mundane', 'Գտիր գեղեցկությունը ամեն ինչում, նույնիսկ ամենօրյա բաներում'),
('Учись отдыхать — чтобы твои силы восстанавливались', 'Learn to rest — to restore your strength', 'Սովորիր հանգստանալ, որպեսզի քո ուժերը վերականգնվեն'),
('Будь умерен во всём — как в радостях, так и в лишениях', 'Be moderate in all things — in joy and in hardship', 'Չափավոր եղիր ամեն ինչում՝ ուրախությունների և զրկանքների մեջ'),
('Не бойся быть уязвимым — это признак силы, а не слабости', 'Don’t fear vulnerability — it’s a sign of strength, not weakness', 'Մի վախեցիր խոցելի լինելուց, դա ուժի նշան է, ոչ թե թուլության'),
('Учись управлять своим временем — оно бесценно', 'Manage your time — it’s priceless', 'Սովորիր կառավարել քո ժամանակը, այն անգին է'),
('Держи своё слово — твоя репутация зависит от этого', 'Keep your word — your reputation depends on it', 'Պահիր խոսքդ, քո հեղինակությունը կախված է դրանից'),
('Учись быть наблюдательным — замечай детали, которые другие упускают', 'Be observant — notice details others miss', 'Սովորիր դիտող լինել, նկատիր մանրուքներ, որոնք ուրիշները բաց են թողնում'),
('Не позволяй страху сковывать тебя — действуй, несмотря на него', 'Don’t let fear paralyze you — act despite it', 'Թույլ մի տուր, որ վախը կաշկանդի քեզ, գործիր՝ չնայած դրան'),
('Будь гибким — иногда нужно изменить план, чтобы достичь цели', 'Be flexible — sometimes plans must change to reach the goal', 'Ճկուն եղիր, երբեմն պետք է փոխել պլանը՝ նպատակին հասնելու համար'),
('Помогай другим найти свой путь — делиться мудростью — это благородно', 'Help others find their path — sharing wisdom is noble', 'Օգնիր ուրիշներին գտնել իրենց ճանապարհը, իմաստություն կիսելը ազնիվ է'),
('Развивай эмпатию — понимание других делает тебя сильнее', 'Develop empathy — understanding others makes you stronger', 'Զարգացրու կարեկցանք, ուրիշներին հասկանալը քեզ ավելի ուժեղ է դարձնում'),
('Ищи смысл во всём, что делаешь — это придаёт цель', 'Find meaning in all you do — it gives purpose', 'Իմաստ փնտրիր այն ամենում, ինչ անում ես, դա նպատակ է տալիս'),
('Не бойся говорить "нет" — когда это необходимо для твоей целостности', 'Don’t fear saying “no” — when it’s needed for your integrity', 'Մի վախեցիր ասել «ոչ», երբ դա անհրաժեշտ է քո ամբողջականության համար'),
('Постоянно совершенствуйся — каждый день иди к лучшей версии себя', 'Constantly improve — strive to be better than yesterday', 'Անընդհատ կատարելագործվիր, ամեն օր ձգտիր դառնալ քո լավագույն տարբերակը'),
('Помни, что истинная сила — во внутренней гармонии', 'Remember true strength lies in inner harmony', 'Հիշիր, որ իսկական ուժը ներքին ներդաշնակության մեջ է'),
('Будь примером — твои действия говорят громче, чем слова', 'Be an example — your actions speak louder than words', 'Օրինակ եղիր, քո գործողությունները ավելի բարձր են խոսում, քան խոսքերը');

###

INSERT INTO image_fragments (subject, action, setting) VALUES
('A fearless warrior', 'stands on a battlefield at sunset, sword in hand', 'facing the horizon with unwavering resolve'),
('A charismatic leader', 'addresses a roaring crowd from a high balcony', 'city lights sparkling below under a starry sky'),
('A lone knight', 'kneels in a misty forest, armor gleaming under moonlight', 'holding a glowing sword'),
('A defiant hero', 'stands on a crumbling fortress wall, flag in hand', 'as storm clouds gather overhead'),
('A weary traveler', 'reaches the peak of a mountain at dawn', 'gazing at a golden valley below, filled with hope'),
('A brave captain', 'stands at the helm of a ship', 'facing a raging sea storm, with lightning illuminating the waves'),
('A lone archer', 'stands on a hill, bow drawn', 'silhouetted against a fiery sunset, ready to defend their land'),
('A powerful sorceress', 'raises her staff on a glowing rune-covered platform', 'with a cosmic vortex swirling above'),
('A battle-scarred general', 'rallies their troops in a rain-soaked valley', 'holding a banner high under a turbulent sky'),
('A young hero', 'stands at the edge of a glowing portal, sword raised', 'ready to step into an unknown world'),
('A victorious general', 'raises a gleaming sword before a cheering army', 'a vast plain stretching to the distant mountains'),
('A charismatic orator', 'delivers an impassioned speech to a captivated throng', 'a grand amphitheater under a setting sun'),
('An ancient king', 'leads a mighty host into a decisive battle', 'a desolate valley echoing with war cries'),
('An ancient sorcerer', 'casts a powerful spell in a hidden chamber', 'ancient runes glowing on the walls'),
('A clever rogue', 'silently infiltrates a heavily guarded fortress', 'shadows stretching long in the moonlit courtyard'),
('A mystical healer', 'tends to a wounded beast in a sun-dappled grove', 'fragrant herbs laid out on mossy stones'),
('A seasoned explorer', 'discovers a lost artifact in a forgotten tomb', 'dust motes dancing in the single shaft of light'),
('A young inventor', 'launches a fantastical contraption into the sky', 'a bustling cityscape far below');

###

INSERT INTO image_styles (style_name) VALUES
('dark'),
('digital-art'),
('fantasy'),
('photo'),
('painting'),
('cyberpunk'),
('surreal'),
('art-nouveau');