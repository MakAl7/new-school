import type { ReactNode } from "react";

// Иконки
export const IconX = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);

export const IconStar = ({ className = "w-4 h-4", filled = false }: { className?: string; filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
    <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8L12 2.8z" />
  </svg>
);

export const IconRefresh = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 11a8 8 0 1 0-2.3 6.3M20 5v6h-6" />
  </svg>
);

export const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 2" />
  </svg>
);

export const IconBook = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z" />
    <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
  </svg>
);

export const IconFlame = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 2c.6 3.5-1.4 5-2.8 6.7C7.8 10.4 7 12 7 14a5 5 0 0 0 10 0c0-1.2-.3-2.3-.8-3.3-.5 1-1.2 1.6-2 1.8.5-2.8-.6-6.6-2.2-8.5-.3 1-.8 1.7-1.4 2.2C10.9 4.6 11.5 3 12 2Zm0 19a7 7 0 0 1-7-7c0-2.5 1-4.6 2.5-6.4.4 2.7 2 4 2.1 6.1 1.7-.5 2.7-1.9 3.1-3.7 1.6 1.9 3.3 4.2 3.3 6.3a4 4 0 0 1-4 4.7Z" />
  </svg>
);

export const IconVolume = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M11 5 6.5 9H3v6h3.5L11 19V5z" fill="currentColor" stroke="none" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" />
  </svg>
);

export const IconVolumeOff = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M11 5 6.5 9H3v6h3.5L11 19V5z" fill="currentColor" stroke="none" />
    <path d="m16 9.5 5 5m0-5-5 5" />
  </svg>
);

export const IconDownload = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3v11m0 0 4.2-4.2M12 14 7.8 9.8M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17" />
  </svg>
);

export const IconWifiOff = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="m3 3 18 18M8.5 16.5a5 5 0 0 1 5.2-1.2M5 13a9.5 9.5 0 0 1 3.7-2.2m6.6-.6A9.5 9.5 0 0 1 19 13M2 9.5A14 14 0 0 1 6.7 7m6.5-1a14 14 0 0 1 8.8 3.5" />
    <circle cx="12" cy="20" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const IconSearch = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.8-4.8" />
  </svg>
);

export const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-1 13a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9L6 7m4 4v6m4-6v6" />
  </svg>
);

// Модальное окно
export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-ink/55 cursor-default"
      />
      <div className="relative anim-pop w-full max-w-md rounded-xl border-2 border-ink bg-card p-6 shadow-note">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1.5 text-ink-soft transition hover:bg-paper hover:text-ink"
          aria-label="Закрыть окно"
        >
          <IconX className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

// Кольцо прогресса
export function Ring({ value, size = 92 }: { value: number; size?: number }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(1, Math.max(0, value)));
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth="9" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-leaf)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        style={{ transition: "stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)" }}
      />
    </svg>
  );
}
