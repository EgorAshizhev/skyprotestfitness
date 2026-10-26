import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { removeCourse, resetCourseProgress } from '../api/courses';
import { ProfileAvatarIcon } from '../components/Icons';
import ProfileCourseCard from '../components/ProfileCourseCard';
import SelectWorkoutModal from '../components/SelectWorkoutModal';
import { useAuth } from '../context/useAuth';
import { useMyCourses, type MyCourse } from '../hooks/useMyCourses';

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { items, isLoading, error, refresh } = useMyCourses();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectCourseId, setSelectCourseId] = useState<string | null>(null);

  if (!user) return null;

  const login = user.email.split('@')[0];
  const word = login.split(/[._\-\d]/)[0] || login;
  const name = word.charAt(0).toUpperCase() + word.slice(1);

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const run = async (courseId: string, action: () => Promise<void>, fallback: string) => {
    setActionError(null);
    setBusyId(courseId);
    try {
      await action();
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : fallback);
    } finally {
      setBusyId(null);
    }
  };

  const onRemove = (courseId: string) =>
    run(
      courseId,
      async () => {
        await removeCourse(courseId);
        await refreshUser();
      },
      'Не удалось удалить курс'
    );

  const onStart = ({ course, percent }: MyCourse) =>
    run(
      course._id,
      async () => {
        if (percent >= 100) {
          await resetCourseProgress(course._id);
          refresh();
        }
        setSelectCourseId(course._id);
      },
      'Не удалось открыть тренировки'
    );

  return (
    <main className="pb-16">
      <h1 className="mb-6 text-3xl font-medium sm:mb-8 md:text-4xl">Профиль</h1>

      <section className="mb-12 flex flex-col gap-6 rounded-[30px] bg-white p-6 shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] sm:flex-row sm:items-center md:mb-16 md:p-7">
        <div className="h-44.5 w-44.5 shrink-0 overflow-hidden rounded-3xl">
          <ProfileAvatarIcon />
        </div>
        <div className="w-full sm:w-auto">
          <h2 className="mb-4 text-3xl font-medium">{name}</h2>
          <p className="mb-6">Логин: {login}</p>
          <button
            type="button"
            onClick={onLogout}
            className="btn-secondary w-full px-10 py-3 text-lg sm:w-auto"
          >
            Выйти
          </button>
        </div>
      </section>

      <h2 className="mb-6 text-3xl font-medium md:text-4xl">Мои курсы</h2>

      {actionError && <p className="mb-4 text-red-500">{actionError}</p>}
      {isLoading && <p>Загрузка…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && items.length === 0 && (
        <p className="text-gray-500">
          У вас пока нет добавленных курсов. Выберите их на главной странице.
        </p>
      )}

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ProfileCourseCard
            key={item.course._id}
            item={item}
            busy={busyId === item.course._id}
            onRemove={onRemove}
            onStart={onStart}
          />
        ))}
      </div>
      {selectCourseId && (
        <SelectWorkoutModal courseId={selectCourseId} onClose={() => setSelectCourseId(null)} />
      )}
    </main>
  );
}
