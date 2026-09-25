import { useEffect, useMemo, useRef, useState } from "react";
import { getStressWords, onDatabaseChange } from "../db/database";
import { shuffle } from "../lib/storage";
import { playSound } from "../lib/sound";
import WordCard from "./WordCard";
import { IconCheck, IconFlame, IconRefresh, IconX } from "./ui";

// Адаптер для совместимости с WordCard
interface WordEntry {
  id: string;
  word: string;
  stress: number;
  hint: string;
  difficulty: 1 | 2 | 3;
}

// Функция для добавления знака ударения
function withAccent(word: string, stress: number): string {
  if (stress < 0 || stress >= word.length) return word;
  return word.slice(0, stress + 1) + "\u0301" + word.slice(stress + 1);
}

const LEVELS = [
  { v: 0, label: "Все слова" },
  { v: 1, label: "Лёгкие" },
  { v: 2, label: "Средние" },
  { v: 3, label: "Сложные" },
];

interface Props {
  record: (id: string, ok: boolean) => void;
  soundOn: boolean;
}

export default function Trainer({ record, soundOn }: Props) {
  const [level, setLevel] = useState(0);
  const [words, setWords] = useState<WordEntry[]>(() => getStressWords());
  const [queue, setQueue] = useState<WordEntry[]>(() => shuffle(getStressWords()));
  const [idx, setIdx] = useState(0);
  const [session, setSession] = useState({ ok: 0, bad: 0, run: 0 });
  const [feedback, setFeedback] = useState<null | { ok: boolean }>(null);
  const [finished, setFinished] = useState(false);
  const timer = useRef<number | null>(null);

  const entry = queue[idx];

  // Подписка на изменения в базе данных
  useEffect(() => {
    return onDatabaseChange(() => {
      const newWords = getStressWords();
      setWords(newWords);
      setQueue(shuffle(newWords.filter((w) => level === 0 || w.difficulty === level)));
    });
  }, [level]);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const changeLevel = (v: number) => {
    if (timer.current) window.clearTimeout(timer.current);
    setLevel(v);
    setQueue(shuffle(words.filter((w: WordEntry) => v === 0 || w.difficulty === v)));
    setIdx(0);
    setSession({ ok: 0, bad: 0, run: 0 });
    setFeedback(null);
    setFinished(false);
  };

  const handleResult = (ok: boolean) => {
    if (!entry) return;
    record(entry.id, ok);
    setFeedback({ ok });
    playSound(ok ? "ok" : "bad", soundOn);
    setSession((s) => ({
      ok: s.ok + (ok ? 1 : 0),
      bad: s.bad + (ok ? 0 : 1),
      run: ok ? s.run + 1 : 0,
    }));
    if (ok) {
      timer.current = window.setTimeout(advance, 1000);
    }
  };

  const advance = () => {
    setFeedback(null);
    if (idx + 1 >= queue.length) {
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
    }
  };

  const total = session.ok + session.bad;
  const pct = total ? Math.round((session.ok / total) * 100) : 0;

  const progress = useMemo(() => {
    const per = Math.max(2, Math.floor(100 / Math.max(1, queue.length)));
    return Math.min(100, (idx + (feedback ? 1 : 0)) * per);
  }, [idx, feedback, queue.length]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-ink-soft">
            Нажимай на ударную гласную. Ошибёшься — покажем правильный ответ и запоминалку.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((l) => (
            <button
              key={l.v}
              onClick={() => changeLevel(l.v)}
              className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all ${
                level === l.v
                  ? "border-ink bg-ink text-card shadow-note-sm"
                  : "border-line bg-card text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {finished ? (
        <div className="anim-pop rounded-xl border-2 border-ink bg-card p-8 text-center shadow-note">
          <div
            className={`mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-ink font-display text-2xl font-black ${
              pct >= 80 ? "bg-leaf text-white" : pct >= 50 ? "bg-sun" : "bg-pen text-white"
            }`}
          >
            {pct}%
          </div>
          <h2 className="mt-4 font-display text-xl font-black">
            {pct >= 80 ? "Отличная серия!" : pct >= 50 ? "Неплохо!" : "Есть над чем поработать"}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Верно: <b className="text-leaf-deep">{session.ok}</b> · Ошибок:{" "}
            <b className="text-pen-deep">{session.bad}</b> из {queue.length} слов
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => changeLevel(level)}
              className="flex items-center gap-2 rounded-lg border-2 border-ink bg-pen px-5 py-2.5 font-display text-sm font-bold text-white shadow-note-sm transition hover:-translate-y-0.5 hover:shadow-note active:translate-y-0"
            >
              <IconRefresh /> Ещё раз
            </button>
            <button
              onClick={() => changeLevel(0)}
              className="rounded-lg border-2 border-ink bg-card px-5 py-2.5 font-display text-sm font-bold transition hover:bg-ink hover:text-card"
            >
              Все слова
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-ink bg-card p-5 shadow-note sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
              Слово {idx + 1} / {queue.length}
            </span>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="flex items-center gap-1 rounded-full border-2 border-leaf/40 bg-leaf/10 px-2.5 py-1 text-leaf-deep">
                <IconCheck className="w-3 h-3" /> {session.ok}
              </span>
              <span className="flex items-center gap-1 rounded-full border-2 border-pen/40 bg-pen/10 px-2.5 py-1 text-pen-deep">
                <IconX className="w-3 h-3" /> {session.bad}
              </span>
              <span
                className={`flex items-center gap-1 rounded-full border-2 px-2.5 py-1 ${
                  session.run >= 3
                    ? "border-ink bg-sun"
                    : "border-line bg-paper text-ink-soft"
                }`}
              >
                <IconFlame className="w-3 h-3 text-pen" /> {session.run}
              </span>
            </div>
          </div>

          <div className="mb-7 h-2 overflow-hidden rounded-full border border-line bg-paper">
            <div
              className="h-full rounded-full bg-blueink transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <WordCard key={`${entry.id}-${idx}`} entry={entry} onResult={handleResult} />

          <div className="mt-7 min-h-24">
            {feedback === null && (
              <p className="text-center text-sm text-ink-soft">
                Где падает ударение? <span className="text-ink font-semibold">Выберите гласную.</span>
              </p>
            )}
            {feedback?.ok && (
              <div className="anim-rise rounded-lg border-2 border-leaf-deep bg-leaf/10 px-4 py-3 text-center">
                <p className="font-display text-sm font-bold text-leaf-deep">
                  Верно! {withAccent(entry.word, entry.stress)}
                </p>
              </div>
            )}
            {feedback && !feedback.ok && (
              <div className="anim-rise rounded-lg border-2 border-pen-deep bg-pen/10 px-4 py-3 text-center">
                <p className="font-display text-sm font-bold text-pen-deep">
                  Ошибка! Правильно: {withAccent(entry.word, entry.stress)}
                </p>
                <p className="mt-1 text-sm italic text-ink-soft">💡 {entry.hint}</p>
                <button
                  onClick={advance}
                  className="mt-3 rounded-lg border-2 border-ink bg-ink px-6 py-2 font-display text-xs font-bold text-card shadow-note-sm transition hover:-translate-y-0.5 hover:shadow-note active:translate-y-0"
                >
                  Дальше →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
