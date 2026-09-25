import type { ReactNode } from "react";
import {
  IconBook,
  IconClock,
  IconDownload,
  IconFlame,
  IconVolume,
  IconVolumeOff,
  IconWifiOff,
} from "./ui";

export type Tab = "russian" | "progress" | "share" | "chemistry";

const IconPencil = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" />
    <path d="m14.5 6.5 3 3" />
  </svg>
);

const IconChart = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
    <path d="M4 20V4m0 16h16M8 16v-5m4 5V7m4 9v-3" />
  </svg>
);

const IconQr = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
    <path d="M13.5 13.5h3.2v3.2h-3.2zM17.3 17.3h3.2v3.2h-3.2zM20.5 13.5v.01M13.5 20.5h.01" />
  </svg>
);

const IconFlask = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 3h6M10 3v6.5L4 20h16l-6-10.5V3" />
    <path d="M7 17h10" />
  </svg>
);

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "russian", label: "Русский язык", icon: <IconBook /> },
  { id: "chemistry", label: "Химия", icon: <IconFlask /> },
  { id: "progress", label: "Прогресс", icon: <IconChart /> },
  { id: "share", label: "QR-код", icon: <IconQr /> },
];

interface Props {
  tab: Tab;
  setTab: (t: Tab) => void;
  sound: boolean;
  toggleSound: () => void;
  onInstall: () => void;
  canInstall: boolean;
  online: boolean;
  streak: number;
}

export default function Header({
  tab,
  setTab,
  sound,
  toggleSound,
  onInstall,
  canInstall,
  online,
  streak,
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/92 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between gap-3 py-3">
          <button
            className="group flex items-center gap-3 text-left"
            onClick={() => setTab("russian")}
            aria-label="На главную"
          >
            <span className="grid h-11 w-11 place-items-center rounded-lg border-2 border-ink bg-ink shadow-note-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              <span className="font-display text-xl font-black leading-none text-card">
                А<span className="text-pen">´</span>
              </span>
            </span>
            <span>
              <span className="block font-display text-lg font-black leading-tight tracking-tight">
                Ударе́ние<span className="text-pen">!</span>
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft">
                тренажёр русского языка
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            {!online && (
              <span className="hidden items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold sm:flex">
                <IconWifiOff className="h-3.5 w-3.5" /> офлайн
              </span>
            )}
            {streak > 1 && (
              <span
                className="flex items-center gap-1 rounded-full border-2 border-ink bg-sun px-3 py-1.5 font-display text-xs font-bold shadow-note-sm"
                title={`Серия: ${streak} дн. подряд`}
              >
                <IconFlame className="h-3.5 w-3.5 text-pen" />
                {streak}
              </span>
            )}
            <button
              onClick={toggleSound}
              className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-card text-ink transition hover:bg-ink hover:text-card active:scale-90"
              aria-label={sound ? "Выключить звук" : "Включить звук"}
              title={sound ? "Звук включён" : "Звук выключен"}
            >
              {sound ? <IconVolume /> : <IconVolumeOff />}
            </button>
            {canInstall && (
              <button
                onClick={onInstall}
                className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-pen px-3.5 py-1.5 font-display text-xs font-bold text-white shadow-note-sm transition hover:-translate-y-0.5 hover:shadow-note active:translate-y-0 active:shadow-none"
              >
                <IconDownload className="h-4 w-4" />
                <span className="hidden sm:inline">Установить</span>
                <span className="sm:hidden">App</span>
              </button>
            )}
          </div>
        </div>

        <nav className="-mb-px flex gap-1.5 overflow-x-auto pb-3 sm:gap-2" aria-label="Разделы">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3.5 py-2 font-display text-xs font-bold transition-all duration-200 sm:px-4 sm:text-sm ${
                tab === t.id
                  ? "border-ink bg-ink text-card shadow-note-sm"
                  : "border-transparent text-ink-soft hover:border-line hover:bg-card hover:text-ink"
              }`}
              aria-current={tab === t.id ? "page" : undefined}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
