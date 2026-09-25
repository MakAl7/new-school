import { useEffect, useMemo, useState } from "react";
import { getStressWords, onDatabaseChange } from "../db/database";
import { isLearned, type AppState } from "../lib/storage";
import { IconSearch, IconStar } from "./ui";
import ReportError from "./ReportError";

interface WordEntry {
  id: string;
  word: string;
  stress: number;
  pronunciation?: string;
  hint: string;
  difficulty: 1 | 2 | 3;
}

function withAccent(word: string, stress: number): string {
  if (stress < 0 || stress >= word.length) return word;
  return word.slice(0, stress + 1) + "\u0301" + word.slice(stress + 1);
}

// Функция озвучивания текста
function speak(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
}

interface Props {
  state: AppState;
  toggleLearned: (id: string) => void;
}

const DIFF_LABEL: Record<number, string> = { 1: "лёгкое", 2: "среднее", 3: "сложное" };
const DIFF_CLS: Record<number, string> = {
  1: "bg-leaf/15 text-leaf-deep border-leaf/40",
  2: "bg-sun/40 text-ink border-ink/25",
  3: "bg-pen/10 text-pen-deep border-pen/40",
};

export default function Dictionary({ state, toggleLearned }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "todo" | "learned">("all");
  const [diff, setDiff] = useState(0);
  const [reportWord, setReportWord] = useState<string | null>(null);
  const [words, setWords] = useState<WordEntry[]>([]);

  useEffect(() => {
    setWords(getStressWords());
    return onDatabaseChange(() => setWords(getStressWords()));
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return words.filter((w: WordEntry) => {
      if (q && !w.word.includes(q)) return false;
      if (diff && w.difficulty !== diff) return false;
      const learned = isLearned(state, w.id);
      if (filter === "learned" && !learned) return false;
      if (filter === "todo" && learned) return false;
      return true;
    });
  }, [query, filter, diff, state, words]);

  return (
    <section className="anim-rise">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
          Словарь ударе́ний
        </h1>
        <p className="mt-1 max-w-lg text-sm text-ink-soft">
          Все {words.length} слов тренажёра с подсказками-запоминалками. Отмечайте выученные
          звездой — они попадут в прогресс.
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-xl border-2 border-ink bg-card p-4 shadow-note sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти слово…"
            className="w-full rounded-lg border-2 border-line bg-paper py-2.5 pl-9 pr-3 text-sm font-medium outline-none transition focus:border-ink"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: "all", label: "Все" },
              { id: "todo", label: "Не выучено" },
              { id: "learned", label: "Выучено" },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all ${
                filter === f.id
                  ? "border-ink bg-ink text-card"
                  : "border-line bg-card text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((d) => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              aria-label={d === 0 ? "Любая сложность" : `Сложность ${d}`}
              className={`h-9 w-9 rounded-full border-2 font-display text-xs font-black transition-all ${
                diff === d
                  ? "border-ink bg-pen text-white"
                  : "border-line bg-card text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {d === 0 ? "∗" : d}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-soft">
        Найдено: {list.length}
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((w: WordEntry, i) => {
          const learned = isLearned(state, w.id);
          const st = state.stats[w.id];
          return (
            <li
              key={w.id}
              className="anim-rise group flex items-start gap-3 rounded-xl border-2 border-ink bg-card p-4 shadow-note-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-note"
              style={{ animationDelay: `${Math.min(i * 25, 350)}ms` }}
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-black leading-tight">
                  {withAccent(w.word, w.stress)}
                </p>
                {w.pronunciation && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-xs text-blueink bg-paper px-2 py-0.5 rounded border border-line">
                      [{w.pronunciation}]
                    </span>
                    <button
                      onClick={() => speak(w.word)}
                      className="text-blueink hover:text-blueink/80 transition-colors"
                      title="Озвучить"
                    >
                      🔊
                    </button>
                  </div>
                )}
                <p className="mt-1 truncate text-xs italic text-ink-soft" title={w.hint}>
                  💡 {w.hint}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${DIFF_CLS[w.difficulty]}`}
                  >
                    {DIFF_LABEL[w.difficulty]}
                  </span>
                  {st && st.a > 0 && (
                    <span className="rounded-full border border-line bg-paper px-2 py-0.5 text-[10px] font-bold text-ink-soft">
                      {st.a - st.e}/{st.a} верно
                    </span>
                  )}
                  {learned && (
                    <span className="rounded-full border border-leaf/40 bg-leaf/10 px-2 py-0.5 text-[10px] font-bold text-leaf-deep">
                      выучено
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => toggleLearned(w.id)}
                  className={`rounded-md p-1.5 transition-all hover:scale-125 ${
                    learned ? "text-sun" : "text-line hover:text-ink-soft"
                  }`}
                  aria-label={learned ? "Убрать из выученных" : "Отметить выученным"}
                  title={learned ? "Выучено — нажмите, чтобы снять" : "Отметить выученным"}
                >
                  <IconStar className="h-5 w-5" filled={learned} />
                </button>
                <button
                  onClick={() => setReportWord(w.word)}
                  className="flex items-center gap-1 rounded-lg border-2 border-pen/30 bg-pen/5 px-2 py-1 text-xs font-bold text-pen transition-all hover:border-pen hover:bg-pen/10 hover:scale-105"
                  aria-label="Сообщить об ошибке"
                  title="Сообщить об ошибке в этом слове"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Ошибка</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {list.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-line bg-card/60 p-10 text-center">
          <p className="font-display text-lg font-bold text-ink-soft">Ничего не нашлось</p>
          <p className="mt-1 text-sm text-ink-soft">
            Попробуйте другой запрос или сбросьте фильтры.
          </p>
        </div>
      )}
      
      {reportWord && (
        <ReportError word={reportWord} onClose={() => setReportWord(null)} />
      )}
    </section>
  );
}
