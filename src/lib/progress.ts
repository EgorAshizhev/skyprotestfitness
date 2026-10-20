import type { Exercise, WorkoutProgress } from '../types';

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Процент выполнения одного упражнения (для полосок «Наклоны вперёд 0%») */
export const exercisePercent = (done: number, quantity: number): number =>
  quantity > 0 ? clamp((done / quantity) * 100) : 0;

/** Процент по тренировке: сумма повторений / сумма нормы */
export const workoutPercent = (exercises: Exercise[], progressData: number[]): number => {
  const total = exercises.reduce((s, e) => s + e.quantity, 0);
  const done = exercises.reduce((s, e, i) => s + Math.min(progressData[i] ?? 0, e.quantity), 0);
  return total > 0 ? clamp((done / total) * 100) : 0;
};

/** Процент по курсу: доля завершённых тренировок */
export const coursePercent = (workoutsProgress: WorkoutProgress[]): number =>
  workoutsProgress.length
    ? clamp((workoutsProgress.filter((w) => w.workoutCompleted).length / workoutsProgress.length) * 100)
    : 0;

/** Подставляет новое значение в массив, остальное оставляет как было */
export const withExerciseProgress = (
  current: number[],
  exercisesCount: number,
  index: number,
  value: number,
): number[] =>
  Array.from({ length: exercisesCount }, (_, i) => (i === index ? value : (current[i] ?? 0)));
