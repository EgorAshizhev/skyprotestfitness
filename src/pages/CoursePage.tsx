import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StarIcon } from '../components/Icons';
import { useAuth } from '../context/useAuth';
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
  const { user } = useAuth();
  const { course, isLoading, error } = useCourse(courseId);
  const { add, pendingId, error: addError } = useAddCourse();
  const [imgFailed, setImgFailed] = useState(false);

  if (isLoading) return <p>Загрузка…</p>;
  if (error || !course) return <p className="text-red-500">{error ?? 'Курс не найден'}</p>;

  const isAdded = user?.selectedCourses.includes(course._id) ?? false;
  const isPending = pendingId === course._id;
  const { bg } = getCourseMeta(course.nameEN);
  const src = courseImage(course.nameEN);

  return (
    <main className="pb-16">
      {/* Баннер: фон картинки совпадает с цветом курса, верх фигуры обрезается как в макете */}
      <section className={`relative mb-10 h-48 overflow-hidden rounded-3xl md:mb-14 md:h-70 ${bg}`}>
        <h1 className="absolute left-6 top-6 z-10 text-4xl font-medium text-white md:left-10 md:top-10 md:text-6xl">
          {course.nameRU}
        </h1>
        {src && !imgFailed && (
          <img
            src={src}
            alt=""
            onError={() => setImgFailed(true)}
            className="absolute bottom-0 right-0 w-72 max-w-none md:right-12 md:w-110"
          />
        )}
      </section>

      {/* Подойдёт для вас, если */}
      {course.fitting.length > 0 && (
        <section className="mb-10 md:mb-14">
          <h2 className="mb-5 text-2xl font-medium md:mb-6 md:text-3xl">Подойдет для вас, если:</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {course.fitting.map((text, i) => (
              <li
                key={i}
                className="flex items-center gap-4 rounded-3xl bg-linear-to-br from-[#1c1e26] to-[#111217] p-6 text-white"
              >
                <span className="text-6xl font-medium leading-none text-brand">{i + 1}</span>
                <span className="text-lg leading-snug">{text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Направления */}
      {course.directions.length > 0 && (
        <section className="mb-14 md:mb-20">
          <h2 className="mb-5 text-2xl font-medium md:mb-6 md:text-3xl">Направления</h2>
          <ul className="grid gap-x-8 gap-y-4 rounded-3xl bg-brand p-6 sm:grid-cols-2 md:px-8 md:py-7 lg:grid-cols-3">
            {course.directions.map((d) => (
              <li key={d} className="flex items-center gap-3 text-lg">
                <StarIcon />
                {d}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Призыв к действию; бегун выходит за верхнюю границу карточки */}
      <section className="relative rounded-3xl bg-white p-6 shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] md:p-10">
        <div className="max-w-md">
          <h2 className="mb-6 text-4xl font-medium leading-tight md:text-5xl">
            Начните путь
            <br />к новому телу
          </h2>
          <ul className="mb-8 list-disc space-y-1 pl-5 text-lg text-gray-500 marker:text-gray-400">
            {BENEFITS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          {isAdded ? (
            <Link
              to="/profile"
              className="block rounded-full bg-brand px-6 py-3 text-center transition-opacity hover:opacity-80"
            >
              Курс добавлен · перейти в профиль
            </Link>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={() => void add(course._id)}
              className="w-full rounded-full bg-brand px-6 py-3 transition-opacity hover:opacity-80 disabled:opacity-60"
            >
              {user ? 'Добавить курс' : 'Войдите, чтобы добавить курс'}
            </button>
          )}
          {addError && <p className="mt-3 text-sm text-red-500">{addError}</p>}
        </div>

        <img
          src="/runner.png"
          alt=""
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="pointer-events-none absolute -top-10 bottom-0 right-6 hidden h-[calc(100%+2.5rem)] object-contain object-bottom md:block"
        />
      </section>
    </main>
  );
}
