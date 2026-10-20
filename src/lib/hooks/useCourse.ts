import { useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import { getCourse } from '../api/courses';
import type { Course } from '../types';

export function useCourse(courseId: string | undefined) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getCourse(courseId)
      .then((c) => !cancelled && setCourse(c))
      .catch((e) => !cancelled && setError(e instanceof ApiError ? e.message : 'Не удалось загрузить курс'))
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return { course, isLoading, error };
}
