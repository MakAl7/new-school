import { useEffect, useMemo, useState } from "react";
import { getStressWords, getVocabWords, onDatabaseChange } from "../db/database";
import { isLearned, type AppState } from "../lib/storage";
import { IconFlame, IconRefresh, IconTrash } from "./ui";
import { Modal, Ring } from "./ui";

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const CLASS_LABEL: Record<number, string> = {
  1: "1 класс", 2: "2 класс", 3: "3 класс", 4: "4 класс", 5: "5 класс",
  6: "6 класс", 7: "7 класс", 8: "8 класс", 9: "9 класс", 10: "10 класс", 11: "11 класс",
};
const CLASS_COLORS: Record<number, { chip: string; bar: string }> = {
  1: { chip: "bg-pen text-white", bar: "bg-pen" },
  2: { chip: "bg-blueink text-white", bar: "bg-blueink" },
  3: { chip: "bg-leaf text-white", bar: "bg-leaf" },
  4: { chip: "bg-ink text-card", bar: "bg-ink" },
  5: { chip: "bg-pen-deep text-white", bar: "bg-pen-deep" },
  6: { chip: "bg-leaf-deep text-white", bar: "bg-leaf-deep" },
  7: { chip: "bg-sun text-ink", bar: "bg-sun" },
  8: { chip: "bg-pen text-white", bar: "bg-pen" },
  9: { chip: "bg-blueink text-white", bar: "bg-blueink" },
  10: { chip: "bg-leaf text-white", bar: "bg-leaf" },
  11: { chip: "bg-ink text-card", bar: "bg-ink" },
};

function withAccent(word: string, stress: number): string {
  if (stress < 0 || stress >= word.length) return word;
  return word.slice(0, stress + 1) + "\u0301" + word.slice(stress + 1);
}

interface Props {
  state: AppState;
  onReset: () => void;
}

const GRADE_COLOR: Record<number, string> = {
  5: "bg-leaf text-white",
  4: "bg-blueink text-white",
  3: "bg-sun text-ink",
  2: "bg-pen text-white",
};

const gradeOf = (score: number, total: number) => {
  const pct = total ? (score / total) * 100 : 0;
  if (pct >= 90) return 5;
  if (pct >= 70) return 4;
  if (pct >= 50) return 3;
  return 2;
};

