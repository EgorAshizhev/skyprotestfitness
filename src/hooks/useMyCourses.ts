import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import { getCourse } from '../api/courses';
import { getCourseProgress } from '../api/workouts';
import { useAuth } from '../context/useAuth';
import { courseCompletionPercent } from '../lib/progress';
import type { Course } from '../types';

export interface MyCourse {
  course: Course;
  percent: number;
}

interface State {
  loaded: boolean;
  items: MyCourse[];
  error: string | null;
}

export function useMyCourses() {
  const { user } = useAuth();
  const [state, setState] = useState<State>({ loaded: false, items: [], error: null });
  const [version, setVersion] = useState(0);

  const ids = user?.selectedCourses ?? [];
  const idsKey = ids.join(',');

  useEffect(() => {
    let cancelled = false;
    const list = idsKey ? idsKey.split(',') : [];

    Promise.all(
      list.map(async (id): Promise<MyCourse> => {
        const course = await getCourse(id);
        const progress = await getCourseProgress(id).catch(() => null);
        return {
          course,
          percent: courseCompletionPercent(
            course.workouts.length,
            progress?.workoutsProgress ?? []
          ),
        };
      })
    )
      .then((items) => !cancelled && setState({ loaded: true, items, error: null }))
      .catch(
        (e) =>
          !cancelled &&
          setState({
            loaded: true,
            items: [],
            error: e instanceof ApiError ? e.message : 'Не удалось загрузить курсы',
          })
      );

    return () => {
      cancelled = true;
    };
  }, [idsKey, version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  const items = state.items.filter((i) => ids.includes(i.course._id));
  const isLoading = !state.loaded && ids.length > 0;

  return { items, isLoading, error: state.error, refresh };
}
