import { useEffect, useRef, useState } from "react";
import { getStressWords } from "../db/database";
import { shuffle } from "../lib/storage";
import { playSound } from "../lib/sound";
import WordCard from "./WordCard";
import { IconCheck, IconClock, IconRefresh, IconX } from "./ui";

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

type Phase = "setup" | "run" | "done";

const COUNTS = [10, 15, 20];
const SEC_PER_WORD = 15;

interface Props {
  record: (id: string, ok: boolean) => void;
  finishExam: (score: number, total: number) => void;
  soundOn: boolean;
}

function gradeOf(pct: number): { grade: number; label: string; cls: string } {
  if (pct >= 90) return { grade: 5, label: "Отлично!", cls: "bg-leaf text-white border-leaf-deep" };
  if (pct >= 70) return { grade: 4, label: "Хорошо", cls: "bg-blueink text-white border-ink" };
  if (pct >= 50) return { grade: 3, label: "Сдано… на троечку", cls: "bg-sun text-ink border-ink" };
  return { grade: 2, label: "Нужна тренировка", cls: "bg-pen text-white border-pen-deep" };
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function burst() {
  const colors = ["#d9362e", "#2456a6", "#ffd43b", "#2f9e44", "#1b2a44"];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("span");
    const size = 6 + Math.random() * 8;
    el.style.cssText = `position:fixed;left:50%;top:60%;width:${size}px;height:${size * 0.45}px;background:${
      colors[i % colors.length]
    };z-index:60;pointer-events:none;border-radius:2px;`;
    document.body.appendChild(el);
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 260;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 160;
    const rot = (Math.random() - 0.5) * 720;
    el.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy + 320}px) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 700, easing: "cubic-bezier(.15,.6,.3,1)" },
    ).onfinish = () => el.remove();
  }
}

