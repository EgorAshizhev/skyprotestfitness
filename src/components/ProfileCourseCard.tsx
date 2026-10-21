import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MyCourse } from '../hooks/useMyCourses';
import { courseImage, getCourseMeta } from '../lib/courseMeta';
import { CalendarIcon, ClockIcon, LevelIcon, MinusCircleIcon } from './Icons';
import { Chip } from './CourseCard';

interface Props {
  item: MyCourse;
  busy: boolean;
  onRemove: (courseId: string) => void;
  onStart: (item: MyCourse) => void;
}

const actionLabel = (percent: number) =>
  percent >= 100 ? 'Начать заново' : percent > 0 ? 'Продолжить' : 'Начать тренировки';

export default function ProfileCourseCard({ item, busy, onRemove, onStart }: Props) {
  const { course, percent } = item;
  const { bg } = getCourseMeta(course.nameEN);
  const src = courseImage(course.nameEN);
  const [imgFailed, setImgFailed] = useState(false);
  const { durationInDays, dailyDurationInMinutes, difficulty } = course;

  return (
    <article className="relative overflow-hidden rounded-[30px] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)]">
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
      </Link>

      <button
        type="button"
        disabled={busy}
        aria-label="Удалить курс"
        onClick={() => onRemove(course._id)}
        className="group absolute right-5 top-5 disabled:opacity-60"
      >
        <MinusCircleIcon />
        <span className="pointer-events-none absolute left-full top-full ml-1 hidden whitespace-nowrap rounded border border-gray-400 bg-white px-1.5 py-0.5 text-[10px] leading-tight group-hover:block group-focus-visible:block">
          Удалить курс
        </span>
      </button>

      <div className="p-6 pt-5">
        <h3 className="mb-4 text-3xl font-medium">{course.nameRU}</h3>
        <div className="mb-6 flex flex-wrap gap-2">
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

        <p className="mb-2 text-lg">Прогресс {percent}%</p>
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mb-6 h-1.5 overflow-hidden rounded-full bg-gray-200"
        >
          <div className="h-full rounded-full bg-[#00C1FF]" style={{ width: `${percent}%` }} />
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => onStart(item)}
          className="btn-primary w-full py-3 text-lg"
        >
          {actionLabel(percent)}
        </button>
      </div>
    </article>
  );
}
