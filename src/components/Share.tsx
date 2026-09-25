import { useState } from "react";

export default function Share() {
  return (
    <section className="anim-rise">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
          QR-коды
        </h1>
        <p className="mt-1 max-w-lg text-sm text-ink-soft">
          Перенесите прогресс на другой телефон: отсканируйте код камерой, скопируйте текст и
          вставьте его во вкладке «Импорт» на втором устройстве. Данные объединятся — ничего не
          сотрётся.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative rounded-xl border-2 border-ink bg-card p-5 shadow-note sm:p-6">
          <span className="absolute -top-3 left-4 -rotate-2 rounded border-2 border-ink bg-sun px-2.5 py-0.5 font-display text-[11px] font-black uppercase tracking-widest">
            Экспорт
          </span>
          <h2 className="font-display text-lg font-black">Мой прогресс</h2>
          <p className="mt-1 text-sm text-ink-soft">
            QR-код с вашим прогрессом для переноса на другое устройство
          </p>
          <div className="mt-4 flex justify-center">
            <div className="grid h-56 w-56 place-items-center rounded-xl border-2 border-ink bg-white p-4 shadow-note-sm">
              <p className="text-center text-sm text-ink-soft">
                QR-код будет сгенерирован здесь
              </p>
            </div>
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-ink bg-ink px-4 py-2.5 font-display text-xs font-bold text-card shadow-note-sm transition hover:-translate-y-0.5 active:translate-y-0">
            Скопировать текстом (запасной способ)
          </button>
        </div>

        <div className="relative rounded-xl border-2 border-ink bg-card p-5 shadow-note sm:p-6">
          <span className="absolute -top-3 left-4 rotate-1 rounded border-2 border-ink bg-pen px-2.5 py-0.5 font-display text-[11px] font-black uppercase tracking-widest text-white">
            Импорт
          </span>
          <h2 className="font-display text-lg font-black">Вставить код с другого телефона</h2>
          <ol className="mt-3 space-y-1.5 text-sm text-ink-soft">
            <li>
              <b className="text-ink">1.</b> На старом телефоне откройте «Экспорт» и отсканируйте
              QR камерой (или нажмите «Скопировать»).
            </li>
            <li>
              <b className="text-ink">2.</b> Скопируйте полученный текст — он начинается с{" "}
              <code className="rounded bg-paper px-1 font-bold text-blueink">UDAR2:</code>
            </li>
            <li>
              <b className="text-ink">3.</b> Вставьте его в поле ниже и нажмите «Импортировать».
            </li>
          </ol>
          <textarea
            placeholder="UDAR2:…"
            rows={5}
            className="mt-4 w-full resize-y rounded-lg border-2 border-line bg-paper p-3 font-mono text-xs outline-none transition focus:border-ink"
          />
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-ink bg-pen px-4 py-2.5 font-display text-xs font-bold text-white shadow-note-sm transition hover:-translate-y-0.5 active:translate-y-0">
            Импортировать прогресс
          </button>
          <p className="mt-4 border-t-2 border-dashed border-line pt-3 text-xs leading-relaxed text-ink-soft">
            Импорт <b className="text-ink">объединяет</b> прогресс: для каждого слова берётся
            более полная статистика, серия и рекорд — по максимуму, отметки «выучено» и история
            экзаменов складываются. Ничего не удаляется.
          </p>
        </div>
      </div>
    </section>
  );
}
