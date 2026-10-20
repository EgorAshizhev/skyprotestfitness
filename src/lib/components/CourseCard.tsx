import { useState } from 'react';
import { Link } from 'react-router-dom';
import { courseImage, getCourseMeta } from '../lib/courseMeta';
import type { Course } from '../types';

interface Props {
  course: Course;
  isAdded: boolean;
  isPending: boolean;
  onAdd: (courseId: string) => void;
}

const Chip = ({ children }: { children: string }) => (
  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{children}</span>
);

export default function CourseCard({ course, isAdded, isPending, onAdd }: Props) {
  const { bg } = getCourseMeta(course.nameEN);
  const [imgFailed, setImgFailed] = useState(false);
  const { durationInDays, dailyDurationInMinutes, difficulty } = course;

  return (
    <Link
      to={`/courses/${course._id}`}
      className="block overflow-hidden rounded-3xl bg-white shadow-md transition-shadow hover:shadow-lg"
    >
      <div className={`relative h-80 ${bg}`}>
        {!imgFailed && (
          <img
            src={courseImage(course.nameEN)}
            alt={course.nameRU}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-top"
          />
        )}

        <button
          type="button"
          disabled={isAdded || isPending}
          title={isAdded ? 'Курс уже добавлен' : 'Добавить курс'}
          aria-label={isAdded ? 'Курс уже добавлен' : 'Добавить курс'}
          onClick={(e) => {
            // карточка — ссылка, поэтому гасим переход
            e.preventDefault();
            e.stopPropagation();
            onAdd(course._id);
          }}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg leading-none disabled:opacity-70"
        >
          {isAdded ? '✓' : '+'}
        </button>
      </div>

      <div className="p-6">
        <h3 className="mb-4 text-2xl font-medium">{course.nameRU}</h3>
        <div className="flex flex-wrap gap-2">
          {durationInDays !== undefined && <Chip>{`${durationInDays} дней`}</Chip>}
          {dailyDurationInMinutes && (
            <Chip>{`${dailyDurationInMinutes.from}-${dailyDurationInMinutes.to} мин/день`}</Chip>
          )}
          {difficulty && <Chip>{difficulty}</Chip>}
        </div>
      </div>
    </Link>
  );
}
