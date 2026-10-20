import { useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import { getCourse, getCourses } from '../api/courses';
import type { Course } from '../types';

interface State {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Список курсов. В ответе GET /courses нет длительности и сложности,
 * поэтому дополнительно подгружаем детали каждого курса (GET /courses/:id).
 * Если детали не загрузились, показываем то, что пришло в списке.
 */
export function useCourses(): State {
  const [state, setState] = useState<State>({ courses: [], isLoading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const list = await getCourses();
        const details = await Promise.allSettled(list.map((c) => getCourse(c._id)));
        if (cancelled) return;
        const courses = list.map((c, i) => {
          const d = details[i];
          return d.status === 'fulfilled' ? { ...c, ...d.value } : c;
        });
        setState({ courses, isLoading: false, error: null });
      } catch (e) {
        if (cancelled) return;
        const error = e instanceof ApiError ? e.message : 'Не удалось загрузить курсы';
        setState({ courses: [], isLoading: false, error });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
