import { useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import { getCourse } from '../api/courses';
import type { Course } from '../types';

interface State {
  id: string | null;
  course: Course | null;
  error: string | null;
}

export function useCourse(courseId: string | undefined) {
  const [state, setState] = useState<State>({ id: null, course: null, error: null });

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;

    getCourse(courseId)
      .then((course) => !cancelled && setState({ id: courseId, course, error: null }))
      .catch(
        (e) =>
          !cancelled &&
          setState({
            id: courseId,
            course: null,
            error: e instanceof ApiError ? e.message : 'Не удалось загрузить курс',
          })
      );

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const isLoading = Boolean(courseId) && state.id !== courseId;
  return {
    course: isLoading ? null : state.course,
    isLoading,
    error: isLoading ? null : state.error,
  };
}
