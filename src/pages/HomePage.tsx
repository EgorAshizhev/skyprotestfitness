import CourseCard from '../components/CourseCard';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { useAuth } from '../context/useAuth';
import { useAddCourse } from '../hooks/useAddCourse';
import { useCourses } from '../hooks/useCourses';

export default function HomePage() {
  const { user } = useAuth();
  const { courses, isLoading, error } = useCourses();
  const { add, pendingId, error: addError } = useAddCourse();

  return (
    <main>
      <section className="mb-10 flex flex-col items-start gap-6 md:mb-12 md:flex-row md:justify-between">
        <h1 className="max-w-3xl text-4xl font-medium leading-tight underline decoration-accent decoration-2 underline-offset-8 md:text-6xl md:leading-[1.1]">
          Начните заниматься спортом и улучшите качество жизни
        </h1>

        {/* «облачко»: хвостик рисуем рамками псевдоэлемента */}
        <p className="relative shrink-0 rounded-md bg-brand px-4 py-3 text-xl leading-tight after:absolute after:left-8 after:top-full after:border-x-[10px] after:border-t-[14px] after:border-x-transparent after:border-t-brand md:mt-2 md:max-w-64 md:text-2xl">
          Измени своё тело за полгода!
        </p>
      </section>

      {addError && <p className="mb-4 text-red-500">{addError}</p>}
      {isLoading && <p>Загрузка…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
