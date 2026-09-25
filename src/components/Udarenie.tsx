import { useState } from "react";
import Trainer from "./Trainer";
import Exam from "./Exam";

interface Props {
  record: (id: string, ok: boolean) => void;
  finishExam: (score: number, total: number) => void;
  soundOn: boolean;
}

type Mode = "trainer" | "exam";

export default function Udarenie({ record, finishExam, soundOn }: Props) {
  const [mode, setMode] = useState<Mode>("trainer");

  return (
    <section className="anim-rise">
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setMode("trainer")}
          className={`flex-1 rounded-lg border-2 px-4 py-3 font-display text-sm font-bold transition-all ${
            mode === "trainer"
              ? "border-ink bg-ink text-card shadow-note-sm"
              : "border-line bg-card text-ink-soft hover:border-ink hover:text-ink"
          }`}
        >
          Тренажёр
        </button>
        <button
          onClick={() => setMode("exam")}
          className={`flex-1 rounded-lg border-2 px-4 py-3 font-display text-sm font-bold transition-all ${
            mode === "exam"
              ? "border-ink bg-ink text-card shadow-note-sm"
              : "border-line bg-card text-ink-soft hover:border-ink hover:text-ink"
          }`}
        >
          Экзамен
        </button>
      </div>

      {mode === "trainer" ? (
        <Trainer record={record} soundOn={soundOn} />
      ) : (
        <Exam record={record} finishExam={finishExam} soundOn={soundOn} />
      )}
    </section>
  );
}
