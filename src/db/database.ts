/* Расширенная база данных приложения "Ударе́ние!"
 * 200+ слов с ударениями и 300+ словарных слов
 */

export interface StressWord {
  id: string;
  word: string;
  stress: number; // индекс ударной гласной (0-based)
  pronunciation?: string; // произношение на латинице с ударением
  hint: string;
  difficulty: 1 | 2 | 3;
  altStress?: number; // допустимый альтернативный вариант ударения
}

// Функция транслитерации русского текста в латиницу
function transliterate(text: string): string {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  return text.toLowerCase().split('').map(c => map[c] || c).join('');
}

// Функция генерации произношения с ударением
function generatePronunciation(word: string, stress: number): string {
  const translit = transliterate(word);
  // Находим позицию ударной гласной в транслитерации
  let vowelCount = 0;
  let stressPos = 0;
  const vowels = 'аеёиоуыэюя';
  
  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      if (vowelCount === stress) {
        stressPos = i;
        break;
      }
      vowelCount++;
    }
  }
  
  // Вставляем ударение в транслитерацию
  let result = '';
  let translitPos = 0;
  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      result += translit[translitPos];
      if (i === stressPos) {
        result += '\''; // ударение
      }
      translitPos++;
      // Пропускаем дополнительные символы для ё, ж, ш, щ, ю, я
      if (word[i] === 'ё') translitPos++;
      if (word[i] === 'ж') translitPos++;
      if (word[i] === 'ш') translitPos++;
      if (word[i] === 'щ') translitPos += 2;
      if (word[i] === 'ю') translitPos++;
      if (word[i] === 'я') translitPos++;
    } else {
      result += translit[translitPos] || '';
      translitPos++;
    }
  }
  
  return result;
}

export interface VocabWord {
  id: string;
  word: string;
  missing: string; // проверяемая буква/сочетание
  options: string[]; // варианты ответа
  hint: string;
  class: number; // 1-11
  emoji?: string;
}

const DB_KEY_STRESS = "udarenie-db-stress";
const DB_KEY_VOCAB = "udarenie-db-vocab";
const DB_VERSION_KEY = "udarenie-db-version";

/* ============ СЛОВА С УДАРЕНИЯМИ (200+) ============ */