export default function Progress({ state, onReset }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [stressWords, setStressWords] = useState<any[]>([]);
  const [vocabWords, setVocabWords] = useState<any[]>([]);

  useEffect(() => {
    setStressWords(getStressWords());
    setVocabWords(getVocabWords());
    return onDatabaseChange(() => {
      setStressWords(getStressWords());
      setVocabWords(getVocabWords());
    });
  }, []);

  const m = useMemo(() => {
    let attempts = 0;
    let errors = 0;
    for (const s of Object.values(state.stats)) {
      attempts += s.a;
      errors += s.e;
    }
    const learned = stressWords.filter((w: any) => isLearned(state, w.id)).length;
    const mistakes = stressWords.map((w: any) => ({ w, s: state.stats[w.id] }))
      .filter((x: any) => x.s && x.s.e > 0)
      .sort((a: any, b: any) => b.s!.e - a.s!.e || a.w.difficulty - b.w.difficulty)
      .slice(0, 6);
    return {
      attempts,
      errors,
      accuracy: attempts ? Math.round(((attempts - errors) / attempts) * 100) : null,
      learned,
      mistakes,
    };
  }, [state, stressWords]);

    const vocabByClass = CLASSES.map((c) => {
      const words = vocabWords.filter((v: any) => v.class === c);
      const learned = words.filter((w: any) => isLearned(state, w.id)).length;
      return { c, total: words.length, learned };
    });  const vocabLearned = vocabByClass.reduce((s, x) => s + x.learned, 0);

  return (
    <section className="anim-rise">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
            Ваш прогресс
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Статистика хранится на этом устройстве — даже офлайн. Перенести на другой телефон
            можно через QR-код.
          </p>
        </div>
        <button
          onClick={() => setConfirming(true)}
          className="flex items-center gap-2 rounded-lg border-2 border-line bg-card px-3.5 py-2 text-xs font-bold text-ink-soft transition hover:border-pen-deep hover:bg-pen/10 hover:text-pen-deep"
        >
          <IconTrash /> Сбросить прогресс
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-5 rounded-xl border-2 border-ink bg-card p-5 shadow-note">
          <div className="relative shrink-0">
            <Ring value={m.learned / stressWords.length} />
            <span className="absolute inset-0 grid place-items-center font-display text-lg font-black">
              {m.learned}
            </span>
          </div>
          <div>
            <p className="font-display text-base font-black">
              Ударения: {m.learned} из {stressWords.length}
            </p>
            <p className="mt-1 text-sm leading-snug text-ink-soft">
              Слово считается выученным после 2 верных ответов подряд — или по вашей отметке
              звездой в словаре.
            </p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-ink bg-card p-5 shadow-note">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
            Точность ответов
          </p>
          <p className="mt-2 font-display text-4xl font-black">
            {m.accuracy === null ? "—" : `${m.accuracy}%`}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {m.attempts === 0 ? (
              "Начните тренировку — здесь появится статистика."
            ) : (
              <>
                {m.attempts - m.errors} верных из {m.attempts} ·{" "}
                <b className="text-pen-deep">{m.errors} ошибок</b>
              </>
            )}
          </p>
        </div>

        <div className="rounded-xl border-2 border-ink bg-card p-5 shadow-note">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
            Серия занятий
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-sun shadow-note-sm">
              <IconFlame className="h-6 w-6 text-pen" />
            </span>
            <p className="font-display text-3xl font-black">{state.streak} дн.</p>
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            Рекорд серии: <b className="text-ink">{state.best} дн.</b> Занимайтесь каждый день!
          </p>
        </div>

        <div className="rounded-xl border-2 border-ink bg-card p-5 shadow-note">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
            Экзамены
          </p>
          {state.history.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">
              Вы ещё не сдавали экзамен. Решитесь — это не страшно!
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {state.history.slice(0, 4).map((h, i) => {
                const g = gradeOf(h.score, h.total);
                return (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink font-display text-xs font-black ${GRADE_COLOR[g]}`}
                    >
                      {g}
                    </span>
                    <span className="font-medium">
                      {h.score} из {h.total}
                    </span>
                    <span className="ml-auto text-xs text-ink-soft">
                      {new Date(h.date).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-xl border-2 border-ink bg-card p-5 shadow-note sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-blueink">
            Словарные слова по классам
          </p>
          <p className="text-sm font-bold text-ink-soft">
            выучено {vocabLearned} из {vocabWords.length}
          </p>
        </div>
        <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {vocabByClass.map(({ c, total, learned }) => (
            <li key={c}>
              <div className="flex items-baseline justify-between text-xs font-bold">
                <span>{CLASS_LABEL[c]}</span>
                <span className="text-ink-soft">
                  {learned}/{total}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full border border-line bg-paper">
                <div
                  className={`h-full rounded-full ${CLASS_COLORS[c].bar} transition-all duration-700`}
                  style={{ width: `${total ? (learned / total) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {m.mistakes.length > 0 && (
        <div className="mt-5 rounded-xl border-2 border-ink bg-card p-5 shadow-note sm:p-6">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-pen-deep">
            Самые коварные слова
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {m.mistakes.map(({ w, s }) => (
              <li
                key={w.id}
                className="flex items-center justify-between gap-3 rounded-lg border-2 border-line bg-paper px-3.5 py-2.5 transition hover:border-pen/60"
              >
                <span className="font-display text-base font-bold">
                  {withAccent(w.word, w.stress)}
                </span>
                <span className="rounded-full bg-pen/10 px-2.5 py-1 text-[11px] font-bold text-pen-deep">
                  {s!.e} из {s!.a} — мимо
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal open={confirming} onClose={() => setConfirming(false)}>
        <h2 className="font-display text-lg font-black">Стереть весь прогресс?</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Статистика, серия занятий, отметки «выучено» и история экзаменов будут удалены без
          возможности восстановления.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => {
              onReset();
              setConfirming(false);
            }}
            className="flex items-center gap-2 rounded-lg border-2 border-ink bg-pen px-4 py-2.5 font-display text-xs font-bold text-white shadow-note-sm transition hover:-translate-y-0.5 active:translate-y-0"
          >
            <IconRefresh /> Да, стереть
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="rounded-lg border-2 border-ink bg-card px-4 py-2.5 font-display text-xs font-bold transition hover:bg-ink hover:text-card"
          >
            Оставить
          </button>
        </div>
      </Modal>
    </section>
  );
}
