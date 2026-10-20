import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { courseImage, getCourseMeta } from '../lib/courseMeta';
import type { Course } from '../types';
import { CalendarIcon, ClockIcon, LevelIcon } from './Icons';

interface Props {
  course: Course;
  isAdded: boolean;
  isPending: boolean;
  onAdd: (courseId: string) => void;
}

const Chip = ({ icon, children }: { icon: ReactNode; children: string }) => (
  <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-900">
    {icon}
    {children}
  </span>
);

export default function CourseCard({ course, isAdded, isPending, onAdd }: Props) {
  const { bg } = getCourseMeta(course.nameEN);
  const src = courseImage(course.nameEN);
  const [imgFailed, setImgFailed] = useState(false);
  const { durationInDays, dailyDurationInMinutes, difficulty } = course;

  return (
    <article className="relative overflow-hidden rounded-[30px] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] transition-shadow hover:shadow-[0_8px_67px_-8px_rgba(0,0,0,0.2)]">
      <Link to={`/courses/${course._id}`} className="block">
        <div className={`aspect-9/8 ${bg}`}>
          {src && !imgFailed && (
            <img
              src={src}
              alt={course.nameRU}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="p-6 pt-5">
          <h3 className="mb-4 text-3xl font-medium">{course.nameRU}</h3>
          <div className="flex flex-wrap gap-2">
            <Chip icon={<CalendarIcon />}>
              {durationInDays !== undefined ? `${durationInDays} дней` : '25 дней'}
            </Chip>
            <Chip icon={<ClockIcon />}>
              {dailyDurationInMinutes
                ? `${dailyDurationInMinutes.from}-${dailyDurationInMinutes.to} мин/день`
                : '20-50 мин/день'}
            </Chip>
            <Chip icon={<LevelIcon />}>{difficulty ?? 'Сложность'}</Chip>
          </div>
        </div>
      </Link>

      {/* кнопка вне ссылки: вложенные интерактивные элементы — плохая практика */}
      <button
        type="button"
        disabled={isAdded || isPending}
        title={isAdded ? 'Курс уже добавлен' : 'Добавить курс'}
        aria-label={isAdded ? 'Курс уже добавлен' : 'Добавить курс'}
        onClick={() => onAdd(course._id)}
        className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xl leading-none shadow disabled:opacity-80"
      >
        {isAdded ? '✓' : '+'}
      </button>
    </article>
  );
}