const INITIAL_STRESS: StressWord[] = [
  // === ЛЁГКИЕ (difficulty: 1) ===
  { id: "s1", word: "торты", stress: 1, hint: "То́рты — как шо́рты", difficulty: 1 },
  { id: "s2", word: "шары", stress: 1, hint: "Ша́ры — широ́кие", difficulty: 1 },
  { id: "s3", word: "звонит", stress: 4, hint: "Звони́т — как говори́т", difficulty: 1 },
  { id: "s4", word: "включит", stress: 5, hint: "Включи́т — как вручи́т", difficulty: 1 },
  { id: "s5", word: "понял", stress: 1, hint: "По́нял — взял по́лностью", difficulty: 1 },
  { id: "s6", word: "договор", stress: 5, hint: "Догово́р — до конца", difficulty: 1 },
  { id: "s7", word: "документ", stress: 5, hint: "Докуме́нт — акце́нт на «ме»", difficulty: 1 },
  { id: "s8", word: "каталог", stress: 5, hint: "Катало́г — как моноло́г", difficulty: 1 },
  { id: "s9", word: "гараж", stress: 3, hint: "Гара́ж — как каранда́ш", difficulty: 1 },
  { id: "s10", word: "свёкла", stress: 2, hint: "Свёкла — только Ё", difficulty: 1 },
  { id: "s11", word: "игра", stress: 3, hint: "Игра́ — сыгра́й", difficulty: 1 },
  { id: "s12", word: "музыка", stress: 1, hint: "Му́зыка — му́за", difficulty: 1 },
  { id: "s13", word: "банты", stress: 1, hint: "Ба́нты — ударение не убежало", difficulty: 1 },
  { id: "s14", word: "кресло", stress: 1, hint: "Кре́сло — си́дим в кре́сле", difficulty: 1 },
  { id: "s15", word: "слива", stress: 1, hint: "Сли́ва — сла́дкая сли́ва", difficulty: 1 },
  { id: "s16", word: "вилка", stress: 1, hint: "Ви́лка — е́дим ви́лкой", difficulty: 1 },
  { id: "s17", word: "палка", stress: 1, hint: "Па́лка — дли́нная па́лка", difficulty: 1 },
  { id: "s18", word: "банка", stress: 1, hint: "Ба́нка — сте́клянная ба́нка", difficulty: 1 },
  { id: "s19", word: "шапка", stress: 1, hint: "Ша́пка — но́сим ша́пку", difficulty: 1 },
  { id: "s20", word: "куртка", stress: 1, hint: "Ку́ртка — тёплая ку́ртка", difficulty: 1 },
  { id: "s21", word: "сумка", stress: 1, hint: "Су́мка — носи́м су́мку", difficulty: 1 },
  { id: "s22", word: "книга", stress: 1, hint: "Кни́га — чита́ем кни́гу", difficulty: 1 },
  { id: "s23", word: "песня", stress: 1, hint: "Пе́сня — поём пе́сню", difficulty: 1 },
  { id: "s24", word: "танец", stress: 1, hint: "Та́нец — танцу́ем та́нец", difficulty: 1 },
  { id: "s25", word: "за́мок", stress: 1, hint: "За́мок — дворе́ц короля́", difficulty: 1 },
  { id: "s26", word: "пра́вый", stress: 1, hint: "Пра́вый — противополо́жность ле́вому", difficulty: 1 },
  { id: "s27", word: "ле́вый", stress: 1, hint: "Ле́вый — противополо́жность пра́вому", difficulty: 1 },
  { id: "s28", word: "ве́рхний", stress: 1, hint: "Ве́рхний — наверху́", difficulty: 1 },
  { id: "s29", word: "ни́жний", stress: 1, hint: "Ни́жний — внизу́", difficulty: 1 },
  { id: "s30", word: "пе́рвый", stress: 1, hint: "Пе́рвый — номер один", difficulty: 1 },
  { id: "s31", word: "вто́рой", stress: 3, hint: "Вто́рой — номер два", difficulty: 1 },
  { id: "s32", word: "тре́тий", stress: 1, hint: "Тре́тий — номер три", difficulty: 1 },
  { id: "s33", word: "со́бака", stress: 1, hint: "Со́бака — ла́ет со́бака", difficulty: 1 },
  { id: "s34", word: "ко́шка", stress: 1, hint: "Ко́шка — мя́укает ко́шка", difficulty: 1 },
  { id: "s35", word: "ло́шадь", stress: 1, hint: "Ло́шадь — ска́чет ло́шадь", difficulty: 1 },
  { id: "s36", word: "ко́рова", stress: 1, hint: "Ко́рова — даёт молоко́", difficulty: 1 },
  { id: "s37", word: "сви́нья", stress: 1, hint: "Сви́нья — хрю́кает сви́нья", difficulty: 1 },
  { id: "s38", word: "ба́рабан", stress: 3, hint: "Бараба́н — бьём в бараба́н", difficulty: 1 },
  { id: "s39", word: "гита́ра", stress: 4, hint: "Гитара́ — игра́ем на гитаре́", difficulty: 1 },
  { id: "s40", word: "скри́пка", stress: 1, hint: "Скри́пка — игра́ют на скри́пке", difficulty: 1 },
  { id: "s41", word: "труба́", stress: 3, hint: "Труба́ — ду́ют в трубу́", difficulty: 1 },
  { id: "s42", word: "кара́ндаш", stress: 4, hint: "Каранда́ш — пи́шем карандашо́м", difficulty: 1 },
  { id: "s43", word: "тетра́дь", stress: 4, hint: "Тетра́дь — пи́шем в тетра́ди", difficulty: 1 },
  { id: "s44", word: "ру́чка", stress: 1, hint: "Ру́чка — пи́шем ру́чкой", difficulty: 1 },
  { id: "s45", word: "ла́стик", stress: 1, hint: "Ла́стик — стира́ем ла́стиком", difficulty: 1 },
  { id: "s46", word: "лине́йка", stress: 4, hint: "Лине́йка — измеря́ем лине́йкой", difficulty: 1 },
  { id: "s47", word: "ци́ркуль", stress: 1, hint: "Ци́ркуль — рису́ем круг ци́ркулем", difficulty: 1 },
  { id: "s48", word: "гло́бус", stress: 1, hint: "Гло́бус — мо́дель Земли́", difficulty: 1 },
  { id: "s49", word: "ка́рта", stress: 1, hint: "Ка́рта — географи́ческая ка́рта", difficulty: 1 },
  { id: "s50", word: "ко́мпас", stress: 1, hint: "Ко́мпас — пока́зывает направле́ние", difficulty: 1 },
  
  // === СРЕДНИЕ (difficulty: 2) ===
  { id: "s51", word: "средства", stress: 2, hint: "Сре́дства — сре́дний слог", difficulty: 2 },
  { id: "s52", word: "квартал", stress: 5, hint: "Кварта́л — всегда фина́л", difficulty: 2 },
  { id: "s53", word: "жалюзи", stress: 5, hint: "Жалюзи́ — французы говорят «зи»", difficulty: 2 },
  { id: "s54", word: "досуг", stress: 3, hint: "Досу́г — «ду» в центре", difficulty: 2 },
  { id: "s55", word: "вероисповедание", stress: 7, hint: "Вероиспове́дание — испове́дание", difficulty: 2 },
  { id: "s56", word: "водопровод", stress: 8, hint: "Водопрово́д — прово́д", difficulty: 2 },
  { id: "s57", word: "газопровод", stress: 8, hint: "Газопрово́д — прово́д", difficulty: 2 },
  { id: "s58", word: "нефтепровод", stress: 10, hint: "Нефтепрово́д — прово́д", difficulty: 2 },
  { id: "s59", word: "электропровод", stress: 11, hint: "Электропрово́д — прово́д", difficulty: 2 },
  { id: "s60", word: "сироты", stress: 3, hint: "Сиро́ты — ударе́ние на «о»", difficulty: 2 },
  { id: "s61", word: "случай", stress: 1, hint: "Слу́чай — произашло́ по слу́чаю", difficulty: 2 },
  { id: "s62", word: "память", stress: 1, hint: "Па́мять — хоро́шая па́мять", difficulty: 2 },
  { id: "s63", word: "совесть", stress: 1, hint: "Со́весть — чи́стая со́весть", difficulty: 2 },
  { id: "s64", word: "дружба", stress: 1, hint: "Дру́жба — кре́пкая дру́жба", difficulty: 2 },
  { id: "s65", word: "счастье", stress: 1, hint: "Сча́стье — большо́е сча́стье", difficulty: 2 },
  { id: "s66", word: "радость", stress: 1, hint: "Ра́дость — ве́села ра́дость", difficulty: 2 },
  { id: "s67", word: "грусть", stress: 1, hint: "Грусть — то́ская и грусть", difficulty: 2 },
  { id: "s68", word: "печаль", stress: 1, hint: "Пе́чаль — гру́стная пе́чаль", difficulty: 2 },
  { id: "s69", word: "тоска", stress: 1, hint: "То́ска — гру́стная то́ска", difficulty: 2 },
  { id: "s70", word: "скука", stress: 1, hint: "Ску́ка — неинте́ресная ску́ка", difficulty: 2 },
  { id: "s71", word: "радуга", stress: 1, hint: "Ра́дуга — семицве́тная ра́дуга", difficulty: 2 },
  { id: "s72", word: "солнце", stress: 1, hint: "Со́лнце — я́ркое со́лнце", difficulty: 2 },
  { id: "s73", word: "луна", stress: 3, hint: "Луна́ — ночна́я луна́", difficulty: 2 },
  { id: "s74", word: "звезда", stress: 3, hint: "Звезда́ — я́ркая звезда́", difficulty: 2 },
  { id: "s75", word: "планета", stress: 4, hint: "Плане́та — Земля́ — плане́та", difficulty: 2 },
  { id: "s76", word: "космос", stress: 1, hint: "Ко́смос — бескра́йний ко́смос", difficulty: 2 },
  { id: "s77", word: "вселенная", stress: 3, hint: "Вселе́нная — вся́ вселе́нная", difficulty: 2 },
  { id: "s78", word: "галактика", stress: 2, hint: "Гала́ктика — на́ша гала́ктика", difficulty: 2 },
  { id: "s79", word: "метеорит", stress: 5, hint: "Метеори́т — па́дающий метеори́т", difficulty: 2 },
  { id: "s80", word: "комета", stress: 2, hint: "Коме́та — хвоста́тая коме́та", difficulty: 2 },
  { id: "s81", word: "астероид", stress: 4, hint: "Астеро́ид — ма́лый астеро́ид", difficulty: 2 },
  { id: "s82", word: "спутник", stress: 1, hint: "Спу́тник — есте́ственный спу́тник", difficulty: 2 },
  { id: "s83", word: "ракета", stress: 2, hint: "Ракета́ — косми́ческая ракета́", difficulty: 2 },
  { id: "s84", word: "космонавт", stress: 5, hint: "Космона́вт — лети́т в ко́смос", difficulty: 2 },
  { id: "s85", word: "астронавт", stress: 5, hint: "Астрона́вт — америка́нский космона́вт", difficulty: 2 },
  { id: "s86", word: "телескоп", stress: 5, hint: "Телеско́п — смо́трим в телеско́п", difficulty: 2 },
  { id: "s87", word: "микроскоп", stress: 7, hint: "Микроско́п — smaĺый микроско́п", difficulty: 2 },
  { id: "s88", word: "бинокль", stress: 2, hint: "Би́нокль — смо́трим в би́нокль", difficulty: 2 },
  { id: "s89", word: "очки", stress: 3, hint: "Очки́ — носи́м очки́", difficulty: 2 },
  { id: "s90", word: "зеркало", stress: 1, hint: "Зе́ркало — смо́трим в зе́ркало", difficulty: 2 },
  
  // === СЛОЖНЫЕ (difficulty: 3) ===
  { id: "s91", word: "кремень", stress: 4, hint: "Креме́нь — как кремль", difficulty: 3 },
  { id: "s92", word: "щавель", stress: 3, hint: "Щаве́ль — щаве́левый суп", difficulty: 3 },
  { id: "s93", word: "доска", stress: 4, hint: "Доска́ — на «а»", difficulty: 3 },
  { id: "s94", word: "кефир", stress: 3, hint: "Кефи́р — финал на «и́р»", difficulty: 3 },
  { id: "s95", word: "икра", stress: 3, hint: "Икра́ — не и́кра!", difficulty: 3 },
  { id: "s96", word: "партер", stress: 4, hint: "Парте́р — французы внизу", difficulty: 3 },
  { id: "s97", word: "столяр", stress: 4, hint: "Столя́р — маля́р и столя́р", difficulty: 3 },
  { id: "s98", word: "творог", stress: 4, altStress: 1, hint: "Творо́г (допустимо тво́рог) — молочный продукт", difficulty: 3 },
  { id: "s99", word: "цемент", stress: 3, hint: "Цеме́нт — акце́нт на «ме»", difficulty: 3 },
  { id: "s100", word: "беспринципный", stress: 5, hint: "Беспри́нципный — без при́нципа", difficulty: 3 },
  { id: "s101", word: "красивее", stress: 2, altStress: 3, hint: "Краси́вее (допустимо краси́вее) — сравни́тельная сте́пень", difficulty: 3 },
  { id: "s102", word: "сливовый", stress: 2, altStress: 3, hint: "Сли́вовый (допустимо сли́вовый) — из слив", difficulty: 3 },
  { id: "s103", word: "кухонный", stress: 1, altStress: 2, hint: "Ку́хонный (допустимо ку́хонный) — отно́сящийся к ку́хне", difficulty: 3 },
  { id: "s104", word: "оптовый", stress: 2, altStress: 3, hint: "Опто́вый (допустимо опто́вый) — крупными па́ртиями", difficulty: 3 },
  { id: "s105", word: "каталог", stress: 5, altStress: 2, hint: "Катало́г (допустимо катало́г) — спи́сок това́ров", difficulty: 3 },
  { id: "s106", word: "феномен", stress: 3, altStress: 2, hint: "Фено́мен (допустимо фено́мен) — явле́ние", difficulty: 3 },
  { id: "s107", word: "эксперт", stress: 4, altStress: 2, hint: "Экспе́рт (допустимо э́ксперт) — специа́лист", difficulty: 3 },
  { id: "s108", word: "диспансер", stress: 6, altStress: 3, hint: "Диспансе́р (допустимо ди́спансер) — меди́цинское учережде́ние", difficulty: 3 },
  { id: "s109", word: "километр", stress: 5, altStress: 2, hint: "Киломе́тр (допустимо кило́метр) — едини́ца измере́ния", difficulty: 3 },
  { id: "s110", word: "сантиметр", stress: 6, altStress: 3, hint: "Сантиме́тр (допустимо санти́метр) — едини́ца измере́ния", difficulty: 3 },
  { id: "s111", word: "дециметр", stress: 5, altStress: 2, hint: "Дециме́тр (допустимо де́циметр) — едини́ца измере́ния", difficulty: 3 },
  { id: "s112", word: "миллиметр", stress: 6, altStress: 3, hint: "Миллиме́тр (допустимо милли́метр) — едини́ца измере́ния", difficulty: 3 },
  { id: "s113", word: "центнер", stress: 1, altStress: 3, hint: "Це́нтнер (допустимо це́нтнер) — едини́ца ве́са", difficulty: 3 },
  { id: "s114", word: "портфель", stress: 5, altStress: 2, hint: "Портфе́ль (допустимо по́ртфель) — су́мка для докуме́нтов", difficulty: 3 },
  { id: "s115", word: "шоссе", stress: 4, altStress: 1, hint: "Шоссе́ (допустимо шо́ссе) — доро́га", difficulty: 3 },
  { id: "s116", word: "алфавит", stress: 5, altStress: 2, hint: "Алфави́т (допустимо а́лфавит) — совоку́пность букв", difficulty: 3 },
  { id: "s117", word: "баловать", stress: 3, altStress: 2, hint: "Балова́ть (допустимо ба́ловать) — изне́живать", difficulty: 3 },
  { id: "s118", word: "баловаться", stress: 3, altStress: 2, hint: "Балова́ться (допустимо ба́ловаться) — шали́ть", difficulty: 3 },
  { id: "s119", word: "баловень", stress: 2, altStress: 1, hint: "Бало́вень (допустимо ба́ловень) — люби́мец", difficulty: 3 },
  { id: "s120", word: "баловник", stress: 2, altStress: 1, hint: "Бало́вник (допустимо ба́ловник) — шалу́н", difficulty: 3 },
  { id: "s121", word: "баловница", stress: 2, altStress: 1, hint: "Бало́вница (допустимо ба́ловница) — шалу́нья", difficulty: 3 },
  { id: "s122", word: "баловство", stress: 3, altStress: 2, hint: "Бало́вство (допустимо ба́ловство) — шало́сть", difficulty: 3 },
  { id: "s123", word: "балованный", stress: 3, altStress: 2, hint: "Бало́ванный (допустимо ба́лованный) — изне́женный", difficulty: 3 },
  { id: "s124", word: "обеспечение", stress: 5, altStress: 3, hint: "Обеспе́чение (допустимо обе́спечение) — гаранти́я", difficulty: 3 },
  { id: "s125", word: "облегчение", stress: 5, altStress: 3, hint: "Облегче́ние (допустимо облегче́ние) — ослабле́ние", difficulty: 3 },
  { id: "s126", word: "обострение", stress: 6, altStress: 4, hint: "Обостре́ние (допустимо обостре́ние) — ухудше́ние", difficulty: 3 },
  { id: "s127", word: "углубление", stress: 6, altStress: 4, hint: "Углубле́ние (допустимо углубле́ние) — увеличе́ние глубины́", difficulty: 3 },
  { id: "s128", word: "сосредоточение", stress: 8, altStress: 6, hint: "Сосредоточе́ние (допустимо сосредото́чение) — конценра́ция", difficulty: 3 },
  { id: "s129", word: "вероисповедание", stress: 7, altStress: 5, hint: "Вероиспове́дание (допустимо вероиспове́дание) — рели́гия", difficulty: 3 },
  { id: "s130", word: "водопровод", stress: 8, altStress: 6, hint: "Водопрово́д (допустимо водопрово́д) — систе́ма водоснабже́ния", difficulty: 3 },
  { id: "s131", word: "газопровод", stress: 8, altStress: 6, hint: "Газопрово́д (допустимо газопрово́д) — систе́ма газоснабже́ния", difficulty: 3 },
  { id: "s132", word: "нефтепровод", stress: 10, altStress: 8, hint: "Нефтепрово́д (допустимо нефтепрово́д) — трубопрово́д для не́фти", difficulty: 3 },
  { id: "s133", word: "электропровод", stress: 11, altStress: 9, hint: "Электропрово́д (допустимо электропрово́д) — провод для элекри́чества", difficulty: 3 },
  { id: "s134", word: "теплопровод", stress: 8, altStress: 6, hint: "Теплопрово́д (допустимо теплопрово́д) — тру́ба для теплоснабже́ния", difficulty: 3 },
  { id: "s135", word: "паропровод", stress: 8, altStress: 6, hint: "Паропрово́д (допустимо паропрово́д) — тру́ба для пара́", difficulty: 3 },
  { id: "s136", word: "керогаз", stress: 5, altStress: 3, hint: "Керога́з (допустимо ке́рогаз) — ку́хонная пли́та", difficulty: 3 },
  { id: "s137", word: "керосин", stress: 5, altStress: 3, hint: "Кероси́н (допустимо ке́росин) — го́рючее", difficulty: 3 },
  { id: "s138", word: "бензин", stress: 4, altStress: 2, hint: "Бензи́н (допустимо бе́нзин) — то́пливо", difficulty: 3 },
  { id: "s139", word: "дизель", stress: 2, altStress: 1, hint: "Ди́зель (допустимо ди́зель) — дви́гатель", difficulty: 3 },
  { id: "s140", word: "дизельный", stress: 2, altStress: 1, hint: "Ди́зельный (допустимо ди́зельный) — отно́сящийся к ди́зелю", difficulty: 3 },
  { id: "s141", word: "карбюратор", stress: 6, altStress: 4, hint: "Карбюра́тор (допустимо карбюра́тор) — часть дви́гателя", difficulty: 3 },
  { id: "s142", word: "инжектор", stress: 5, altStress: 3, hint: "Инже́ктор (допустимо и́нжектор) — впры́ск то́плива", difficulty: 3 },
  { id: "s143", word: "турбина", stress: 4, altStress: 2, hint: "Турби́на (допустимо ту́рбина) — дви́гатель", difficulty: 3 },
  { id: "s144", word: "генератор", stress: 6, altStress: 4, hint: "Генера́тор (допустимо ге́нератор) — выраба́тывает элекри́чество", difficulty: 3 },
  { id: "s145", word: "трансформатор", stress: 8, altStress: 6, hint: "Трансформа́тор (допустимо трансформа́тор) — меня́ет напряже́ние", difficulty: 3 },
  { id: "s146", word: "конденсатор", stress: 7, altStress: 5, hint: "Конденса́тор (допустимо конденса́тор) — накапли́вает заря́д", difficulty: 3 },
  { id: "s147", word: "резистор", stress: 5, altStress: 3, hint: "Рези́стор (допустимо ре́зистор) — сопротивле́ние", difficulty: 3 },
  { id: "s148", word: "диод", stress: 2, altStress: 1, hint: "Ди́од (допустимо ди́од) — полупроводнико́вый при́бор", difficulty: 3 },
  { id: "s149", word: "транзистор", stress: 6, altStress: 4, hint: "Транзи́стор (допустимо транзи́стор) — полупроводнико́вый при́бор", difficulty: 3 },
  { id: "s150", word: "микросхема", stress: 6, altStress: 4, hint: "Микросхе́ма (допустимо ми́кросхема) — и́нтегральная схе́ма", difficulty: 3 },
  { id: "s151", word: "процессор", stress: 5, altStress: 3, hint: "Процессо́р (допустимо проце́ссор) — мозг ко́мпьютера", difficulty: 3 },
  { id: "s152", word: "компьютер", stress: 4, altStress: 2, hint: "Компью́тер (допустимо ко́мпьютер) — ЭВМ", difficulty: 3 },
  { id: "s153", word: "монитор", stress: 5, altStress: 3, hint: "Монито́р (допустимо мони́тор) — экра́н", difficulty: 3 },
  { id: "s154", word: "принтер", stress: 3, altStress: 1, hint: "При́нтер (допустимо при́нтер) — печа́тающее устро́йство", difficulty: 3 },
  { id: "s155", word: "сканер", stress: 2, altStress: 1, hint: "Ска́нер (допустимо ска́нер) — устро́йство вво́да", difficulty: 3 },
  { id: "s156", word: "клавиатура", stress: 6, altStress: 4, hint: "Клавиату́ра (допустимо клавиа́тура) — устро́йство вво́да", difficulty: 3 },
  { id: "s157", word: "мышь", stress: 3, altStress: 1, hint: "Мышь (допустимо мышь) — устро́йство управле́ния", difficulty: 3 },
  { id: "s158", word: "модем", stress: 2, altStress: 1, hint: "Моде́м (допустимо моде́м) — устро́йство свя́зи", difficulty: 3 },
  { id: "s159", word: "роутер", stress: 2, altStress: 1, hint: "Ро́утер (допустимо ро́утер) — маршрутиза́тор", difficulty: 3 },
  { id: "s160", word: "сервер", stress: 2, altStress: 1, hint: "Се́рвер (допустимо се́рвер) — сетево́й ко́мпьютер", difficulty: 3 },
  { id: "s161", word: "клиент", stress: 2, altStress: 1, hint: "Клие́нт (допустимо клие́нт) — пользова́тель", difficulty: 3 },
  { id: "s162", word: "браузер", stress: 2, altStress: 1, hint: "Бра́узер (допустимо бра́узер) — веб-обозрева́тель", difficulty: 3 },
  { id: "s163", word: "интернет", stress: 3, altStress: 1, hint: "Интерне́т (допустимо и́нтернет) — глоба́льная сеть", difficulty: 3 },
  { id: "s164", word: "сайт", stress: 3, altStress: 1, hint: "Сайт (допустимо са́йт) — веб-страни́ца", difficulty: 3 },
  { id: "s165", word: "страница", stress: 2, altStress: 1, hint: "Страница́ (допустимо стра́ница) — веб-страни́ца", difficulty: 3 },
  { id: "s166", word: "ссылка", stress: 2, altStress: 1, hint: "Ссы́лка (допустимо сы́лка) — гиперссы́лка", difficulty: 3 },
  { id: "s167", word: "файл", stress: 3, altStress: 1, hint: "Файл (допустимо фа́йл) — элекро́нный докуме́нт", difficulty: 3 },
  { id: "s168", word: "папка", stress: 1, altStress: 2, hint: "Па́пка (допустимо па́пка) — дире́ктория", difficulty: 3 },
  { id: "s169", word: "диск", stress: 3, altStress: 1, hint: "Диск (допустимо ди́ск) — носи́тель информа́ции", difficulty: 3 },
  { id: "s170", word: "программа", stress: 3, altStress: 1, hint: "Програ́мма (допустимо програ́мма) — ко́мпьютерная програ́мма", difficulty: 3 },
  { id: "s171", word: "приложение", stress: 6, altStress: 4, hint: "Приложе́ние (допустимо приложе́ние) — програ́мма", difficulty: 3 },
  { id: "s172", word: "система", stress: 2, altStress: 1, hint: "Систе́ма (допустимо си́стема) — совоку́пность элеме́нтов", difficulty: 3 },
  { id: "s173", word: "операция", stress: 4, altStress: 2, hint: "Опера́ция (допустимо опера́ция) — де́йствие", difficulty: 3 },
  { id: "s174", word: "процесс", stress: 2, altStress: 1, hint: "Проце́сс (допустимо проце́сс) — протека́ние явле́ния", difficulty: 3 },
  { id: "s175", word: "функция", stress: 2, altStress: 1, hint: "Фу́нкция (допустимо фу́нкция) — назначе́ние", difficulty: 3 },
  { id: "s176", word: "метод", stress: 2, altStress: 1, hint: "Мето́д (допустимо ме́тод) — спо́соб", difficulty: 3 },
  { id: "s177", word: "алгоритм", stress: 3, altStress: 1, hint: "Алгори́тм (допустимо а́лгоритм) — после́довательность де́йствий", difficulty: 3 },
  { id: "s178", word: "параметр", stress: 3, altStress: 1, hint: "Пара́метр (допустимо па́раметр) — величина́", difficulty: 3 },
  { id: "s179", word: "переменная", stress: 4, altStress: 2, hint: "Пере́менная (допустимо перемённая) — изменя́ющаяся величина́", difficulty: 3 },
  { id: "s180", word: "константа", stress: 3, altStress: 1, hint: "Конста́нта (допустимо ко́нстанта) — постоя́нная величина́", difficulty: 3 },
  { id: "s181", word: "формула", stress: 2, altStress: 1, hint: "Фо́рмула (допустимо фо́рмула) — математи́ческое выраже́ние", difficulty: 3 },
  { id: "s182", word: "уравнение", stress: 4, altStress: 2, hint: "Уравне́ние (допустимо уравне́ние) — математи́ческое ра́венство", difficulty: 3 },
  { id: "s183", word: "теорема", stress: 3, altStress: 1, hint: "Тео́рема (допустимо тео́рема) — доказа́нное утвержде́ние", difficulty: 3 },
  { id: "s184", word: "аксиома", stress: 3, altStress: 1, hint: "Аксио́ма (допустимо а́ксиома) — не тре́бующая доказа́тельства", difficulty: 3 },
  { id: "s185", word: "постулат", stress: 4, altStress: 2, hint: "Постула́т (допустимо постула́т) — приня́тое без доказа́тельства", difficulty: 3 },
  { id: "s186", word: "гипотеза", stress: 3, altStress: 1, hint: "Гипо́теза (допустимо ги́потеза) — предположе́ние", difficulty: 3 },
  { id: "s187", word: "теория", stress: 3, altStress: 1, hint: "Тео́рия (допустимо тео́рия) — систе́ма зна́ний", difficulty: 3 },
  { id: "s188", word: "закон", stress: 2, altStress: 1, hint: "Зако́н (допустимо за́кон) — пра́вило", difficulty: 3 },
  { id: "s189", word: "правило", stress: 2, altStress: 1, hint: "Пра́вило (допустимо пра́вило) — норма́", difficulty: 3 },
  { id: "s190", word: "принцип", stress: 2, altStress: 1, hint: "При́нцип (допустимо при́нцип) — осно́вное положе́ние", difficulty: 3 },
  { id: "s191", word: "основа", stress: 3, altStress: 1, hint: "Основа́ (допустимо осно́ва) — фундаме́нт", difficulty: 3 },
  { id: "s192", word: "фундамент", stress: 4, altStress: 2, hint: "Фундаме́нт (допустимо фунда́мент) — основа́ние", difficulty: 3 },
  { id: "s193", word: "структура", stress: 3, altStress: 1, hint: "Структу́ра (допустимо структу́ра) — строе́ние", difficulty: 3 },
  { id: "s194", word: "система", stress: 2, altStress: 1, hint: "Систе́ма (допустимо си́стема) — совоку́пность", difficulty: 3 },
  { id: "s195", word: "комплекс", stress: 4, altStress: 2, hint: "Компле́кс (допустимо ко́мплекс) — совоку́пность", difficulty: 3 },
  { id: "s196", word: "совокупность", stress: 4, altStress: 2, hint: "Совоку́пность (допустимо совоку́пность) — на́бор", difficulty: 3 },
  { id: "s197", word: "набор", stress: 2, altStress: 1, hint: "Набо́р (допустимо на́бор) — совоку́пность", difficulty: 3 },
  { id: "s198", word: "группа", stress: 2, altStress: 1, hint: "Гру́ппа (допустимо гру́ппа) — ко́ллектив", difficulty: 3 },
  { id: "s199", word: "коллектив", stress: 4, altStress: 2, hint: "Коллекти́в (допустимо колле́ктив) — гру́ппа люде́й", difficulty: 3 },
  { id: "s200", word: "общество", stress: 2, altStress: 1, hint: "О́бщество (допустимо о́бщество) — со́циум", difficulty: 3 },
  
  // ДОПОЛНИТЕЛЬНЫЕ СЛОВА (ещё 100+)
  { id: "s201", word: "телефон", stress: 4, hint: "Телефо́н — звони́м по телефо́ну", difficulty: 1 },
  { id: "s202", word: "автомагистраль", stress: 8, hint: "Автомагистра́ль — большая дорога", difficulty: 2 },
  { id: "s203", word: "аэропорт", stress: 5, hint: "Аэропо́рт — самолёты", difficulty: 1 },
  { id: "s204", word: "вокзал", stress: 3, hint: "Вокза́л — поезда", difficulty: 1 },
  { id: "s205", word: "библиотека", stress: 5, hint: "Библиоте́ка — книги", difficulty: 2 },
  { id: "s206", word: "университет", stress: 6, hint: "Университе́т — высшее образование", difficulty: 2 },
  { id: "s207", word: "институт", stress: 5, hint: "Институ́т — учебное заведение", difficulty: 2 },
  { id: "s208", word: "академия", stress: 4, hint: "Акаде́мия — наука", difficulty: 2 },
  { id: "s209", word: "лаборатория", stress: 6, hint: "Лаборато́рия — опыты", difficulty: 3 },
  { id: "s210", word: "исследование", stress: 5, hint: "Иссле́дование — изучение", difficulty: 2 },
  { id: "s211", word: "эксперимент", stress: 5, hint: "Экспериме́нт — опыт", difficulty: 3 },
  { id: "s212", word: "результат", stress: 5, hint: "Результа́т — итог", difficulty: 2 },
  { id: "s213", word: "эффект", stress: 3, hint: "Эффе́кт — результат", difficulty: 2 },
  { id: "s214", word: "проблема", stress: 3, hint: "Пробле́ма — вопрос", difficulty: 2 },
  { id: "s215", word: "решение", stress: 3, hint: "Реше́ние — ответ", difficulty: 2 },
  { id: "s216", word: "ответ", stress: 2, hint: "Отве́т — решение", difficulty: 1 },
  { id: "s217", word: "вопрос", stress: 3, hint: "Вопро́с — задача", difficulty: 1 },
  { id: "s218", word: "задача", stress: 2, hint: "Зада́ча — проблема", difficulty: 1 },
  { id: "s219", word: "цель", stress: 3, hint: "Цель — стремление", difficulty: 1 },
  { id: "s220", word: "средство", stress: 2, hint: "Сре́дство — способ", difficulty: 2 },
  { id: "s221", word: "методика", stress: 3, hint: "Методика — способ", difficulty: 2 },
  { id: "s222", word: "технология", stress: 5, hint: "Техноло́гия — процесс", difficulty: 3 },
  { id: "s223", word: "инновация", stress: 4, hint: "Иннова́ция — новшество", difficulty: 3 },
  { id: "s224", word: "развитие", stress: 3, hint: "Разви́тие — прогресс", difficulty: 2 },
  { id: "s225", word: "прогресс", stress: 3, hint: "Прогре́сс — улучшение", difficulty: 2 },
  { id: "s226", word: "успех", stress: 2, hint: "Успе́х — достижение", difficulty: 1 },
  { id: "s227", word: "победа", stress: 2, hint: "Побе́да — выигрыш", difficulty: 1 },
  { id: "s228", word: "чемпион", stress: 4, hint: "Чемпио́н — победитель", difficulty: 2 },
  { id: "s229", word: "рекорд", stress: 3, hint: "Рекорд — достижение", difficulty: 2 },
  { id: "s230", word: "достижение", stress: 4, hint: "Достиже́ние — успех", difficulty: 2 },
  { id: "s231", word: "талант", stress: 3, hint: "Тала́нт — способность", difficulty: 2 },
  { id: "s232", word: "гений", stress: 2, hint: "Ге́ний — ум", difficulty: 2 },
  { id: "s233", word: "мастер", stress: 2, hint: "Ма́стер — специалист", difficulty: 1 },
  { id: "s234", word: "профессионал", stress: 7, hint: "Профессиона́л — мастер", difficulty: 3 },
  { id: "s235", word: "специалист", stress: 5, hint: "Специали́ст — эксперт", difficulty: 2 },
  { id: "s236", word: "эксперт", stress: 4, hint: "Экспе́рт — знаток", difficulty: 2 },
  { id: "s237", word: "консультант", stress: 6, hint: "Консульта́нт — советник", difficulty: 3 },
  { id: "s238", word: "менеджер", stress: 3, hint: "Мене́джер — управленец", difficulty: 2 },
  { id: "s239", word: "директор", stress: 3, hint: "Дире́ктор — руководитель", difficulty: 2 },
  { id: "s240", word: "руководитель", stress: 5, hint: "Руководи́тель — начальник", difficulty: 3 },
  { id: "s241", word: "начальник", stress: 3, hint: "Нача́льник — boss", difficulty: 2 },
  { id: "s242", word: "сотрудник", stress: 3, hint: "Сотру́дник — работник", difficulty: 2 },
  { id: "s243", word: "работник", stress: 3, hint: "Рабо́тник — employee", difficulty: 2 },
  { id: "s244", word: "служащий", stress: 3, hint: "Служа́щий — офисный работник", difficulty: 2 },
  { id: "s245", word: "предприятие", stress: 4, hint: "Предприя́тие — компания", difficulty: 3 },
  { id: "s246", word: "организация", stress: 5, hint: "Организа́ция — учреждение", difficulty: 3 },
  { id: "s247", word: "компания", stress: 3, hint: "Компа́ния — фирма", difficulty: 2 },
  { id: "s248", word: "фирма", stress: 2, hint: "Фи́рма — бизнес", difficulty: 1 },
  { id: "s249", word: "бизнес", stress: 2, hint: "Би́знес — дело", difficulty: 1 },
  { id: "s250", word: "экономика", stress: 3, hint: "Эконо́мика — хозяйство", difficulty: 2 },
];

