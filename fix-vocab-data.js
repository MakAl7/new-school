// Скрипт для исправления данных в vocab.ts
// Запускается один раз для преобразования данных

const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, 'src/data/vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

// Функция для преобразования слова с пропущенной буквой
function fixWord(word, missingLetter) {
  // Находим позицию пропущенной буквы
  const index = word.indexOf(missingLetter);
  if (index === -1) {
    console.warn(`Не найдена буква "${missingLetter}" в слове "${word}"`);
    return word;
  }
  
  // Заменяем букву на точку
  return word.slice(0, index) + '.' + word.slice(index + 1);
}

// Паттерн для поиска строк данных
const pattern = /\["([^"]+)",\s*"([^"]+)",\s*\[([^\]]+)\],\s*"([^"]+)",\s*(\d+)\]/g;

content = content.replace(pattern, (match, word, missing, options, hint, cls) => {
  const fixedWord = fixWord(word, missing);
  return `["${fixedWord}", "${missing}", [${options}], "${hint}", ${cls}]`;
});

fs.writeFileSync(vocabPath, content, 'utf8');
console.log('Данные исправлены!');
