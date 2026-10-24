import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { getCourseWorkouts } from '../api/courses';
import { getCourseProgress } from '../api/workouts';
import { parseWorkoutName, sortWorkouts } from '../lib/workout';
import type { Workout } from '../types';
import { CheckCircleIcon, EmptyCircleIcon } from './Icons';
import Modal from './Modal';

interface State {
  loaded: boolean;
  workouts: Workout[];
  done: string[];
  error: string | null;
}

interface Props {
  courseId: string;
  onClose: () => void;
}

/** «Выберите тренировку»: список уроков курса с отметками о прохождении. */
export default function SelectWorkoutModal({ courseId, onClose }: Props) {
  const navigate = useNavigate();
  const [state, setState] = useState<State>({ loaded: false, workouts: [], done: [], error: null });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getCourseWorkouts(courseId),
      // прогресс не критичен: без него просто не будет галочек
      getCourseProgress(courseId).catch(() => null),
    ])
      .then(([workouts, progress]) => {
        if (cancelled) return;
        const done = (progress?.workoutsProgress ?? [])
          .filter((w) => w.workoutCompleted)
          .map((w) => w.workoutId);
        setState({ loaded: true, workouts: sortWorkouts(workouts), done, error: null });
      })
      .catch((e) => {
        if (cancelled) return;
        const error = e instanceof ApiError ? e.message : 'Не удалось загрузить тренировки';
        setState({ loaded: true, workouts: [], done: [], error });
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const { loaded, workouts, done, error } = state;
  // по умолчанию выбрана первая непройденная тренировка
  const defaultId = (workouts.find((w) => !done.includes(w._id)) ?? workouts[0])?._id ?? null;
  const currentId = selectedId ?? defaultId;

  const start = () => currentId && navigate(`/workout/${courseId}/${currentId}`);

  return (
    <Modal onClose={onClose} className="max-w-95 p-6 sm:p-8">
      <h2 className="mb-8 text-center text-3xl font-medium">Выберите тренировку</h2>

      {!loaded && <p className="mb-6 text-center">Загрузка…</p>}
      {error && <p className="mb-6 text-center text-red-500">{error}</p>}

      {workouts.length > 0 && (
        <ul className="mb-6 max-h-85 overflow-y-auto pr-3">
          {workouts.map((w) => {
            const { title, subtitle } = parseWorkoutName(w.name);
            const isDone = done.includes(w._id);
            return (
              <li key={w._id} className="border-b border-gray-300 last:border-b-0">
                <label className="flex cursor-pointer items-start gap-3 py-3">
                  <input
                    type="radio"
                    name="workout"
                    className="sr-only"
                    checked={currentId === w._id}
                    onChange={() => setSelectedId(w._id)}
                  />
                  <span className="mt-1 shrink-0">
                    {isDone || currentId === w._id ? (
                      <CheckCircleIcon size={20} />
                    ) : (
                      <EmptyCircleIcon />
                    )}
                  </span>
                  <span className={currentId === w._id ? 'font-medium' : ''}>
                    <span className="block text-xl leading-tight">{title}</span>
                    {subtitle && <span className="block text-sm">{subtitle}</span>}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        disabled={!currentId}
        onClick={start}
        className="btn-primary w-full py-3 text-lg"
      >
        Начать
      </button>
    </Modal>
  );
}
