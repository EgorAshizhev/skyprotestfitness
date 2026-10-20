import { useCallback, useState } from 'react';
import { ApiError } from '../api/client';
import { addCourse } from '../api/courses';
import { useAuth } from '../context/AuthContext';

/**
 * Добавление курса пользователю. Неавторизованному открывает модалку входа.
 * Общий для главной и страницы курса.
 */
export function useAddCourse() {
  const { user, openAuthModal, refreshUser } = useAuth();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const add = useCallback(
    async (courseId: string) => {
      if (!user) return openAuthModal();

      setError(null);
      setPendingId(courseId);
      try {
        await addCourse(courseId);
        await refreshUser(); // обновляет selectedCourses
      } catch (e) {
        setError(e instanceof ApiError ? e.message : 'Не удалось добавить курс');
      } finally {
        setPendingId(null);
      }
    },
    [user, openAuthModal, refreshUser],
  );

  return { add, pendingId, error };
}
