import { useState } from "react";
import { IconX } from "./ui";

interface Props {
  word: string;
  onClose: () => void;
}

export default function ReportError({ word, onClose }: Props) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    // Здесь должна быть отправка на сервер
    // Пока просто показываем сообщение об успехе
    console.log("Ошибка в слове:", word, "Сообщение:", message);
    setSent(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50">
        <div className="anim-pop w-full max-w-md rounded-xl border-2 border-ink bg-card p-6 shadow-note">
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-leaf text-white">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-black">Спасибо за сообщение!</h3>
            <p className="mt-2 text-sm text-ink-soft">Ваше сообщение отправлено администратору</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50">
      <div className="anim-pop w-full max-w-md rounded-xl border-2 border-ink bg-card p-6 shadow-note">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-display text-lg font-black">Сообщить об ошибке</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-ink-soft transition hover:bg-paper hover:text-ink"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-sm text-ink-soft mb-4">
          Слово: <b className="text-ink">{word}</b>
        </p>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Опишите ошибку..."
          rows={4}
          className="w-full rounded-lg border-2 border-line bg-paper p-3 text-sm outline-none transition focus:border-ink"
        />
        
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className="flex-1 rounded-lg border-2 border-ink bg-pen px-4 py-2.5 font-display text-sm font-bold text-white shadow-note-sm transition enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Отправить
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border-2 border-ink bg-card px-4 py-2.5 font-display text-sm font-bold transition hover:bg-ink hover:text-card"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
