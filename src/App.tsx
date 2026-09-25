import { useEffect, useState } from "react";
import Header, { type Tab } from "./components/Header";
import RussianLanguage from "./components/RussianLanguage";
import Progress from "./components/Progress";
import Share from "./components/Share";
import Chemistry from "./components/Chemistry";
import { getStressWords, getVocabWords, onDatabaseChange } from "./db/database";
import {
  defaultState,
  loadState,
  recordAnswer,
  saveState,
  type AppState,
} from "./lib/storage";

export default function App() {
  const [app, setApp] = useState<AppState>(loadState);
  const [tab, setTab] = useState<Tab>("russian");
  const [online, setOnline] = useState(() => navigator.onLine);
  const [toast, setToast] = useState<string | null>(null);
  const [dbVersion, setDbVersion] = useState(0);

  // Подписка на изменения в базе данных
  useEffect(() => {
    return onDatabaseChange(() => {
      setDbVersion((v) => v + 1);
    });
  }, []);

  useEffect(() => {
    saveState(app);
  }, [app]);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div className="paper-bg relative min-h-screen">
      <div className="margin-line" aria-hidden />

      <div className="relative z-10">
        <Header
          tab={tab}
          setTab={setTab}
          sound={app.sound}
          toggleSound={() => setApp((s) => ({ ...s, sound: !s.sound }))}
          onInstall={() => {}}
          canInstall={false}
          online={online}
          streak={app.streak}
        />

        <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8" key={tab}>
          {tab === "russian" && (
            <RussianLanguage
              state={app}
              record={(id, ok) => setApp((s) => recordAnswer(s, id, ok))}
              finishExam={(score, total) =>
                setApp((s) => ({
                  ...s,
                  history: [
                    { date: new Date().toISOString(), score, total },
                    ...s.history,
                  ].slice(0, 20),
                }))
              }
              toggleLearned={(id) =>
                setApp((s) => ({
                  ...s,
                  learned: s.learned.includes(id)
                    ? s.learned.filter((x) => x !== id)
                    : [...s.learned, id],
                }))
              }
              soundOn={app.sound}
            />
          )}
          {tab === "progress" && (
            <Progress
              state={app}
              onReset={() => {
                setApp({ ...defaultState, sound: app.sound });
                setToast("Прогресс сброшен. Чистая страница!");
              }}
            />
          )}
          {tab === "share" && <Share />}
          {tab === "chemistry" && <Chemistry />}
        </main>

        <footer className="mx-auto max-w-5xl px-4 pb-8 pt-2 text-center text-xs text-ink-soft">
          <p>
            <b className="font-display">Ударе́ние!</b> · {getStressWords().length} слов с ударениями ·{" "}
            {getVocabWords().length} словарных слов с 1 по 11 класс · прогресс сохраняется на устройстве
          </p>
          <p className="mt-1">
            {online
              ? "PWA — можно установить на телефон и заниматься офлайн"
              : "Работаем офлайн — все упражнения доступны без сети"}
          </p>
          <p className="mt-2">
            <a
              href="/admin.html"
              target="_blank"
              className="text-blueink hover:text-blueink/80 underline"
            >
              🔐 Админ-панель
            </a>
          </p>
        </footer>
      </div>

      {toast && (
        <div className="anim-pop fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border-2 border-ink bg-ink px-5 py-2.5 font-display text-xs font-bold text-card shadow-note">
          {toast}
        </div>
      )}
    </div>
  );
}