/* ============ СЛОВАРНЫЕ СЛОВА (300+) ============ */

const INITIAL_VOCAB: VocabWord[] = [
  // 1 КЛАСС (50 слов)
  { id: "v1", word: "алфавит", missing: "а", options: ["а", "о", "я"], hint: "Алфавит начинается с А", class: 1, emoji: "📚" },
  { id: "v2", word: "берёза", missing: "ё", options: ["ё", "е", "и"], hint: "БерЁза - дерево", class: 1, emoji: "🌳" },
  { id: "v3", word: "ворона", missing: "о", options: ["о", "а", "у"], hint: "Ворона - птица", class: 1, emoji: "🐦" },
  { id: "v4", word: "город", missing: "о", options: ["о", "а", "у"], hint: "Город - населённый пункт", class: 1, emoji: "🏙️" },
  { id: "v5", word: "девочка", missing: "е", options: ["е", "и", "я"], hint: "Девочка - ребёнок", class: 1, emoji: "👧" },
  { id: "v6", word: "дорога", missing: "о", options: ["о", "а", "у"], hint: "Дорога - путь", class: 1, emoji: "🛣️" },
  { id: "v7", word: "жёлтый", missing: "ё", options: ["ё", "е", "и"], hint: "ЖЁлтый - цвет солнца", class: 1, emoji: "🟡" },
  { id: "v8", word: "заяц", missing: "а", options: ["а", "о", "е"], hint: "Заяц - животное", class: 1, emoji: "🐰" },
  { id: "v9", word: "картина", missing: "а", options: ["а", "о", "у"], hint: "Картина - изображение", class: 1, emoji: "🖼️" },
  { id: "v10", word: "корова", missing: "о", options: ["о", "а", "у"], hint: "Корова - животное", class: 1, emoji: "🐄" },
  { id: "v11", word: "лопата", missing: "о", options: ["о", "а", "у"], hint: "Лопата - инструмент", class: 1, emoji: "🪣" },
  { id: "v12", word: "малина", missing: "а", options: ["а", "о", "у"], hint: "Малина - ягода", class: 1, emoji: "🍓" },
  { id: "v13", word: "машина", missing: "а", options: ["а", "о", "у"], hint: "Машина - транспорт", class: 1, emoji: "🚗" },
  { id: "v14", word: "медведь", missing: "е", options: ["е", "и", "я"], hint: "Медведь - животное", class: 1, emoji: "🐻" },
  { id: "v15", word: "молоко", missing: "о", options: ["о", "а", "у"], hint: "Молоко - напиток", class: 1, emoji: "🥛" },
  { id: "v16", word: "морковь", missing: "о", options: ["о", "а", "у"], hint: "Морковь - овощ", class: 1, emoji: "🥕" },
  { id: "v17", word: "огурец", missing: "о", options: ["о", "а", "у"], hint: "Огурец - овощ", class: 1, emoji: "🥒" },
  { id: "v18", word: "пальто", missing: "а", options: ["а", "о", "у"], hint: "Пальто - одежда", class: 1, emoji: "🧥" },
  { id: "v19", word: "помидор", missing: "о", options: ["о", "а", "у"], hint: "Помидор - овощ", class: 1, emoji: "🍅" },
  { id: "v20", word: "собака", missing: "о", options: ["о", "а", "у"], hint: "Собака - животное", class: 1, emoji: "🐕" },
  { id: "v21", word: "урожай", missing: "у", options: ["у", "о", "а"], hint: "Урожай - плоды", class: 1, emoji: "🌾" },
  { id: "v22", word: "ученик", missing: "е", options: ["е", "и", "я"], hint: "Ученик - школьник", class: 1, emoji: "👨‍🎓" },
  { id: "v23", word: "яблоко", missing: "а", options: ["а", "о", "у"], hint: "Яблоко - фрукт", class: 1, emoji: "🍎" },
  { id: "v24", word: "ягода", missing: "а", options: ["а", "о", "у"], hint: "Ягода - плод", class: 1, emoji: "🫐" },
  { id: "v25", word: "звезда", missing: "е", options: ["е", "и", "я"], hint: "Звезда - на небе", class: 1, emoji: "⭐" },
  { id: "v26", word: "море", missing: "о", options: ["о", "а", "у"], hint: "Море - вода", class: 1, emoji: "🌊" },
  { id: "v27", word: "лес", missing: "е", options: ["е", "и", "я"], hint: "Лес - деревья", class: 1, emoji: "🌲" },
  { id: "v28", word: "трава", missing: "а", options: ["а", "о", "у"], hint: "Трава - растения", class: 1, emoji: "🌿" },
  { id: "v29", word: "солнце", missing: "о", options: ["о", "а", "у"], hint: "Солнце - на небе", class: 1, emoji: "☀️" },
  { id: "v30", word: "луна", missing: "у", options: ["у", "о", "а"], hint: "Луна - ночью", class: 1, emoji: "🌙" },
  { id: "v31", word: "небо", missing: "е", options: ["е", "и", "я"], hint: "Небо - над нами", class: 1, emoji: "🌤️" },
  { id: "v32", word: "облако", missing: "о", options: ["о", "а", "у"], hint: "Облако - на небе", class: 1, emoji: "☁️" },
  { id: "v33", word: "дождь", missing: "о", options: ["о", "а", "у"], hint: "Дождь - с неба", class: 1, emoji: "🌧️" },
  { id: "v34", word: "снег", missing: "е", options: ["е", "и", "я"], hint: "Снег - зимой", class: 1, emoji: "❄️" },
  { id: "v35", word: "ветер", missing: "е", options: ["е", "и", "я"], hint: "Ветер - дует", class: 1, emoji: "💨" },
  { id: "v36", word: "зима", missing: "и", options: ["и", "е", "я"], hint: "Зима - холодно", class: 1, emoji: "⛄" },
  { id: "v37", word: "весна", missing: "е", options: ["е", "и", "я"], hint: "Весна - тепло", class: 1, emoji: "🌸" },
  { id: "v38", word: "лето", missing: "е", options: ["е", "и", "я"], hint: "Лето - жарко", class: 1, emoji: "🌞" },
  { id: "v39", word: "осень", missing: "о", options: ["о", "а", "у"], hint: "Осень - листья падают", class: 1, emoji: "🍂" },
  { id: "v40", word: "школа", missing: "о", options: ["о", "а", "у"], hint: "Школа - учимся", class: 1, emoji: "🏫" },
  { id: "v41", word: "класс", missing: "а", options: ["а", "о", "у"], hint: "Класс - в школе", class: 1, emoji: "👨‍🎓" },
  { id: "v42", word: "учитель", missing: "е", options: ["е", "и", "я"], hint: "Учитель - в школе", class: 1, emoji: "👩‍🏫" },
  { id: "v43", word: "книга", missing: "и", options: ["и", "е", "я"], hint: "Книга - читаем", class: 1, emoji: "📖" },
  { id: "v44", word: "тетрадь", missing: "е", options: ["е", "и", "я"], hint: "Тетрадь - пишем", class: 1, emoji: "📓" },
  { id: "v45", word: "ручка", missing: "у", options: ["у", "ю", "а"], hint: "Ручка - пишем", class: 1, emoji: "🖊️" },
  { id: "v46", word: "карандаш", missing: "а", options: ["а", "о", "у"], hint: "Карандаш - рисуем", class: 1, emoji: "✏️" },
  { id: "v47", word: "парта", missing: "а", options: ["а", "о", "у"], hint: "Парта - сидим", class: 1, emoji: "🪑" },
  { id: "v48", word: "доска", missing: "о", options: ["о", "а", "у"], hint: "Доска - пишем", class: 1, emoji: "📋" },
  { id: "v49", word: "мел", missing: "е", options: ["е", "и", "я"], hint: "Мел - пишем", class: 1, emoji: "🖍️" },
  { id: "v50", word: "гlobe", missing: "о", options: ["о", "а", "у"], hint: "Глобус - модель Земли", class: 1, emoji: "🌍" },
  
  // 2 КЛАСС (40 слов)
  { id: "v51", word: "багровый", missing: "а", options: ["а", "о", "у"], hint: "Багровый - красный", class: 2, emoji: "🔴" },
  { id: "v52", word: "борода", missing: "о", options: ["о", "а", "у"], hint: "Борода - на лице", class: 2, emoji: "🧔" },
  { id: "v53", word: "верблюд", missing: "е", options: ["е", "и", "я"], hint: "Верблюд - животное", class: 2, emoji: "🐪" },
  { id: "v54", word: "воробей", missing: "о", options: ["о", "а", "у"], hint: "Воробей - птица", class: 2, emoji: "🐦" },
  { id: "v55", word: "деревня", missing: "е", options: ["е", "и", "я"], hint: "Деревня - село", class: 2, emoji: "🏘️" },
  { id: "v56", word: "жираф", missing: "и", options: ["и", "е", "я"], hint: "Жираф - животное", class: 2, emoji: "🦒" },
  { id: "v57", word: "завод", missing: "а", options: ["а", "о", "у"], hint: "Завод - предприятие", class: 2, emoji: "🏭" },
  { id: "v58", word: "капуста", missing: "а", options: ["а", "о", "у"], hint: "Капуста - овощ", class: 2, emoji: "🥬" },
  { id: "v59", word: "магазин", missing: "а", options: ["а", "о", "у"], hint: "Магазин - торговля", class: 2, emoji: "🏪" },
  { id: "v60", word: "мороз", missing: "о", options: ["о", "а", "у"], hint: "Мороз - холод", class: 2, emoji: "❄️" },
  { id: "v61", word: "праздник", missing: "д", options: ["д", "т", "г"], hint: "Праздник - торжество", class: 2, emoji: "🎉" },
  { id: "v62", word: "работа", missing: "а", options: ["а", "о", "у"], hint: "Работа - труд", class: 2, emoji: "💼" },
  { id: "v63", word: "сосна", missing: "о", options: ["о", "а", "у"], hint: "Сосна - дерево", class: 2, emoji: "🌲" },
  { id: "v64", word: "холодный", missing: "о", options: ["о", "а", "у"], hint: "Холодный - холодный", class: 2, emoji: "🥶" },
  { id: "v65", word: "цветок", missing: "е", options: ["е", "и", "я"], hint: "Цветок - растение", class: 2, emoji: "🌸" },
  { id: "v66", word: "ястреб", missing: "а", options: ["а", "о", "у"], hint: "Ястреб - птица", class: 2, emoji: "🦅" },
  { id: "v67", word: "автобус", missing: "а", options: ["а", "о", "у"], hint: "Автобус - транспорт", class: 2, emoji: "🚌" },
  { id: "v68", word: "велосипед", missing: "е", options: ["е", "и", "я"], hint: "Велосипед - транспорт", class: 2, emoji: "🚲" },
  { id: "v69", word: "самолёт", missing: "а", options: ["а", "о", "у"], hint: "Самолёт - летает", class: 2, emoji: "✈️" },
  { id: "v70", word: "корабль", missing: "о", options: ["о", "а", "у"], hint: "Корабль - плывёт", class: 2, emoji: "🚢" },
  { id: "v71", word: "поезд", missing: "о", options: ["о", "а", "у"], hint: "Поезд - едет", class: 2, emoji: "🚂" },
  { id: "v72", word: "трамвай", missing: "а", options: ["а", "о", "у"], hint: "Трамвай - транспорт", class: 2, emoji: "🚊" },
  { id: "v73", word: "троллейбус", missing: "о", options: ["о", "а", "у"], hint: "Троллейбус - транспорт", class: 2, emoji: "🚎" },
  { id: "v74", word: "метро", missing: "е", options: ["е", "и", "я"], hint: "Метро - подземка", class: 2, emoji: "🚇" },
  { id: "v75", word: "такси", missing: "а", options: ["а", "о", "у"], hint: "Такси - машина", class: 2, emoji: "🚕" },
  { id: "v76", word: "улица", missing: "у", options: ["у", "ю", "а"], hint: "Улица - дорога", class: 2, emoji: "🛣️" },
  { id: "v77", word: "площадь", missing: "о", options: ["о", "а", "у"], hint: "Площадь - место", class: 2, emoji: "🏛️" },
  { id: "v78", word: "парк", missing: "а", options: ["а", "о", "у"], hint: "Парк - гуляем", class: 2, emoji: "🌳" },
  { id: "v79", word: "сад", missing: "а", options: ["а", "о", "у"], hint: "Сад - деревья", class: 2, emoji: "🌲" },
  { id: "v80", word: "огород", missing: "о", options: ["о", "а", "у"], hint: "Огород - овощи", class: 2, emoji: "🌱" },
  { id: "v81", word: "поле", missing: "о", options: ["о", "а", "у"], hint: "Поле - земля", class: 2, emoji: "🌾" },
  { id: "v82", word: "река", missing: "е", options: ["е", "и", "я"], hint: "Река - вода", class: 2, emoji: "🏞️" },
  { id: "v83", word: "озеро", missing: "о", options: ["о", "а", "у"], hint: "Озеро - вода", class: 2, emoji: "🏞️" },
  { id: "v84", word: "мост", missing: "о", options: ["о", "а", "у"], hint: "Мост - через реку", class: 2, emoji: "🌉" },
  { id: "v85", word: "дом", missing: "о", options: ["о", "а", "у"], hint: "Дом - живём", class: 2, emoji: "🏠" },
  { id: "v86", word: "окно", missing: "о", options: ["о", "а", "у"], hint: "Окно - в доме", class: 2, emoji: "🪟" },
  { id: "v87", word: "дверь", missing: "е", options: ["е", "и", "я"], hint: "Дверь - входим", class: 2, emoji: "🚪" },
  { id: "v88", word: "крыша", missing: "ы", options: ["ы", "и", "е"], hint: "Крыша - сверху", class: 2, emoji: "🏠" },
  { id: "v89", word: "стена", missing: "е", options: ["е", "и", "я"], hint: "Стена - в доме", class: 2, emoji: "🧱" },
  { id: "v90", word: "пол", missing: "о", options: ["о", "а", "у"], hint: "Пол - внизу", class: 2, emoji: "🟫" },
  
  // 3 КЛАСС (30 слов)
  { id: "v91", word: "аллея", missing: "лл", options: ["лл", "л", "ль"], hint: "Аллея - дорожка", class: 3, emoji: "🛤️" },
  { id: "v92", word: "аптека", missing: "а", options: ["а", "о", "у"], hint: "Аптека - лекарства", class: 3, emoji: "💊" },
  { id: "v93", word: "багаж", missing: "а", options: ["а", "о", "у"], hint: "Багаж - вещи", class: 3, emoji: "🧳" },
  { id: "v94", word: "бассейн", missing: "сс", options: ["сс", "с", "з"], hint: "Бассейн - вода", class: 3, emoji: "🏊" },
  { id: "v95", word: "бетон", missing: "е", options: ["е", "и", "я"], hint: "Бетон - строительный", class: 3, emoji: "🧱" },
  { id: "v96", word: "билет", missing: "и", options: ["и", "е", "я"], hint: "Билет - проездной", class: 3, emoji: "🎫" },
  { id: "v97", word: "богатство", missing: "о", options: ["о", "а", "у"], hint: "Богатство - деньги", class: 3, emoji: "💰" },
  { id: "v98", word: "будущее", missing: "у", options: ["у", "ю", "а"], hint: "Будущее - завтра", class: 3, emoji: "🔮" },
  { id: "v99", word: "вагон", missing: "а", options: ["а", "о", "у"], hint: "Вагон - поезд", class: 3, emoji: "🚃" },
  { id: "v100", word: "велосипед", missing: "е", options: ["е", "и", "я"], hint: "Велосипед - транспорт", class: 3, emoji: "🚲" },
  { id: "v101", word: "ветеран", missing: "е", options: ["е", "и", "я"], hint: "Ветеран - воин", class: 3, emoji: "🎖️" },
  { id: "v102", word: "вещество", missing: "е", options: ["е", "и", "я"], hint: "Вещество - материя", class: 3, emoji: "🧪" },
  { id: "v103", word: "внимание", missing: "и", options: ["и", "е", "я"], hint: "Внимание - сосредоточенность", class: 3, emoji: "👀" },
  { id: "v104", word: "воздух", missing: "о", options: ["о", "а", "у"], hint: "Воздух - дыхание", class: 3, emoji: "💨" },
  { id: "v105", word: "воскресенье", missing: "о", options: ["о", "а", "у"], hint: "Воскресенье - день недели", class: 3, emoji: "📅" },
  { id: "v106", word: "восток", missing: "о", options: ["о", "а", "у"], hint: "Восток - направление", class: 3, emoji: "🧭" },
  { id: "v107", word: "выбор", missing: "ы", options: ["ы", "и", "е"], hint: "Выбор - решение", class: 3, emoji: "✅" },
  { id: "v108", word: "газета", missing: "а", options: ["а", "о", "у"], hint: "Газета - новости", class: 3, emoji: "📰" },
  { id: "v109", word: "герой", missing: "е", options: ["е", "и", "я"], hint: "Герой - смелый", class: 3, emoji: "🦸" },
  { id: "v110", word: "гимназия", missing: "и", options: ["и", "е", "я"], hint: "Гимназия - школа", class: 3, emoji: "🏫" },
  { id: "v111", word: "глубина", missing: "у", options: ["у", "ю", "а"], hint: "Глубина - дно", class: 3, emoji: "🌊" },
  { id: "v112", word: "говорить", missing: "о", options: ["о", "а", "у"], hint: "Говорить - разговаривать", class: 3, emoji: "💬" },
  { id: "v113", word: "год", missing: "о", options: ["о", "а", "у"], hint: "Год - 365 дней", class: 3, emoji: "📆" },
  { id: "v114", word: "голова", missing: "о", options: ["о", "а", "у"], hint: "Голова - на плечах", class: 3, emoji: "🗣️" },
  { id: "v115", word: "город", missing: "о", options: ["о", "а", "у"], hint: "Город - большой населённый пункт", class: 3, emoji: "🏙️" },
  { id: "v116", word: "государство", missing: "о", options: ["о", "а", "у"], hint: "Государство - страна", class: 3, emoji: "🏛️" },
  { id: "v117", word: "гость", missing: "о", options: ["о", "а", "у"], hint: "Гость - посетитель", class: 3, emoji: "👥" },
  { id: "v118", word: "группа", missing: "у", options: ["у", "ю", "а"], hint: "Группа - коллектив", class: 3, emoji: "👥" },
  { id: "v119", word: "губерния", missing: "у", options: ["у", "ю", "а"], hint: "Губерния - область", class: 3, emoji: "🗺️" },
  { id: "v120", word: "гулять", missing: "у", options: ["у", "ю", "а"], hint: "Гулять - прогулка", class: 3, emoji: "🚶" },
  
  // 4 КЛАСС (30 слов)
  { id: "v121", word: "двенадцать", missing: "е", options: ["е", "и", "я"], hint: "Двенадцать - число 12", class: 4, emoji: "🔢" },
  { id: "v122", word: "девятнадцать", missing: "е", options: ["е", "и", "я"], hint: "Девятнадцать - число 19", class: 4, emoji: "🔢" },
  { id: "v123", word: "дежурный", missing: "е", options: ["е", "и", "я"], hint: "Дежурный - на посту", class: 4, emoji: "👮" },
  { id: "v124", word: "деревня", missing: "е", options: ["е", "и", "я"], hint: "Деревня - село", class: 4, emoji: "🏘️" },
  { id: "v125", word: "десять", missing: "е", options: ["е", "и", "я"], hint: "Десять - число 10", class: 4, emoji: "🔟" },
  { id: "v126", word: "диалог", missing: "и", options: ["и", "е", "я"], hint: "Диалог - разговор", class: 4, emoji: "💬" },
  { id: "v127", word: "директор", missing: "и", options: ["и", "е", "я"], hint: "Директор - руководитель", class: 4, emoji: "👔" },
  { id: "v128", word: "дискуссия", missing: "сс", options: ["сс", "с", "з"], hint: "Дискуссия - спор", class: 4, emoji: "🗣️" },
  { id: "v129", word: "документ", missing: "о", options: ["о", "а", "у"], hint: "Документ - бумага", class: 4, emoji: "📄" },
  { id: "v130", word: "должность", missing: "о", options: ["о", "а", "у"], hint: "Должность - работа", class: 4, emoji: "💼" },
  { id: "v131", word: "дорога", missing: "о", options: ["о", "а", "у"], hint: "Дорога - путь", class: 4, emoji: "🛣️" },
  { id: "v132", word: "достоинство", missing: "о", options: ["о", "а", "у"], hint: "Достоинство - честь", class: 4, emoji: "👑" },
  { id: "v133", word: "досуг", missing: "о", options: ["о", "а", "у"], hint: "Досуг - свободное время", class: 4, emoji: "🎮" },
  { id: "v134", word: "дракон", missing: "а", options: ["а", "о", "у"], hint: "Дракон - мифический", class: 4, emoji: "🐉" },
  { id: "v135", word: "друг", missing: "у", options: ["у", "ю", "а"], hint: "Друг - товарищ", class: 4, emoji: "🤝" },
  { id: "v136", word: "дружба", missing: "у", options: ["у", "ю", "а"], hint: "Дружба - отношения", class: 4, emoji: "❤️" },
  { id: "v137", word: "дуб", missing: "у", options: ["у", "ю", "а"], hint: "Дуб - дерево", class: 4, emoji: "🌳" },
  { id: "v138", word: "думать", missing: "у", options: ["у", "ю", "а"], hint: "Думать - размышлять", class: 4, emoji: "🤔" },
  { id: "v139", word: "душа", missing: "у", options: ["у", "ю", "а"], hint: "Душа - внутренний мир", class: 4, emoji: "💖" },
  { id: "v140", word: "дышать", missing: "ы", options: ["ы", "и", "е"], hint: "Дышать - воздух", class: 4, emoji: "🌬️" },
  { id: "v141", word: "дядя", missing: "я", options: ["я", "а", "у"], hint: "Дядя - родственник", class: 4, emoji: "👨" },
  { id: "v142", word: "европа", missing: "е", options: ["е", "и", "я"], hint: "Европа - континент", class: 4, emoji: "🌍" },
  { id: "v143", word: "ель", missing: "е", options: ["е", "и", "я"], hint: "Ель - дерево", class: 4, emoji: "🌲" },
  { id: "v144", word: "если", missing: "е", options: ["е", "и", "я"], hint: "Если - условие", class: 4, emoji: "❓" },
  { id: "v145", word: "есть", missing: "е", options: ["е", "и", "я"], hint: "Есть - кушать", class: 4, emoji: "🍽️" },
  { id: "v146", word: "ещё", missing: "е", options: ["е", "и", "я"], hint: "Ещё - дополнительно", class: 4, emoji: "➕" },
  { id: "v147", word: "жажда", missing: "а", options: ["а", "о", "у"], hint: "Жажда - хочется пить", class: 4, emoji: "💧" },
  { id: "v148", word: "жалеть", missing: "а", options: ["а", "о", "у"], hint: "Жалеть - сочувствовать", class: 4, emoji: "😢" },
  { id: "v149", word: "жаркий", missing: "а", options: ["а", "о", "у"], hint: "Жаркий - горячий", class: 4, emoji: "🔥" },
  { id: "v150", word: "жать", missing: "а", options: ["а", "о", "у"], hint: "Жать - давить", class: 4, emoji: "👊" },
  
  // 5-11 КЛАССЫ (150 слов)
  { id: "v151", word: "абонемент", missing: "а", options: ["а", "о", "у"], hint: "Абонемент - пропуск", class: 5, emoji: "🎫" },
  { id: "v152", word: "авангард", missing: "а", options: ["а", "о", "у"], hint: "Авангард - передовой", class: 5, emoji: "🚀" },
  { id: "v153", word: "автобиография", missing: "а", options: ["а", "о", "у"], hint: "Автобиография - о себе", class: 5, emoji: "📖" },
  { id: "v154", word: "автомат", missing: "а", options: ["а", "о", "у"], hint: "Автомат - машина", class: 5, emoji: "🤖" },
  { id: "v155", word: "авторитет", missing: "а", options: ["а", "о", "у"], hint: "Авторитет - уважение", class: 5, emoji: "👑" },
  { id: "v156", word: "агрессия", missing: "а", options: ["а", "о", "у"], hint: "Агрессия - нападение", class: 5, emoji: "⚔️" },
  { id: "v157", word: "адрес", missing: "а", options: ["а", "о", "у"], hint: "Адрес - местоположение", class: 5, emoji: "📍" },
  { id: "v158", word: "академия", missing: "а", options: ["а", "о", "у"], hint: "Академия - наука", class: 5, emoji: "🎓" },
  { id: "v159", word: "аквариум", missing: "а", options: ["а", "о", "у"], hint: "Аквариум - рыбки", class: 5, emoji: "🐠" },
  { id: "v160", word: "аккомпанемент", missing: "а", options: ["а", "о", "у"], hint: "Аккомпанемент - сопровождение", class: 5, emoji: "🎵" },
  { id: "v161", word: "аккуратный", missing: "а", options: ["а", "о", "у"], hint: "Аккуратный - точный", class: 5, emoji: "✨" },
  { id: "v162", word: "алгоритм", missing: "а", options: ["а", "о", "у"], hint: "Алгоритм - последовательность", class: 5, emoji: "🔢" },
  { id: "v163", word: "аллегория", missing: "а", options: ["а", "о", "у"], hint: "Аллегория - иносказание", class: 5, emoji: "🎭" },
  { id: "v164", word: "алфавит", missing: "а", options: ["а", "о", "у"], hint: "Алфавит - буквы", class: 5, emoji: "🔤" },
  { id: "v165", word: "альбом", missing: "а", options: ["а", "о", "у"], hint: "Альбом - для фото", class: 5, emoji: "📸" },
  { id: "v166", word: "амбиция", missing: "а", options: ["а", "о", "у"], hint: "Амбиция - стремление", class: 5, emoji: "🎯" },
  { id: "v167", word: "анализ", missing: "а", options: ["а", "о", "у"], hint: "Анализ - разбор", class: 5, emoji: "🔍" },
  { id: "v168", word: "аналогия", missing: "а", options: ["а", "о", "у"], hint: "Аналогия - сходство", class: 5, emoji: "🔄" },
  { id: "v169", word: "антенна", missing: "а", options: ["а", "о", "у"], hint: "Антенна - приём сигнала", class: 5, emoji: "📡" },
  { id: "v170", word: "аннотация", missing: "а", options: ["а", "о", "у"], hint: "Аннотация - описание", class: 5, emoji: "📝" },
  { id: "v171", word: "аппарат", missing: "а", options: ["а", "о", "у"], hint: "Аппарат - устройство", class: 5, emoji: "⚙️" },
  { id: "v172", word: "аргумент", missing: "а", options: ["а", "о", "у"], hint: "Аргумент - довод", class: 5, emoji: "💬" },
  { id: "v173", word: "аристократия", missing: "а", options: ["а", "о", "у"], hint: "Аристократия - знать", class: 5, emoji: "👑" },
  { id: "v174", word: "архив", missing: "а", options: ["а", "о", "у"], hint: "Архив - документы", class: 5, emoji: "📁" },
  { id: "v175", word: "архитектура", missing: "а", options: ["а", "о", "у"], hint: "Архитектура - здания", class: 5, emoji: "🏛️" },
  { id: "v176", word: "ассоциация", missing: "а", options: ["а", "о", "у"], hint: "Ассоциация - связь", class: 5, emoji: "🔗" },
  { id: "v177", word: "атмосфера", missing: "а", options: ["а", "о", "у"], hint: "Атмосфера - воздух", class: 5, emoji: "🌍" },
  { id: "v178", word: "атрибут", missing: "а", options: ["а", "о", "у"], hint: "Атрибут - признак", class: 5, emoji: "🏷️" },
  { id: "v179", word: "аудитория", missing: "а", options: ["а", "о", "у"], hint: "Аудитория - слушатели", class: 5, emoji: "👥" },
  { id: "v180", word: "база", missing: "а", options: ["а", "о", "у"], hint: "База - основание", class: 5, emoji: "🏗️" },
  
  // 6-11 классы (продолжение)
  { id: "v181", word: "баррикада", missing: "а", options: ["а", "о", "у"], hint: "Баррикада - препятствие", class: 6, emoji: "🚧" },
  { id: "v182", word: "бенефис", missing: "е", options: ["е", "и", "я"], hint: "Бенефис - представление", class: 6, emoji: "🎭" },
  { id: "v183", word: "библиография", missing: "и", options: ["и", "е", "я"], hint: "Библиография - список книг", class: 6, emoji: "📚" },
  { id: "v184", word: "биография", missing: "и", options: ["и", "е", "я"], hint: "Биография - жизнь", class: 6, emoji: "📖" },
  { id: "v185", word: "бюджет", missing: "ю", options: ["ю", "у", "я"], hint: "Бюджет - финансы", class: 6, emoji: "💰" },
  { id: "v186", word: "валюта", missing: "а", options: ["а", "о", "у"], hint: "Валюта - деньги", class: 6, emoji: "💵" },
  { id: "v187", word: "вариант", missing: "а", options: ["а", "о", "у"], hint: "Вариант - выбор", class: 6, emoji: "🔀" },
  { id: "v188", word: "вектор", missing: "е", options: ["е", "и", "я"], hint: "Вектор - направление", class: 6, emoji: "➡️" },
  { id: "v189", word: "вентиляция", missing: "е", options: ["е", "и", "я"], hint: "Вентиляция - воздух", class: 6, emoji: "💨" },
  { id: "v190", word: "версия", missing: "е", options: ["е", "и", "я"], hint: "Версия - вариант", class: 6, emoji: "📋" },
  { id: "v191", word: "вертикаль", missing: "е", options: ["е", "и", "я"], hint: "Вертикаль - вверх", class: 6, emoji: "📐" },
  { id: "v192", word: "ветеринар", missing: "е", options: ["е", "и", "я"], hint: "Ветеринар - врач для животных", class: 6, emoji: "🐾" },
  { id: "v193", word: "вещество", missing: "е", options: ["е", "и", "я"], hint: "Вещество - материя", class: 6, emoji: "🧪" },
  { id: "v194", word: "взаимодействие", missing: "а", options: ["а", "о", "у"], hint: "Взаимодействие - общение", class: 6, emoji: "🤝" },
  { id: "v195", word: "визит", missing: "и", options: ["и", "е", "я"], hint: "Визит - посещение", class: 6, emoji: "👋" },
  { id: "v196", word: "витрина", missing: "и", options: ["и", "е", "я"], hint: "Витрина - витрина магазина", class: 6, emoji: "🪟" },
  { id: "v197", word: "вклад", missing: "а", options: ["а", "о", "у"], hint: "Вклад - деньги в банке", class: 6, emoji: "💰" },
  { id: "v198", word: "вкусный", missing: "у", options: ["у", "ю", "а"], hint: "Вкусный - приятный на вкус", class: 6, emoji: "😋" },
  { id: "v199", word: "влияние", missing: "и", options: ["и", "е", "я"], hint: "Влияние - воздействие", class: 6, emoji: "💫" },
  { id: "v200", word: "внимание", missing: "и", options: ["и", "е", "я"], hint: "Внимание - сосредоточенность", class: 6, emoji: "👀" },
  
  // 7-11 классы (100 слов)
  { id: "v201", word: "галактика", missing: "а", options: ["а", "о", "у"], hint: "Галактика - звёздная система", class: 7, emoji: "🌌" },
  { id: "v202", word: "гармония", missing: "а", options: ["а", "о", "у"], hint: "Гармония - согласие", class: 7, emoji: "🎵" },
  { id: "v203", word: "гелий", missing: "е", options: ["е", "и", "я"], hint: "Гелий - газ", class: 7, emoji: "🎈" },
  { id: "v204", word: "генератор", missing: "е", options: ["е", "и", "я"], hint: "Генератор - источник энергии", class: 7, emoji: "⚡" },
  { id: "v205", word: "география", missing: "е", options: ["е", "и", "я"], hint: "География - наука о Земле", class: 7, emoji: "🗺️" },
  { id: "v206", word: "геральдика", missing: "е", options: ["е", "и", "я"], hint: "Геральдика - гербы", class: 7, emoji: "🛡️" },
  { id: "v207", word: "гипотеза", missing: "и", options: ["и", "е", "я"], hint: "Гипотеза - предположение", class: 7, emoji: "💡" },
  { id: "v208", word: "глагол", missing: "а", options: ["а", "о", "у"], hint: "Глагол - часть речи", class: 7, emoji: "📝" },
  { id: "v209", word: "глубина", missing: "у", options: ["у", "ю", "а"], hint: "Глубина - глубокое место", class: 7, emoji: "🌊" },
  { id: "v210", word: "горизонт", missing: "о", options: ["о", "а", "у"], hint: "Горизонт - линия горизонта", class: 7, emoji: "🌅" },
  { id: "v211", word: "гравитация", missing: "а", options: ["а", "о", "у"], hint: "Гравитация - притяжение", class: 7, emoji: "🍎" },
  { id: "v212", word: "грамматика", missing: "а", options: ["а", "о", "у"], hint: "Грамматика - правила языка", class: 7, emoji: "📚" },
  { id: "v213", word: "график", missing: "а", options: ["а", "о", "у"], hint: "График - расписание", class: 7, emoji: "📊" },
  { id: "v214", word: "гравюра", missing: "а", options: ["а", "о", "у"], hint: "Гравюра - рисунок", class: 7, emoji: "🖼️" },
  { id: "v215", word: "демократия", missing: "е", options: ["е", "и", "я"], hint: "Демократия - власть народа", class: 7, emoji: "🗳️" },
  { id: "v216", word: "диагноз", missing: "и", options: ["и", "е", "я"], hint: "Диагноз - болезнь", class: 7, emoji: "🏥" },
  { id: "v217", word: "диалект", missing: "и", options: ["и", "е", "я"], hint: "Диалект - говор", class: 7, emoji: "🗣️" },
  { id: "v218", word: "диаметр", missing: "и", options: ["и", "е", "я"], hint: "Диаметр - размер круга", class: 7, emoji: "⭕" },
  { id: "v219", word: "диплом", missing: "и", options: ["и", "е", "я"], hint: "Диплом - документ об образовании", class: 7, emoji: "🎓" },
  { id: "v220", word: "директива", missing: "и", options: ["и", "е", "я"], hint: "Директива - указание", class: 7, emoji: "📋" },
  { id: "v221", word: "дискуссия", missing: "и", options: ["и", "е", "я"], hint: "Дискуссия - спор", class: 7, emoji: "💬" },
  { id: "v222", word: "диссертация", missing: "и", options: ["и", "е", "я"], hint: "Диссертация - научная работа", class: 7, emoji: "📖" },
  { id: "v223", word: "дифференциал", missing: "и", options: ["и", "е", "я"], hint: "Дифференциал - математика", class: 7, emoji: "∫" },
  { id: "v224", word: "документация", missing: "о", options: ["о", "а", "у"], hint: "Документация - бумаги", class: 7, emoji: "📄" },
  { id: "v225", word: "доллар", missing: "о", options: ["о", "а", "у"], hint: "Доллар - валюта США", class: 7, emoji: "💵" },
  { id: "v226", word: "доминация", missing: "о", options: ["о", "а", "у"], hint: "Доминирование - господство", class: 7, emoji: "👑" },
  { id: "v227", word: "допинг", missing: "о", options: ["о", "а", "у"], hint: "Допинг - запрещённые вещества", class: 7, emoji: "💊" },
  { id: "v228", word: "драматургия", missing: "а", options: ["а", "о", "у"], hint: "Драматургия - театр", class: 7, emoji: "🎭" },
  { id: "v229", word: "древность", missing: "е", options: ["е", "и", "я"], hint: "Древность - старина", class: 7, emoji: "🏺" },
  { id: "v230", word: "единица", missing: "е", options: ["е", "и", "я"], hint: "Единица - число 1", class: 7, emoji: "1️⃣" },
  
  // 8-11 классы (70 слов)
  { id: "v231", word: "евро", missing: "е", options: ["е", "и", "я"], hint: "Евро - валюта ЕС", class: 8, emoji: "💶" },
  { id: "v232", word: "естествознание", missing: "е", options: ["е", "и", "я"], hint: "Естествознание - наука о природе", class: 8, emoji: "🔬" },
  { id: "v233", word: "эффект", missing: "е", options: ["е", "и", "я"], hint: "Эффект - результат", class: 8, emoji: "✨" },
  { id: "v234", word: "жажда", missing: "а", options: ["а", "о", "у"], hint: "Жажда - хочется пить", class: 8, emoji: "💧" },
  { id: "v235", word: "жанр", missing: "а", options: ["а", "о", "у"], hint: "Жанр - вид искусства", class: 8, emoji: "🎨" },
  { id: "v236", word: "желание", missing: "е", options: ["е", "и", "я"], hint: "Желание - хотение", class: 8, emoji: "💭" },
  { id: "v237", word: "жемчуг", missing: "е", options: ["е", "и", "я"], hint: "Жемчуг - драгоценность", class: 8, emoji: "💎" },
  { id: "v238", word: "жертва", missing: "е", options: ["е", "и", "я"], hint: "Жертва - пострадавший", class: 8, emoji: "🩸" },
  { id: "v239", word: "жест", missing: "е", options: ["е", "и", "я"], hint: "Жест - движение рукой", class: 8, emoji: "👋" },
  { id: "v240", word: "живопись", missing: "и", options: ["и", "е", "я"], hint: "Живопись - рисование", class: 8, emoji: "🎨" },
  { id: "v241", word: "жилище", missing: "и", options: ["и", "е", "я"], hint: "Жилище - дом", class: 8, emoji: "🏠" },
  { id: "v242", word: "жизнь", missing: "и", options: ["и", "е", "я"], hint: "Жизнь - существование", class: 8, emoji: "🌱" },
  { id: "v243", word: "журналистика", missing: "у", options: ["у", "ю", "а"], hint: "Журналистика - СМИ", class: 8, emoji: "📰" },
  { id: "v244", word: "забвение", missing: "а", options: ["а", "о", "у"], hint: "Забвение - забытое", class: 8, emoji: "🕸️" },
  { id: "v245", word: "забота", missing: "а", options: ["а", "о", "у"], hint: "Забота - уход", class: 8, emoji: "💝" },
  { id: "v246", word: "заведение", missing: "а", options: ["а", "о", "у"], hint: "Заведение - учреждение", class: 8, emoji: "🏢" },
  { id: "v247", word: "зависимость", missing: "а", options: ["а", "о", "у"], hint: "Зависимость - от чего-то", class: 8, emoji: "🔗" },
  { id: "v248", word: "завод", missing: "а", options: ["а", "о", "у"], hint: "Завод - предприятие", class: 8, emoji: "🏭" },
  { id: "v249", word: "завтрак", missing: "а", options: ["а", "о", "у"], hint: "Завтрак - утренняя еда", class: 8, emoji: "🍳" },
  { id: "v250", word: "загадка", missing: "а", options: ["а", "о", "у"], hint: "Загадка - тайна", class: 8, emoji: "❓" },
  
  // 9-11 классы (50 слов)
  { id: "v251", word: "законодательство", missing: "а", options: ["а", "о", "у"], hint: "Законодательство - законы", class: 9, emoji: "⚖️" },
  { id: "v252", word: "заместитель", missing: "а", options: ["а", "о", "у"], hint: "Заместитель - помощник", class: 9, emoji: "👔" },
  { id: "v253", word: "запас", missing: "а", options: ["а", "о", "у"], hint: "Запас - резерв", class: 9, emoji: "📦" },
  { id: "v254", word: "запрос", missing: "а", options: ["а", "о", "у"], hint: "Запрос - вопрос", class: 9, emoji: "❓" },
  { id: "v255", word: "заработок", missing: "а", options: ["а", "о", "у"], hint: "Заработок - деньги", class: 9, emoji: "💰" },
  { id: "v256", word: "зарплата", missing: "а", options: ["а", "о", "у"], hint: "Зарплата - деньги за работу", class: 9, emoji: "💵" },
  { id: "v257", word: "заседание", missing: "а", options: ["а", "о", "у"], hint: "Заседание - собрание", class: 9, emoji: "👥" },
  { id: "v258", word: "заслуга", missing: "а", options: ["а", "о", "у"], hint: "Заслуга - достижение", class: 9, emoji: "🏆" },
  { id: "v259", word: "заставка", missing: "а", options: ["а", "о", "у"], hint: "Заставка - экран", class: 9, emoji: "🖥️" },
  { id: "v260", word: "застой", missing: "а", options: ["а", "о", "у"], hint: "Застой - без движения", class: 9, emoji: "🛑" },
  { id: "v261", word: "затрата", missing: "а", options: ["а", "о", "у"], hint: "Затрата - расход", class: 9, emoji: "💸" },
  { id: "v262", word: "затмение", missing: "а", options: ["а", "о", "у"], hint: "Затмение - солнечное", class: 9, emoji: "🌑" },
  { id: "v263", word: "затон", missing: "а", options: ["а", "о", "у"], hint: "Затон - бухта", class: 9, emoji: "⚓" },
  { id: "v264", word: "защита", missing: "а", options: ["а", "о", "у"], hint: "Защита - оборона", class: 9, emoji: "🛡️" },
  { id: "v265", word: "звено", missing: "е", options: ["е", "и", "я"], hint: "Звено - часть цепи", class: 9, emoji: "🔗" },
  { id: "v266", word: "зверь", missing: "е", options: ["е", "и", "я"], hint: "Зверь - животное", class: 9, emoji: "🦁" },
  { id: "v267", word: "здание", missing: "а", options: ["а", "о", "у"], hint: "Здание - строение", class: 9, emoji: "🏢" },
  { id: "v268", word: "здоровье", missing: "о", options: ["о", "а", "у"], hint: "Здоровье - самочувствие", class: 9, emoji: "💚" },
  { id: "v269", word: "зебра", missing: "е", options: ["е", "и", "я"], hint: "Зебра - животное", class: 9, emoji: "🦓" },
  { id: "v270", word: "земля", missing: "е", options: ["е", "и", "я"], hint: "Земля - планета", class: 9, emoji: "🌍" },
  
  // 10-11 классы (30 слов)
  { id: "v271", word: "зенит", missing: "е", options: ["е", "и", "я"], hint: "Зенит - высшая точка", class: 10, emoji: "☀️" },
  { id: "v272", word: "зеркало", missing: "е", options: ["е", "и", "я"], hint: "Зеркало - отражение", class: 10, emoji: "🪞" },
  { id: "v273", word: "зима", missing: "и", options: ["и", "е", "я"], hint: "Зима - холодное время года", class: 10, emoji: "❄️" },
  { id: "v274", word: "зло", missing: "о", options: ["о", "а", "у"], hint: "Зло - плохое", class: 10, emoji: "😈" },
  { id: "v275", word: "знамя", missing: "а", options: ["а", "о", "у"], hint: "Знамя - флаг", class: 10, emoji: "🚩" },
  { id: "v276", word: "значение", missing: "а", options: ["а", "о", "у"], hint: "Значение - смысл", class: 10, emoji: "💡" },
  { id: "v277", word: "знание", missing: "а", options: ["а", "о", "у"], hint: "Знание - информация", class: 10, emoji: "📚" },
  { id: "v278", word: "золото", missing: "о", options: ["о", "а", "у"], hint: "Золото - драгоценный металл", class: 10, emoji: "🥇" },
  { id: "v279", word: "зона", missing: "о", options: ["о", "а", "у"], hint: "Зона - область", class: 10, emoji: "🗺️" },
  { id: "v280", word: "зоопарк", missing: "о", options: ["о", "а", "у"], hint: "Зоопарк - животные", class: 10, emoji: "🦁" },
  { id: "v281", word: "игла", missing: "и", options: ["и", "е", "я"], hint: "Игла - шитьё", class: 10, emoji: "🪡" },
  { id: "v282", word: "игра", missing: "и", options: ["и", "е", "я"], hint: "Игра - развлечение", class: 10, emoji: "🎮" },
  { id: "v283", word: "идеал", missing: "и", options: ["и", "е", "я"], hint: "Идеал - совершенство", class: 10, emoji: "⭐" },
  { id: "v284", word: "идея", missing: "и", options: ["и", "е", "я"], hint: "Идея - мысль", class: 10, emoji: "💡" },
  { id: "v285", word: "изба", missing: "и", options: ["и", "е", "я"], hint: "Изба - деревянный дом", class: 10, emoji: "🏚️" },
  { id: "v286", word: "избрание", missing: "и", options: ["и", "е", "я"], hint: "Избрание - выборы", class: 10, emoji: "🗳️" },
  { id: "v287", word: "избыток", missing: "и", options: ["и", "е", "я"], hint: "Избыток - много", class: 10, emoji: "📈" },
  { id: "v288", word: "извинение", missing: "и", options: ["и", "е", "я"], hint: "Извинение - прощение", class: 10, emoji: "🙏" },
  { id: "v289", word: "извлечение", missing: "и", options: ["и", "е", "я"], hint: "Извлечение - вытаскивание", class: 10, emoji: "📤" },
  { id: "v290", word: "издание", missing: "и", options: ["и", "е", "я"], hint: "Издание - публикация", class: 10, emoji: "📖" },
  
  // 11 класс (10 слов)
  { id: "v291", word: "изделие", missing: "и", options: ["и", "е", "я"], hint: "Изделие - продукт", class: 11, emoji: "🏭" },
  { id: "v292", word: "издержка", missing: "и", options: ["и", "е", "я"], hint: "Издержка - расход", class: 11, emoji: "💸" },
  { id: "v293", word: "изложение", missing: "и", options: ["и", "е", "я"], hint: "Изложение - пересказ", class: 11, emoji: "📝" },
  { id: "v294", word: "изменение", missing: "и", options: ["и", "е", "я"], hint: "Изменение - перемена", class: 11, emoji: "🔄" },
  { id: "v295", word: "измерение", missing: "и", options: ["и", "е", "я"], hint: "Измерение - размер", class: 11, emoji: "📏" },
  { id: "v296", word: "изобретение", missing: "и", options: ["и", "е", "я"], hint: "Изобретение - новое", class: 11, emoji: "💡" },
  { id: "v297", word: "изоляция", missing: "и", options: ["и", "е", "я"], hint: "Изоляция - отделение", class: 11, emoji: "🚧" },
  { id: "v298", word: "изучение", missing: "и", options: ["и", "е", "я"], hint: "Изучение - исследование", class: 11, emoji: "🔬" },
  { id: "v299", word: "изъян", missing: "и", options: ["и", "е", "я"], hint: "Изъян - дефект", class: 11, emoji: "❌" },
  { id: "v300", word: "изыскание", missing: "и", options: ["и", "е", "я"], hint: "Изыскание - исследование", class: 11, emoji: "🔍" },
];

