import { useState } from 'react';
import { ChemicalElement, CHEMICAL_ELEMENTS, CATEGORY_COLORS } from '../data/chemistry';

// Функция озвучивания текста
function speak(text: string, lang: 'ru-RU' | 'en-US' = 'ru-RU') {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
}

export default function Chemistry() {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(CHEMICAL_ELEMENTS.map(el => el.category)));

  const filteredElements = CHEMICAL_ELEMENTS.filter(el => {
    const matchesSearch = 
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.number.toString().includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || el.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-ink mb-6">
          🧪 Химия — Таблица Менделеева
        </h1>

        {/* Поиск и фильтры */}
        <div className="bg-card rounded-xl p-4 shadow-note-sm mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Поиск по названию, символу или номеру..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-line rounded-lg focus:border-ink outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-ink text-card'
                  : 'bg-paper text-ink hover:bg-line'
              }`}
            >
              Все ({CHEMICAL_ELEMENTS.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-lg font-bold transition-all capitalize"
                style={{
                  backgroundColor: selectedCategory === cat ? CATEGORY_COLORS[cat] : 'transparent',
                  color: selectedCategory === cat ? 'white' : CATEGORY_COLORS[cat],
                  border: `2px solid ${CATEGORY_COLORS[cat]}`,
                }}
              >
                {cat} ({CHEMICAL_ELEMENTS.filter(el => el.category === cat).length})
              </button>
            ))}
          </div>
        </div>

        {/* Таблица элементов */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3 mb-6">
          {filteredElements.map(element => (
            <button
              key={element.id}
              onClick={() => setSelectedElement(element)}
              className="aspect-square rounded-lg border-2 border-ink p-2 flex flex-col items-center justify-center hover:scale-105 transition-transform shadow-note-sm"
              style={{ backgroundColor: CATEGORY_COLORS[element.category] + '30' }}
            >
              <div className="text-xs text-ink-soft">{element.number}</div>
              <div className="text-2xl font-black text-ink">{element.symbol}</div>
              <div className="text-xs text-ink font-bold text-center leading-tight">
                {element.name}
              </div>
            </button>
          ))}
        </div>

        {/* Детальная карточка элемента */}
        {selectedElement && (
          <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl p-6 max-w-2xl w-full shadow-note">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="text-sm text-ink-soft">Атомный номер: {selectedElement.number}</div>
                  <h2 className="text-3xl font-black text-ink">{selectedElement.name}</h2>
                  <div className="mt-2 p-3 bg-blueink/10 rounded-lg border-2 border-blueink/30">
                    <div className="text-xs text-blueink font-bold mb-1">English:</div>
                    <div className="text-xl font-bold text-blueink">{selectedElement.nameEn}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-mono bg-paper px-3 py-1 rounded-lg border-2 border-line">
                      [{selectedElement.pronunciation}]
                    </span>
                    <button
                      onClick={() => speak(selectedElement.name, 'ru-RU')}
                      className="px-3 py-1 bg-blueink text-white rounded-lg font-bold hover:bg-blueink/80 transition-colors"
                      title="Озвучить по-русски"
                    >
                      🔊 RU
                    </button>
                    <button
                      onClick={() => speak(selectedElement.nameEn, 'en-US')}
                      className="px-3 py-1 bg-leaf text-white rounded-lg font-bold hover:bg-leaf/80 transition-colors"
                      title="Озвучить по-английски"
                    >
                      🔊 EN
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedElement(null)}
                  className="text-ink-soft hover:text-ink text-2xl ml-4"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-paper rounded-lg p-4">
                  <div className="text-sm text-ink-soft">Символ</div>
                  <div className="text-4xl font-black text-ink">{selectedElement.symbol}</div>
                </div>
                <div className="bg-paper rounded-lg p-4">
                  <div className="text-sm text-ink-soft">Атомная масса</div>
                  <div className="text-2xl font-black text-ink">{selectedElement.atomicMass}</div>
                </div>
                <div className="bg-paper rounded-lg p-4">
                  <div className="text-sm text-ink-soft">Группа</div>
                  <div className="text-2xl font-black text-ink">{selectedElement.group}</div>
                </div>
                <div className="bg-paper rounded-lg p-4">
                  <div className="text-sm text-ink-soft">Период</div>
                  <div className="text-2xl font-black text-ink">{selectedElement.period}</div>
                </div>
              </div>

              <div className="bg-paper rounded-lg p-4">
                <div className="text-sm text-ink-soft mb-2">Категория</div>
                <div
                  className="inline-block px-4 py-2 rounded-lg font-bold text-white capitalize"
                  style={{ backgroundColor: CATEGORY_COLORS[selectedElement.category] }}
                >
                  {selectedElement.category}
                </div>
              </div>

              <button
                onClick={() => setSelectedElement(null)}
                className="mt-4 w-full bg-ink text-card py-3 rounded-lg font-bold hover:bg-ink/90 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        {/* Статистика */}
        <div className="bg-card rounded-xl p-4 shadow-note-sm">
          <h3 className="text-xl font-black text-ink mb-3">📊 Статистика</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-paper rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-ink">{CHEMICAL_ELEMENTS.length}</div>
              <div className="text-xs text-ink-soft">Всего элементов</div>
            </div>
            <div className="bg-paper rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-ink">7</div>
              <div className="text-xs text-ink-soft">Периодов</div>
            </div>
            <div className="bg-paper rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-ink">18</div>
              <div className="text-xs text-ink-soft">Групп</div>
            </div>
            <div className="bg-paper rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-ink">{categories.length}</div>
              <div className="text-xs text-ink-soft">Категорий</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
