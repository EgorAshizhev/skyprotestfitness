import CourseCard from '../components/CourseCard';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { useAuth } from '../context/AuthContext';
import { useAddCourse } from '../hooks/useAddCourse';
import { useCourses } from '../hooks/useCourses';

export default function HomePage() {
  const { user } = useAuth();
  const { courses, isLoading, error } = useCourses();
  const { add, pendingId, error: addError } = useAddCourse();

  return (
    <main>
      <div className="mb-10 flex items-start justify-between gap-6">
        <h1 className="max-w-xl text-4xl font-medium leading-tight md:text-5xl">
          Начните заниматься спортом и улучшите качество жизни
        </h1>
        <p className="hidden rounded-xl rounded-bl-none bg-lime-300 px-5 py-3 text-lg md:block">
          Измени своё тело за полгода!
        </p>
      </div>

      {addError && <p className="mb-4 text-red-500">{addError}</p>}
      {isLoading && <p>Загрузка…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            isAdded={user?.selectedCourses.includes(course._id) ?? false}
            isPending={pendingId === course._id}
            onAdd={add}
          />
        ))}
      </div>

      <ScrollToTopButton />
    </main>
  );
}