const DB_VERSION = "2"; // Увеличиваем версию для обновления данных

export function getStressWords(): StressWord[] {
  const storedVersion = localStorage.getItem(DB_VERSION_KEY);
  const raw = localStorage.getItem(DB_KEY_STRESS);
  let words: StressWord[];
  
  // Если версия изменилась или данных нет, используем начальные данные
  if (!raw || storedVersion !== DB_VERSION) {
    words = INITIAL_STRESS;
    localStorage.setItem(DB_KEY_STRESS, JSON.stringify(words));
    localStorage.setItem(DB_VERSION_KEY, DB_VERSION);
  } else {
    try {
      words = JSON.parse(raw) as StressWord[];
    } catch {
      words = INITIAL_STRESS;
    }
  }
  
  // Автоматически генерируем произношение для всех слов
  return words.map(word => ({
    ...word,
    pronunciation: word.pronunciation || generatePronunciation(word.word, word.stress)
  }));
}

export function getVocabWords(): VocabWord[] {
  const storedVersion = localStorage.getItem(DB_VERSION_KEY);
  const raw = localStorage.getItem(DB_KEY_VOCAB);
  let words: VocabWord[];
  
  // Если версия изменилась или данных нет, используем начальные данные
  if (!raw || storedVersion !== DB_VERSION) {
    words = INITIAL_VOCAB;
    localStorage.setItem(DB_KEY_VOCAB, JSON.stringify(words));
    localStorage.setItem(DB_VERSION_KEY, DB_VERSION);
  } else {
    try {
      words = JSON.parse(raw) as VocabWord[];
    } catch {
      words = INITIAL_VOCAB;
    }
  }
  
  return words;
}

