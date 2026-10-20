import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAddCourse } from '../hooks/useAddCourse';
import { useCourse } from '../hooks/useCourse';
import { courseImage, getCourseMeta } from '../lib/courseMeta';

const BENEFITS = [
  'проработка всех групп мышц',
  'тренировка суставов',
  'улучшение циркуляции крови',
  'упражнения заряжают бодростью',
  'помогают противостоять стрессам',
];

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, openAuthModal } = useAuth();
  const { course, isLoading, error } = useCourse(courseId);
  const { add, pendingId, error: addError } = useAddCourse();
  const [imgFailed, setImgFailed] = useState(false);

  if (isLoading) return <p>Загрузка…</p>;
  if (error || !course) return <p className="text-red-500">{error ?? 'Курс не найден'}</p>;

  const isAdded = user?.selectedCourses.includes(course._id) ?? false;
  const isPending = pendingId === course._id;
  const { bg } = getCourseMeta(course.nameEN);

  return (
    <main className="pb-16">
      {/* Баннер */}
      <section className={`relative mb-12 h-56 overflow-hidden rounded-3xl ${bg}`}>
        <h1 className="absolute left-10 top-8 text-5xl font-medium text-white">{course.nameRU}</h1>
        {!imgFailed && (
          <img
            src={courseImage(course.nameEN)}
            alt=""
            onError={() => setImgFailed(true)}
            className="absolute bottom-0 right-10 h-full object-contain"
          />
        )}
      </section>

      {/* Подойдёт для вас, если */}
      {course.fitting.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-medium">Подойдет для вас, если:</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {course.fitting.map((text, i) => (
              <li key={i} className="flex items-center gap-4 rounded-3xl bg-[#202020] p-6 text-white">
                <span className="text-6xl font-medium text-lime-300">{i + 1}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Направления */}
      {course.directions.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-medium">Направления</h2>
          <ul className="grid gap-4 rounded-3xl bg-lime-300 p-8 sm:grid-cols-2 lg:grid-cols-3">
            {course.directions.map((d) => (
              <li key={d}>✦ {d}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Призыв к действию */}
      <section className="relative overflow-visible rounded-3xl bg-white p-10 shadow-md">
        <div className="max-w-md">
          <h2 className="mb-6 text-4xl font-medium leading-tight">
            Начните путь
            <br />к новому телу
          </h2>
          <ul className="mb-8 list-disc space-y-1 pl-5 text-gray-600">
            {BENEFITS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          {isAdded ? (
            <Link to="/profile" className="block rounded-full bg-lime-300 px-6 py-3 text-center">
              Курс добавлен · перейти в профиль
            </Link>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={() => (user ? add(course._id) : openAuthModal())}
              className="w-full rounded-full bg-lime-300 px-6 py-3 disabled:opacity-60"
            >
              {user ? 'Добавить курс' : 'Войдите, чтобы добавить курс'}
            </button>
          )}
          {addError && <p className="mt-3 text-sm text-red-500">{addError}</p>}
        </div>

        {/* Бегун выходит за верхнюю границу карточки */}
        <img
          src="/img/runner.png"
          alt=""
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="pointer-events-none absolute -top-10 bottom-0 right-6 hidden h-[calc(100%+2.5rem)] object-contain object-bottom md:block"
        />
      </section>
    </main>
  );
}
