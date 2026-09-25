import { useState } from "react";
import { isVowel, type WordEntry } from "../data/words";

interface Props {
  entry: WordEntry;
  onResult: (ok: boolean) => void;
}

type PickState = { idx: number; ok: boolean } | null;

export default function WordCard({ entry, onResult }: Props) {
  const [pick, setPick] = useState<PickState>(null);
  const letters = entry.word.split("");

  const choose = (idx: number) => {
    if (pick) return;
    if (!isVowel(letters[idx])) return;
    const ok = idx === entry.stress;
    setPick({ idx, ok });
    onResult(ok);
  };

  return (
    <div className="text-center">
      <div
        className={`flex flex-wrap items-stretch justify-center gap-1.5 sm:gap-2 ${
          pick && !pick.ok ? "anim-shake" : ""
        }`}
      >
        {letters.map((ch, i) => {
          const vowel = isVowel(ch);
          const revealed = !!pick && i === entry.stress;
          const wrongPick = !!pick && !pick.ok && pick.idx === i;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={!!pick || !vowel}
              aria-label={`Буква ${ch}`}
              className={[
                "relative grid h-12 w-10 place-items-center rounded-md border-2 font-display text-xl font-bold transition-all duration-150 sm:h-16 sm:w-13 sm:text-3xl",
                revealed
                  ? "anim-pop border-leaf-deep bg-leaf/15 text-leaf-deep"
                  : wrongPick
                    ? "border-pen-deep bg-pen/15 text-pen-deep"
                    : pick
                      ? "border-line bg-paper text-ink/60"
                      : vowel
                        ? "cursor-pointer border-ink bg-paper hover:-translate-y-1 hover:border-pen hover:bg-sun/70 hover:shadow-note-sm active:translate-y-0"
                        : "border-transparent bg-transparent text-ink/85",
              ].join(" ")}
            >
              {ch}
              {revealed && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-display text-xl font-black text-pen sm:-top-6 sm:text-2xl">
                  ´
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
