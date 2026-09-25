import { useEffect, useState } from "react";
import { getVocabWords, onDatabaseChange } from "../db/database";
import { isLearned, shuffle, type AppState } from "../lib/storage";
import { playSound } from "../lib/sound";
import { IconBook, IconCheck, IconClock, IconRefresh, IconStar, IconX } from "./ui";

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

interface VocabWord {
  id: string;
  word: string;
  missing: string;
  options: string[];
  hint: string;
  class: number;
  emoji?: string;
}

interface Props {
  state: AppState;
  record: (id: string, ok: boolean) => void;
  toggleLearned: (id: string) => void;
  soundOn: boolean;
}

function Tile({ ch, blank, weak }: { ch: string; blank?: boolean; weak?: boolean }) {
  return (
    <span
      className={[
        "inline-grid h-12 w-10 place-items-center rounded-md border-2 font-display text-xl font-bold sm:h-14 sm:w-11 sm:text-2xl",
        blank
          ? "border-pen-deep border-dashed bg-pen/10 text-pen-deep"
          : weak
            ? "border-ink bg-ink text-sun"
            : "border-ink bg-paper text-ink",
      ].join(" ")}
    >
      {ch}
    </span>
  );
}

function LearnMode({
  queue,
  isLearnedId,
  toggleLearned,
  soundOn,
}: {
  queue: VocabWord[];
  isLearnedId: (id: string) => boolean;
  toggleLearned: (id: string) => void;
  soundOn: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [session, setSession] = useState({ ok: 0, bad: 0 });
  const entry = queue[idx];

  useEffect(() => {
    setFlipped(false);
  }, [idx, queue]);

  if (!entry) return null;

  const wordParts = entry.word.split(entry.missing);
  const pre = wordParts[0] || "";
  const post = wordParts[1] || "";
  const known = isLearnedId(entry.id);

  const mark = (ok: boolean) => {
    playSound(ok ? "ok" : "bad", soundOn);
    setSession((s) => ({ ok: s.ok + (ok ? 1 : 0), bad: s.bad + (ok ? 0 : 1) }));
    if (idx + 1 >= queue.length) {
      setIdx(0);
      setSession({ ok: 0, bad: 0 });
    } else {
      setIdx((i) => i + 1);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <span className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
          Карточка {idx + 1} / {queue.length} {entry.emoji && <span className="text-2xl">{entry.emoji}</span>}
        </span>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="flex items-center gap-1 rounded-full border-2 border-leaf/40 bg-leaf/10 px-2.5 py-1 text-leaf-deep">
            <IconCheck className="h-3 w-3" /> {session.ok}
          </span>
          <span className="flex items-center gap-1 rounded-full border-2 border-pen/40 bg-pen/10 px-2.5 py-1 text-pen-deep">
            <IconX className="h-3 w-3" /> {session.bad}
          </span>
        </div>
      </div>

      <div className={`flip ${flipped ? "flipped" : ""}`}>
        <div className="flip-inner">
          <div className="flip-face relative rounded-xl border-2 border-ink bg-card p-8 text-center shadow-note">
            <button
              onClick={() => toggleLearned(entry.id)}
              className={`absolute right-3 top-3 rounded-md p-1.5 transition-all hover:scale-125 ${
                known ? "text-sun" : "text-line hover:text-ink-soft"
              }`}
              aria-label="Отметить выученным"
              title={known ? "Выучено" : "Отметить выученным"}
            >
              <IconStar className="h-5 w-5" filled={known} />
            </button>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
              Вспомни пропущенную букву
            </p>
            <div className="mt-6 flex max-w-full flex-nowrap items-center justify-center gap-1.5 overflow-x-auto">
              {pre.split("").map((c, i) => (
                <Tile key={"p" + i} ch={c} />
              ))}
              <Tile ch="?" blank />
              {post.split("").map((c, i) => (
                <Tile key={"s" + i} ch={c} />
              ))}
            </div>
            <button
              onClick={() => setFlipped(true)}
              className="mt-8 rounded-lg border-2 border-ink bg-ink px-7 py-3 font-display text-sm font-bold text-card shadow-note-sm transition hover:-translate-y-0.5 hover:shadow-note active:translate-y-0"
            >
              Показать ответ
            </button>
          </div>

          <div className="flip-back flip-face rounded-xl border-2 border-ink bg-card p-8 text-center shadow-note">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-leaf-deep">
              Правильно
            </p>
            <div className="mt-6 flex max-w-full flex-nowrap items-center justify-center gap-1.5 overflow-x-auto">
              {pre.split("").map((c, i) => (
                <Tile key={"p" + i} ch={c} />
              ))}
              {entry.missing.split("").map((c, i) => (
                <Tile key={"a" + i} ch={c} weak />
              ))}
              {post.split("").map((c, i) => (
                <Tile key={"s" + i} ch={c} />
              ))}
            </div>
            <p className="mt-5 text-sm italic text-ink-soft">💡 {entry.hint}</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => mark(true)}
                className="rounded-lg border-2 border-leaf-deep bg-leaf px-6 py-2.5 font-display text-xs font-bold text-white shadow-note-sm transition hover:-translate-y-0.5 active:translate-y-0"
              >
                Знал ✓
              </button>
              <button
                onClick={() => mark(false)}
                className="rounded-lg border-2 border-pen-deep bg-pen px-6 py-2.5 font-display text-xs font-bold text-white shadow-note-sm transition hover:-translate-y-0.5 active:translate-y-0"
              >
                Не знал ✗
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestMode({
  queue,
  record,
  soundOn,
}: {
  queue: VocabWord[];
  record: (id: string, ok: boolean) => void;
  soundOn: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [session, setSession] = useState({ ok: 0, bad: 0 });
  const timer = useState<number | null>(null);
  const entry = queue[idx];

  if (!entry) return null;

  const wordParts = entry.word.split(entry.missing);
  const pre = wordParts[0] || "";
  const post = wordParts[1] || "";
  const ok = pick === entry.missing;

  const choose = (letter: string) => {
    if (pick) return;
    setPick(letter);
    const isOk = letter === entry.missing;
    record(entry.id, isOk);
    playSound(isOk ? "ok" : "bad", soundOn);
    setSession((s) => ({ ok: s.ok + (isOk ? 1 : 0), bad: s.bad + (isOk ? 0 : 1) }));
    setTimeout(() => {
      setPick(null);
      if (idx + 1 >= queue.length) {
        setIdx(0);
        setSession({ ok: 0, bad: 0 });
      } else {
        setIdx((i) => i + 1);
      }
    }, isOk ? 900 : 1900);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <span className="font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
          Диктант · слово {idx + 1} / {queue.length}
        </span>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="flex items-center gap-1 rounded-full border-2 border-leaf/40 bg-leaf/10 px-2.5 py-1 text-leaf-deep">
            <IconCheck className="h-3 w-3" /> {session.ok}
          </span>
          <span className="flex items-center gap-1 rounded-full border-2 border-pen/40 bg-pen/10 px-2.5 py-1 text-pen-deep">
            <IconX className="h-3 w-3" /> {session.bad}
          </span>
        </div>
      </div>

      <div className={pick && !ok ? "anim-shake" : ""}>
        <div className="flex max-w-full flex-nowrap items-center justify-center gap-1.5 overflow-x-auto">
          {pre.split("").map((c, i) => (
            <Tile key={"p" + i} ch={c} />
          ))}
          <Tile ch={pick ? entry.missing : "?"} blank={!pick} weak={!!pick} />
          {post.split("").map((c, i) => (
            <Tile key={"s" + i} ch={c} />
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        {pick === null ? (
          <>
            Какая буква пропущена?{" "}
            <span className="font-semibold text-ink">Выберите из трёх.</span>
          </>
        ) : ok ? (
          <span className="font-display font-bold text-leaf-deep">
            Верно! {entry.word}
          </span>
        ) : (
          <span className="font-display font-bold text-pen-deep">
            Ошибка! Правильно: {entry.word}
          </span>
        )}
      </p>

      {pick !== null && !ok && (
        <p className="anim-rise mt-1 text-center text-sm italic text-ink-soft">💡 {entry.hint}</p>
      )}

      <div className="mt-6 flex justify-center gap-2.5">
        {entry.options.map((o) => {
          const isRight = o === entry.missing;
          const isPicked = pick === o;
          return (
            <button
              key={o}
              onClick={() => choose(o)}
              disabled={!!pick}
              className={[
                "h-14 min-w-14 rounded-lg border-2 px-4 font-display text-xl font-black transition-all",
                !pick
                  ? "border-ink bg-paper hover:-translate-y-1 hover:border-pen hover:bg-sun/70 hover:shadow-note-sm active:translate-y-0"
                  : isPicked && isRight
                    ? "anim-pop border-leaf-deep bg-leaf text-white"
                    : isPicked
                      ? "border-pen-deep bg-pen text-white"
                      : isRight
                        ? "anim-pop border-leaf-deep bg-leaf/15 text-leaf-deep"
                        : "border-line bg-paper text-ink/50",
              ].join(" ")}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Vocab({ state, record, toggleLearned, soundOn }: Props) {
  const [cls, setCls] = useState(1);
  const [mode, setMode] = useState<"learn" | "test">("learn");
  const [words, setWords] = useState<VocabWord[]>([]);
  const [learnQueue, setLearnQueue] = useState<VocabWord[]>([]);
  const [testQueue, setTestQueue] = useState<VocabWord[]>([]);

  // Загрузка данных из БД
  useEffect(() => {
    const loadWords = () => {
      const allWords = getVocabWords();
      setWords(allWords);
      const classWords = allWords.filter((w) => w.class === cls);
      setLearnQueue(shuffle(classWords));
      setTestQueue(shuffle(classWords));
    };
    loadWords();
    return onDatabaseChange(loadWords);
  }, [cls]);

  const classWords = words.filter((w) => w.class === cls);

  const changeClass = (c: number) => {
    if (c === cls) return;
    setCls(c);
  };

  const restartMode = () => {
    const classWords = words.filter((w) => w.class === cls);
    if (mode === "learn") setLearnQueue(shuffle(classWords));
    else setTestQueue(shuffle(classWords));
  };

  const colors = CLASS_COLORS[cls];

  return (
    <section className="anim-rise">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
          Словарные слова
        </h1>
        <p className="mt-1 max-w-lg text-sm text-ink-soft">
          Слова, которые нельзя проверить правилом, — их нужно запомнить. Курсы разбиты по
          классам, с 1 по 11: выбирай свой, учи по карточкам и проверяй диктантом.
        </p>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {CLASSES.map((c) => {
          const classWords = words.filter((w) => w.class === c);
          const learned = classWords.filter((w) => isLearned(state, w.id)).length;
          const col = CLASS_COLORS[c];
          const active = c === cls;
          return (
            <button
              key={c}
              onClick={() => changeClass(c)}
              className={`shrink-0 rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                active
                  ? "border-ink bg-card shadow-note-sm"
                  : "border-line bg-card/60 hover:-translate-y-0.5 hover:border-ink hover:shadow-note-sm"
              }`}
            >
              <span
                className={`block rounded-full px-2.5 py-1 text-center font-display text-xs font-black ${col.chip}`}
              >
                {c} кл.
              </span>
              <span className="mt-1.5 block text-[10px] font-bold text-ink-soft">
                {learned}/{classWords.length}
              </span>
              <span className="mt-1 block h-1.5 w-12 overflow-hidden rounded-full bg-line">
                <span
                  className={`block h-full rounded-full ${col.bar}`}
                  style={{ width: `${classWords.length ? (learned / classWords.length) * 100 : 0}%` }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full border-2 border-ink bg-card p-1 shadow-note-sm">
          <button
            onClick={() => setMode("learn")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-xs font-bold transition-all ${
              mode === "learn" ? "bg-ink text-card" : "text-ink-soft hover:text-ink"
            }`}
          >
            <IconBook className="h-3.5 w-3.5" /> Учим
          </button>
          <button
            onClick={() => setMode("test")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-xs font-bold transition-all ${
              mode === "test" ? "bg-ink text-card" : "text-ink-soft hover:text-ink"
            }`}
          >
            <IconClock className="h-3.5 w-3.5" /> Проверяем
          </button>
        </div>
        <button
          onClick={restartMode}
          className="flex items-center gap-1.5 rounded-full border-2 border-line bg-card px-3.5 py-2 text-xs font-bold text-ink-soft transition hover:border-ink hover:text-ink"
          title="Перемешать слова заново"
        >
          <IconRefresh className="h-3.5 w-3.5" /> Перемешать
        </button>
      </div>

      <div className="rounded-xl border-2 border-ink bg-card p-5 shadow-note sm:p-8" key={`${cls}-${mode}`}>
        <div className="mb-5 flex items-center gap-2.5">
          <span
            className={`rounded-full px-3 py-1 font-display text-xs font-black ${colors.chip}`}
          >
            {CLASS_LABEL[cls]}
          </span>
          <span className="text-xs font-bold text-ink-soft">
            {classWords.length} слов в курсе
          </span>
        </div>
        {mode === "learn" ? (
          <LearnMode
            queue={learnQueue}
            isLearnedId={(id) => isLearned(state, id)}
            toggleLearned={toggleLearned}
            soundOn={soundOn}
          />
        ) : (
          <TestMode queue={testQueue} record={record} soundOn={soundOn} />
        )}
      </div>
    </section>
  );
}
