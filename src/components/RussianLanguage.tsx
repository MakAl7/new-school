import { useState } from 'react';
import Udarenie from './Udarenie';
import Vocab from './Vocab';
import Dictionary from './Dictionary';
import { type AppState } from '../lib/storage';

type SubTab = 'udarenie' | 'vocab-words' | 'dict';

interface Props {
  state: AppState;
  record: (id: string, ok: boolean) => void;
  finishExam: (score: number, total: number) => void;
  toggleLearned: (id: string) => void;
  soundOn: boolean;
}

export default function RussianLanguage({ state, record, finishExam, toggleLearned, soundOn }: Props) {
  const [subTab, setSubTab] = useState<SubTab>('udarenie');

  return (
    <div>
      {/* Заголовок предмета */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-ink mb-2">📚 Русский язык</h1>
        <p className="text-ink-soft">Изучайте ударения, словарные слова и работайте со словарём</p>
      </div>

      {/* Подвкладки */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSubTab('udarenie')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            subTab === 'udarenie'
              ? 'bg-ink text-card shadow-note-sm'
              : 'bg-card text-ink-soft hover:bg-line'
          }`}
        >
          Ударения
        </button>
        <button
          onClick={() => setSubTab('vocab-words')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            subTab === 'vocab-words'
              ? 'bg-ink text-card shadow-note-sm'
              : 'bg-card text-ink-soft hover:bg-line'
          }`}
        >
          Словарные слова
        </button>
        <button
          onClick={() => setSubTab('dict')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            subTab === 'dict'
              ? 'bg-ink text-card shadow-note-sm'
              : 'bg-card text-ink-soft hover:bg-line'
          }`}
        >
          Словарь
        </button>
      </div>

      {/* Контент подвкладки */}
      <div className="bg-card rounded-xl p-6 shadow-note">
        {subTab === 'udarenie' && (
          <Udarenie record={record} finishExam={finishExam} soundOn={soundOn} />
        )}
        {subTab === 'vocab-words' && (
          <Vocab state={state} record={record} toggleLearned={toggleLearned} soundOn={soundOn} />
        )}
        {subTab === 'dict' && (
          <Dictionary state={state} toggleLearned={toggleLearned} />
        )}
      </div>
    </div>
  );
}