export default function Exam({ record, finishExam, soundOn }: Props) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<WordEntry[]>([]);
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [missed, setMissed] = useState<WordEntry[]>([]);
  const [score, setScore] = useState(0);
  const advanceTimer = useRef<number | null>(null);
  const finishedRef = useRef(false);

  const entry = questions[idx];

  useEffect(
    () => () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    },
    [],
  );

  const start = (n: number) => {
    finishedRef.current = false;
    setCount(n);
    setQuestions(shuffle(getStressWords()).slice(0, n));
    setIdx(0);
    setMissed([]);
    setScore(0);
    setTimeLeft(n * SEC_PER_WORD);
    setPhase("run");
    playSound("start", soundOn);
  };

  useEffect(() => {
    if (phase !== "run") return;
    const t = window.setInterval(() => {
      setTimeLeft((v) => Math.max(0, v - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [phase]);

  const finish = (finalScore: number, finalMissed: WordEntry[]) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    setPhase("done");
    setScore(finalScore);
    setMissed(finalMissed);
    finishExam(finalScore, count);
    const pct = (finalScore / count) * 100;
    if (pct >= 70) {
      playSound("win", soundOn);
      burst();
    }
  };

  useEffect(() => {
    if (phase === "run" && timeLeft === 0) {
      const from = advanceTimer.current ? idx + 1 : idx;
      finish(score, missed.concat(questions.slice(from)));
    }
  }, [timeLeft, phase]);

  const handleResult = (ok: boolean) => {
    if (!entry) return;
    record(entry.id, ok);
    const newScore = score + (ok ? 1 : 0);
    const newMissed = ok ? missed : [...missed, entry];
    setScore(newScore);
    setMissed(newMissed);
    playSound(ok ? "ok" : "bad", soundOn);
    advanceTimer.current = window.setTimeout(() => {
      if (idx + 1 >= count) {
        finish(newScore, newMissed);
      } else {
        setIdx((i) => i + 1);
      }
    }, 850);
  };

  if (phase === "setup") {
    return (
      <div>
        <p className="mt-1 max-w-md text-sm text-ink-soft">
          Как в школе: вопросы, время и оценка по пятибалльной шкале. Подсказок не будет.
        </p>
        <div className="mt-6 rounded-xl border-2 border-ink bg-card p-6 shadow-note sm:p-8">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
            Сколько вопросов?
          </p>
          <div className="mt-3 flex gap-2.5">
            {COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`rounded-lg border-2 px-5 py-3 font-display text-lg font-black transition-all ${
                  count === n
                    ? "border-ink bg-ink text-card shadow-note-sm"
                    : "border-line bg-paper text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <ul className="mt-6 space-y-2 border-t-2 border-dashed border-line pt-5 text-sm text-ink-soft">
            <li className="flex items-center gap-2.5">
              <IconClock className="h-4 w-4 shrink-0 text-blueink" />
              Время: {fmt(count * SEC_PER_WORD)} ({SEC_PER_WORD} сек на слово)
            </li>
            <li className="flex items-center gap-2.5">
              <IconX className="h-4 w-4 shrink-0 text-pen" />
              Без подсказок и запоминалок
            </li>
            <li className="flex items-center gap-2.5">
              <IconCheck className="h-4 w-4 shrink-0 text-leaf" />
              Оценка: «5» за 90%+, «4» за 70%+, «3» за 50%+
            </li>
          </ul>

          <button
            onClick={() => start(count)}
            className="mt-7 w-full rounded-lg border-2 border-ink bg-pen py-3.5 font-display text-base font-black text-white shadow-note transition hover:-translate-y-0.5 hover:shadow-note-sun active:translate-y-0 active:shadow-none sm:text-lg"
          >
            Начать экзамен →
          </button>
        </div>
      </div>
    );
  }

  if (phase === "run" && entry) {
    const urgent = timeLeft <= 10;
    return (
      <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
            Вопрос {idx + 1} / {count}
          </span>
          <span
            className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 font-display text-sm font-black ${
              urgent ? "anim-blink border-pen-deep bg-pen text-white" : "border-ink bg-sun"
            }`}
          >
            <IconClock className="h-4 w-4" />
            {fmt(timeLeft)}
          </span>
        </div>
        <div className="mb-6 h-2 overflow-hidden rounded-full border border-line bg-card">
          <div
            className={`h-full rounded-full transition-all duration-500 ${urgent ? "bg-pen" : "bg-blueink"}`}
            style={{ width: `${Math.min(100, ((idx + 1) / count) * 100)}%` }}
          />
        </div>
        <div className="rounded-xl border-2 border-ink bg-card p-5 shadow-note sm:p-8">
          <WordCard key={`${entry.id}-${idx}`} entry={entry} onResult={handleResult} />
          <p className="mt-7 text-center text-sm text-ink-soft">
            Счёт: <b className="text-leaf-deep">{score}</b> верно ·{" "}
            <b className="text-pen-deep">{missed.length}</b> ошибок
          </p>
        </div>
      </div>
    );
  }

  const pct = count ? Math.round((score / count) * 100) : 0;
  const g = gradeOf(pct);
  return (
    <div>
      <div className="rounded-xl border-2 border-ink bg-card p-6 text-center shadow-note sm:p-10">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
          Ваша оценка
        </p>
        <div
          className={`anim-pop mx-auto mt-4 grid h-28 w-28 place-items-center rounded-full border-4 font-display text-6xl font-black shadow-note ${g.cls}`}
        >
          {g.grade}
        </div>
        <h2 className="mt-4 font-display text-2xl font-black">{g.label}</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Правильных ответов: <b className="text-ink">{score}</b> из {count} · точность {pct}%
        </p>

        {missed.length > 0 ? (
          <div className="mt-7 border-t-2 border-dashed border-line pt-5 text-left">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-pen-deep">
              Повторите эти слова
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {missed.map((w) => (
                <li
                  key={w.id}
                  className="flex items-baseline justify-between gap-2 rounded-lg border-2 border-line bg-paper px-3.5 py-2.5"
                >
                  <span className="font-display text-base font-bold">
                    {withAccent(w.word, w.stress)}
                  </span>
                  <span className="text-right text-xs italic text-ink-soft">{w.hint}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-6 inline-block rounded-full border-2 border-leaf-deep bg-leaf/10 px-4 py-2 text-sm font-bold text-leaf-deep">
            Без единой ошибки! Браво!
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => start(count)}
            className="flex items-center gap-2 rounded-lg border-2 border-ink bg-pen px-5 py-2.5 font-display text-sm font-bold text-white shadow-note-sm transition hover:-translate-y-0.5 hover:shadow-note active:translate-y-0"
          >
            <IconRefresh /> Пересдать
          </button>
          <button
            onClick={() => setPhase("setup")}
            className="rounded-lg border-2 border-ink bg-card px-5 py-2.5 font-display text-sm font-bold transition hover:bg-ink hover:text-card"
          >
            Новый экзамен
          </button>
        </div>
      </div>
    </div>
  );
}