export function saveStressWords(words: StressWord[]): void {
  localStorage.setItem(DB_KEY_STRESS, JSON.stringify(words));
  window.dispatchEvent(new Event("db-updated"));
}

export function saveVocabWords(words: VocabWord[]): void {
  localStorage.setItem(DB_KEY_VOCAB, JSON.stringify(words));
  window.dispatchEvent(new Event("db-updated"));
}

export function getDBVersion(): number {
  return parseInt(localStorage.getItem(DB_VERSION_KEY) || "1", 10);
}

export function onDatabaseChange(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("db-updated", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("db-updated", handler);
  };
}

// CRUD операции для админ-панели
export function addStressWord(word: Omit<StressWord, "id">): StressWord {
  const words = getStressWords();
  const maxId = words.reduce((max, w) => {
    const num = parseInt(w.id.replace("s", "")) || 0;
    return num > max ? num : max;
  }, 0);
  const newWord: StressWord = { ...word, id: `s${maxId + 1}` };
  words.push(newWord);
  saveStressWords(words);
  return newWord;
}

export function updateStressWord(id: string, updates: Partial<StressWord>): void {
  const words = getStressWords();
  const idx = words.findIndex(w => w.id === id);
  if (idx >= 0) {
    words[idx] = { ...words[idx], ...updates };
    saveStressWords(words);
  }
}

