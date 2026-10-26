import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import { getCourse } from '../api/courses';
import { getWorkout, getWorkoutProgress, saveWorkoutProgress } from '../api/workouts';
import type { Course, Workout } from '../types';

interface State {
  key: string | null;
  workout: Workout | null;
  course: Course | null;
  values: number[];
  completed: boolean;
  error: string | null;
}

const EMPTY: State = {
  key: null,
  workout: null,
  course: null,
  values: [],
  completed: false,
  error: null,
};

const isDone = (workout: Workout, values: number[]) =>
  workout.exercises.every((e, i) => (values[i] ?? 0) >= e.quantity);

export function useWorkoutPage(courseId: string | undefined, workoutId: string | undefined) {
  const [state, setState] = useState<State>(EMPTY);
  const key = courseId && workoutId ? `${courseId}/${workoutId}` : null;

  useEffect(() => {
    if (!courseId || !workoutId || !key) return;
    let cancelled = false;

    Promise.all([
      getWorkout(workoutId),
      getCourse(courseId),
      getWorkoutProgress(courseId, workoutId),
    ])
      .then(([workout, course, progress]) => {
        if (cancelled) return;
        const saved = progress.progressData ?? [];
        setState({
          key,
          workout,
          course,
          values: workout.exercises.map((_, i) => saved[i] ?? 0),
          completed: Boolean(progress.workoutCompleted),
          error: null,
        });
      })
      .catch((e) => {
        if (cancelled) return;
        const error = e instanceof ApiError ? e.message : 'Не удалось загрузить тренировку';
        setState({ ...EMPTY, key, error });
      });

    return () => {
      cancelled = true;
    };
  }, [courseId, workoutId, key]);

  const save = useCallback(
    async (values: number[]) => {
      if (!courseId || !workoutId || !state.workout) return;
      await saveWorkoutProgress(courseId, workoutId, values);
      setState((s) => (s.workout ? { ...s, values, completed: isDone(s.workout, values) } : s));
    },
    [courseId, workoutId, state.workout]
  );

  const isLoading = key !== null && state.key !== key;
  return {
    workout: isLoading ? null : state.workout,
    course: isLoading ? null : state.course,
    values: state.values,
    completed: state.completed,
    isLoading,
    error: isLoading ? null : state.error,
    save,
  };
}
