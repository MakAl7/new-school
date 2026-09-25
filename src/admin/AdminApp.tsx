import { useState, useEffect } from "react";
import {
  getStressWords,
  getVocabWords,
  addStressWord,
  updateStressWord,
  deleteStressWord,
  addVocabWord,
  updateVocabWord,
  deleteVocabWord,
  resetDatabase,
  onDatabaseChange,
  getDBStats,
  type StressWord,
  type VocabWord,
} from "../db/database";

const ADMIN_PASSWORD = "admin123";

export default function AdminApp() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      setError("");
    } else {
      setError("Неверный пароль");
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border-2 border-ink rounded-xl p-8 shadow-note">
          <div className="text-center mb-6">
            <div className="inline-grid place-items-center w-16 h-16 bg-ink rounded-lg mb-4">
              <span className="text-card font-display text-2xl font-black">
                А<span className="text-pen">´</span>
              </span>
            </div>
            <h1 className="font-display text-2xl font-black text-ink">Админ-панель</h1>
            <p className="text-sm text-ink-soft mt-2">Введите пароль для доступа</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Пароль"
            className="w-full border-2 border-line rounded-lg px-4 py-3 mb-3 focus:border-ink outline-none"
          />
          {error && <p className="text-pen text-sm mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-ink text-card font-display font-bold py-3 rounded-lg hover:bg-pen transition"
          >
            Войти
          </button>
          <p className="text-xs text-ink-soft mt-4 text-center">
            Пароль по умолчанию: <code className="bg-paper px-2 py-0.5 rounded">admin123</code>
          </p>
        </div>
      </div>
    );
  }

  return <AdminPanel onLogout={() => setIsAuth(false)} />;
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"stress" | "vocab">("stress");
  const [stressWords, setStressWords] = useState<StressWord[]>([]);
  const [vocabWords, setVocabWords] = useState<VocabWord[]>([]);
  const [stats, setStats] = useState(getDBStats());

  useEffect(() => {
    const loadData = () => {
      setStressWords(getStressWords());
      setVocabWords(getVocabWords());
      setStats(getDBStats());
    };
    loadData();
    return onDatabaseChange(loadData);
  }, []);

  const handleReset = () => {
    if (confirm("Сбросить базу данных к начальным значениям?")) {
      resetDatabase();
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink text-card p-4 shadow-note">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-grid place-items-center w-12 h-12 bg-card rounded-lg">
              <span className="text-ink font-display text-xl font-black">
                А<span className="text-pen">´</span>
              </span>
            </div>
            <div>
              <h1 className="font-display text-xl font-black">Админ-панель</h1>
              <p className="text-xs text-paper/70">Управление базой данных</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-xs">
              <div>Ударений: <b>{stats.stressCount}</b></div>
              <div>Словарных: <b>{stats.vocabCount}</b></div>
              <div>Версия БД: <b>{stats.version}</b></div>
            </div>
            <button
              onClick={handleReset}
              className="bg-pen text-white px-4 py-2 rounded-lg font-display text-sm font-bold hover:bg-pen-deep"
            >
              Сбросить БД
            </button>
            <button
              onClick={onLogout}
              className="bg-card text-ink px-4 py-2 rounded-lg font-display text-sm font-bold hover:bg-paper"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-card border-b-2 border-ink">
        <div className="max-w-7xl mx-auto flex gap-2 p-4">
          <button
            onClick={() => setTab("stress")}
            className={`px-6 py-3 rounded-lg font-display font-bold transition ${
              tab === "stress" ? "bg-ink text-card" : "bg-paper text-ink hover:bg-line"
            }`}
          >
            Ударения ({stressWords.length})
          </button>
          <button
            onClick={() => setTab("vocab")}
            className={`px-6 py-3 rounded-lg font-display font-bold transition ${
              tab === "vocab" ? "bg-ink text-card" : "bg-paper text-ink hover:bg-line"
            }`}
          >
            Словарные слова ({vocabWords.length})
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4">
        {tab === "stress" ? (
          <StressWordsEditor words={stressWords} onChange={() => setStressWords(getStressWords())} />
        ) : (
          <VocabWordsEditor words={vocabWords} onChange={() => setVocabWords(getVocabWords())} />
        )}
      </main>
    </div>
  );
}