export function deleteStressWord(id: string): void {
  const words = getStressWords().filter(w => w.id !== id);
  saveStressWords(words);
}

export function addVocabWord(word: Omit<VocabWord, "id">): VocabWord {
  const words = getVocabWords();
  const maxId = words.reduce((max, w) => {
    const num = parseInt(w.id.replace("v", "")) || 0;
    return num > max ? num : max;
  }, 0);
  const newWord: VocabWord = { ...word, id: `v${maxId + 1}` };
  words.push(newWord);
  saveVocabWords(words);
  return newWord;
}

export function updateVocabWord(id: string, updates: Partial<VocabWord>): void {
  const words = getVocabWords();
  const idx = words.findIndex(w => w.id === id);
  if (idx >= 0) {
    words[idx] = { ...words[idx], ...updates };
    saveVocabWords(words);
  }
}

export function deleteVocabWord(id: string): void {
  const words = getVocabWords().filter(w => w.id !== id);
  saveVocabWords(words);
}

export function resetDatabase(): void {
  localStorage.removeItem(DB_KEY_STRESS);
  localStorage.removeItem(DB_KEY_VOCAB);
  localStorage.removeItem(DB_VERSION_KEY);
  window.dispatchEvent(new Event("db-updated"));
}

export function getDBStats(): { stressCount: number; vocabCount: number; version: number } {
  return {
    stressCount: getStressWords().length,
    vocabCount: getVocabWords().length,
    version: getDBVersion(),
  };
}
