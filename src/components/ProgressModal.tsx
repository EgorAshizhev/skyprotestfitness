import { useState } from 'react';
import { ApiError } from '../api/client';
import { progressQuestion } from '../lib/workout';
import type { Exercise } from '../types';
import Modal from './Modal';

interface Props {
  exercises: Exercise[];
  initial: number[];
  onSave: (values: number[]) => Promise<void>;
  onClose: () => void;
}

/** «Мой прогресс»: сколько повторений сделано по каждому упражнению. */
export default function ProgressModal({ exercises, initial, onSave, onClose }: Props) {
  // нули не подставляем в поле, чтобы был виден серый placeholder «0», как в макете
  const [inputs, setInputs] = useState<string[]>(() =>
    exercises.map((_, i) => (initial[i] ? String(initial[i]) : ''))
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = (index: number, raw: string) =>
    setInputs((prev) => prev.map((v, i) => (i === index ? raw.replace(/\D/g, '').slice(0, 4) : v)));

  const submit = async () => {
    setError(null);
    setPending(true);
    try {
      await onSave(inputs.map((v) => Number(v || 0)));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось сохранить прогресс');
      setPending(false);
    }
  };

  return (
    <Modal onClose={onClose} className="max-w-92 p-6 sm:p-8">
      <h2 className="mb-6 text-3xl font-medium">Мой прогресс</h2>

      <div className="mb-6 max-h-72 space-y-3 overflow-y-auto pr-2">
        {exercises.map((e, i) => (
          <label key={e._id} className="block text-sm">
            <span className="mb-1 block">{progressQuestion(e.name)}</span>
            <input
              inputMode="numeric"
              placeholder="0"
              value={inputs[i]}
              onChange={(ev) => change(i, ev.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base outline-none focus:border-black"
            />
          </label>
        ))}
      </div>

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
      <button
        type="button"
        disabled={pending}
        onClick={() => void submit()}
        className="btn-primary w-full py-3 text-lg"
      >
        Сохранить
      </button>
    </Modal>
  );
}