function StressWordsEditor({ words, onChange }: { words: StressWord[]; onChange: () => void }) {
  const [editing, setEditing] = useState<StressWord | null>(null);
  const [filter, setFilter] = useState("");

  const filtered = words.filter(
    (w) =>
      w.word.toLowerCase().includes(filter.toLowerCase()) ||
      w.hint.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => {
    setEditing({
      id: "",
      word: "",
      stress: 0,
      hint: "",
      difficulty: 1,
    });
  };

  const handleSave = () => {
    if (!editing) return;
    if (!editing.word || editing.stress < 0) {
      alert("Заполните все поля");
      return;
    }
    if (editing.id) {
      updateStressWord(editing.id, editing);
    } else {
      addStressWord(editing);
    }
    setEditing(null);
    onChange();
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить слово?")) {
      deleteStressWord(id);
      onChange();
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Поиск..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 border-2 border-line rounded-lg px-4 py-2 focus:border-ink outline-none"
        />
        <button
          onClick={handleAdd}
          className="bg-leaf text-white px-6 py-2 rounded-lg font-display font-bold hover:bg-leaf-deep"
        >
          + Добавить
        </button>
      </div>

      {editing && (
        <div className="bg-card border-2 border-ink rounded-xl p-6 mb-4 shadow-note">
          <h3 className="font-display text-lg font-black mb-4">
            {editing.id ? "Редактирование" : "Новое слово"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Слово</label>
              <input
                type="text"
                value={editing.word}
                onChange={(e) => setEditing({ ...editing, word: e.target.value })}
                className="w-full border-2 border-line rounded-lg px-3 py-2 focus:border-ink outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Ударная гласная (индекс)</label>
              <input
                type="number"
                value={editing.stress}
                onChange={(e) => setEditing({ ...editing, stress: parseInt(e.target.value) || 0 })}
                className="w-full border-2 border-line rounded-lg px-3 py-2 focus:border-ink outline-none"
              />
              <p className="text-xs text-ink-soft mt-1">
                Позиция ударной гласной (0-based). Слово: "{editing.word}" → ударение на букве "{editing.word[editing.stress] || "?"}"
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Подсказка</label>
              <input
                type="text"
                value={editing.hint}
                onChange={(e) => setEditing({ ...editing, hint: e.target.value })}
                className="w-full border-2 border-line rounded-lg px-3 py-2 focus:border-ink outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Сложность</label>
              <select
                value={editing.difficulty}
                onChange={(e) => setEditing({ ...editing, difficulty: parseInt(e.target.value) as 1 | 2 | 3 })}
                className="w-full border-2 border-line rounded-lg px-3 py-2 focus:border-ink outline-none"
              >
                <option value={1}>1 - Лёгкое</option>
                <option value={2}>2 - Среднее</option>
                <option value={3}>3 - Сложное</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="bg-leaf text-white px-6 py-2 rounded-lg font-display font-bold hover:bg-leaf-deep"
            >
              Сохранить
            </button>
            <button
              onClick={() => setEditing(null)}
              className="bg-card border-2 border-ink px-6 py-2 rounded-lg font-display font-bold hover:bg-paper"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="bg-card border-2 border-ink rounded-xl overflow-hidden shadow-note">
        <table className="w-full">
          <thead className="bg-ink text-card">
            <tr>
              <th className="text-left p-3 font-display">ID</th>
              <th className="text-left p-3 font-display">Слово</th>
              <th className="text-left p-3 font-display">Ударная гласная</th>
              <th className="text-left p-3 font-display">Подсказка</th>
              <th className="text-left p-3 font-display">Сложность</th>
              <th className="text-right p-3 font-display">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w.id} className="border-t border-line hover:bg-paper/50">
                <td className="p-3 text-xs text-ink-soft">{w.id}</td>
                <td className="p-3 font-bold">{w.word}</td>
                <td className="p-3">
                  <span className="bg-sun px-2 py-1 rounded text-xs font-bold">
                    {w.stress} → "{w.word[w.stress] || "?"}"
                  </span>
                </td>
                <td className="p-3 text-sm text-ink-soft">{w.hint}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    w.difficulty === 1 ? "bg-leaf/20 text-leaf-deep" :
                    w.difficulty === 2 ? "bg-sun/40 text-ink" :
                    "bg-pen/20 text-pen-deep"
                  }`}>
                    {w.difficulty}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setEditing({ ...w })}
                    className="bg-blueink text-white px-3 py-1 rounded text-xs font-bold hover:bg-blueink/80 mr-2"
                  >
                    ✏️ Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="bg-pen text-white px-3 py-1 rounded text-xs font-bold hover:bg-pen-deep"
                  >
                    🗑️ Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VocabWordsEditor({ words, onChange }: { words: VocabWord[]; onChange: () => void }) {
  const [editing, setEditing] = useState<VocabWord | null>(null);
  const [filter, setFilter] = useState("");
  const [classFilter, setClassFilter] = useState(0);

  const filtered = words.filter((w) => {
    const matchText =
      w.word.toLowerCase().includes(filter.toLowerCase()) ||
      w.hint.toLowerCase().includes(filter.toLowerCase());
    const matchClass = classFilter === 0 || w.class === classFilter;
    return matchText && matchClass;
  });

  const handleAdd = () => {
    setEditing({
      id: "",
      word: "",
      missing: "",
      options: ["", "", ""],
      hint: "",
      class: 1,
      emoji: "",
    });
  };

  const handleSave = () => {
    if (!editing) return;
    if (!editing.word || !editing.missing) {
      alert("Заполните слово и проверяемую букву");
      return;
    }
    if (editing.id) {
      updateVocabWord(editing.id, editing);
    } else {
      addVocabWord(editing);
    }
    setEditing(null);
    onChange();
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить слово?")) {
      deleteVocabWord(id);
      onChange();
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Поиск..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 border-2 border-line rounded-lg px-4 py-2 focus:border-ink outline-none"
        />
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(parseInt(e.target.value))}
          className="border-2 border-line rounded-lg px-4 py-2 focus:border-ink outline-none"
        >
          <option value={0}>Все классы</option>
          {Array.from({ length: 11 }, (_, i) => i + 1).map((c) => (
            <option key={c} value={c}>{c} класс</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="bg-leaf text-white px-6 py-2 rounded-lg font-display font-bold hover:bg-leaf-deep"
        >
          + Добавить
        </button>
      </div>

      {editing && (
        <div className="bg-card border-2 border-ink rounded-xl p-6 mb-4 shadow-note">
          <h3 className="font-display text-lg font-black mb-4">
            {editing.id ? "Редактирование" : "Новое слово"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Слово</label>
              <input
                type="text"
                value={editing.word}
                onChange={(e) => setEditing({ ...editing, word: e.target.value })}
                className="w-full border-2 border-line rounded-lg px-3 py-2 focus:border-ink outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Проверяемая буква</label>
              <input
                type="text"
                value={editing.missing}
                onChange={(e) => setEditing({ ...editing, missing: e.target.value })}
                className="w-full border-2 border-line rounded-lg px-3 py-2 focus:border-ink outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-1">Варианты ответа (через запятую)</label>
              <input
                type="text"
                value={editing.options.join(", ")}
                onChange={(e) => setEditing({ ...editing, options: e.target.value.split(",").map(s => s.trim()) })}
                className="w-full border-2 border-line rounded-lg px-3 py-2 focus:border-ink outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Класс</label>
              <select
                value={editing.class}
                onChange={(e) => setEditing({ ...editing, class: parseInt(e.target.value) })}
                className="w-full border-2 border-line rounded-lg px-3 py-2 focus:border-ink outline-none"
              >
                {Array.from({ length: 11 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>{c} класс</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Эмодзи</label>
              <input
                type="text"
                value={editing.emoji || ""}
                onChange={(e) => setEditing({ ...editing, emoji: e.target.value })}
                className="w-full border-2 border-line rounded-lg px-3 py-2 focus:border-ink outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-1">Подсказка</label>
              <input
                type="text"
                value={editing.hint}
                onChange={(e) => setEditing({ ...editing, hint: e.target.value })}
                className="w-full border-2 border-line rounded-lg px-3 py-2 focus:border-ink outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="bg-leaf text-white px-6 py-2 rounded-lg font-display font-bold hover:bg-leaf-deep"
            >
              Сохранить
            </button>
            <button
              onClick={() => setEditing(null)}
              className="bg-card border-2 border-ink px-6 py-2 rounded-lg font-display font-bold hover:bg-paper"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="bg-card border-2 border-ink rounded-xl overflow-hidden shadow-note">
        <table className="w-full">
          <thead className="bg-ink text-card">
            <tr>
              <th className="text-left p-3 font-display">ID</th>
              <th className="text-left p-3 font-display">Слово</th>
              <th className="text-left p-3 font-display">Проверяемая</th>
              <th className="text-left p-3 font-display">Варианты</th>
              <th className="text-left p-3 font-display">Класс</th>
              <th className="text-left p-3 font-display">Эмодзи</th>
              <th className="text-right p-3 font-display">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w.id} className="border-t border-line hover:bg-paper/50">
                <td className="p-3 text-xs text-ink-soft">{w.id}</td>
                <td className="p-3 font-bold">{w.word}</td>
                <td className="p-3">
                  <span className="bg-sun px-2 py-1 rounded text-xs font-bold">
                    {w.missing}
                  </span>
                </td>
                <td className="p-3 text-sm">{w.options.join(", ")}</td>
                <td className="p-3">
                  <span className="bg-blueink/20 text-blueink px-2 py-1 rounded text-xs font-bold">
                    {w.class} кл.
                  </span>
                </td>
                <td className="p-3 text-2xl">{w.emoji || ""}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setEditing({ ...w })}
                    className="bg-blueink text-white px-3 py-1 rounded text-xs font-bold hover:bg-blueink/80 mr-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="bg-pen text-white px-3 py-1 rounded text-xs font-bold hover:bg-pen-deep"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
