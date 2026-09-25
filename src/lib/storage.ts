export interface WordStat {
  a: number;
  e: number;
}

export interface ExamRecord {
  date: string;
  score: number;
  total: number;
}

export interface AppState {
  stats: Record<string, WordStat>;
  learned: string[];
  streak: number;
  best: number;
  lastDay: string;
  history: ExamRecord[];
  sound: boolean;
}

const KEY = "udarenie-app-v1";

export const defaultState: AppState = {
  stats: {},
  learned: [],
  streak: 0,
  best: 0,
  lastDay: "",
  history: [],
  sound: true,
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return { ...defaultState, ...parsed };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(s: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

export function dayKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const pa = new Date(a + "T12:00:00");
  const pb = new Date(b + "T12:00:00");
  return Math.round((pb.getTime() - pa.getTime()) / 86_400_000);
}

export function touchStreak(s: AppState): AppState {
  const today = dayKey();
  if (s.lastDay === today) return s;
  const streak = s.lastDay && daysBetween(s.lastDay, today) === 1 ? s.streak + 1 : 1;
  return { ...s, streak, best: Math.max(streak, s.best), lastDay: today };
}

export function recordAnswer(s: AppState, wordId: string, ok: boolean): AppState {
  const cur = s.stats[wordId] ?? { a: 0, e: 0 };
  return {
    ...touchStreak(s),
    stats: { ...s.stats, [wordId]: { a: cur.a + 1, e: cur.e + (ok ? 0 : 1) } },
  };
}

export function isLearned(s: AppState, wordId: string): boolean {
  if (s.learned.includes(wordId)) return true;
  const st = s.stats[wordId];
  return !!st && st.a >= 2 && st.e === 0;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
