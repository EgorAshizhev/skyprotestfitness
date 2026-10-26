import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircleIcon } from '../components/Icons';
import Modal from '../components/Modal';
import ProgressModal from '../components/ProgressModal';
import { useWorkoutPage } from '../hooks/useWorkoutPage';
import { exercisePercent } from '../lib/progress';
import { exerciseLabel, parseWorkoutName, toEmbedUrl, workoutNumber } from '../lib/workout';

type Dialog = 'none' | 'progress' | 'accepted';

export default function WorkoutPage() {
  const { courseId, workoutId } = useParams<{ courseId: string; workoutId: string }>();
  const { workout, course, values, completed, isLoading, error, save } = useWorkoutPage(
    courseId,
    workoutId
  );
  const [dialog, setDialog] = useState<Dialog>('none');

  useEffect(() => {
    if (dialog !== 'accepted') return;
    const t = setTimeout(() => setDialog('none'), 1800);
    return () => clearTimeout(t);
  }, [dialog]);

  if (isLoading) return <p>Загрузка…</p>;
  if (error || !workout || !course) {
    return (
      <div>
        <p className="mb-4 text-red-500">{error ?? 'Тренировка не найдена'}</p>
        <Link to="/profile" className="underline">
          Вернуться в профиль
        </Link>
      </div>
    );
  }

  const { exercises } = workout;
  const hasExercises = exercises.length > 0;
  const hasProgress = values.some((v) => v > 0);
  const index = (workoutNumber(workout.name) ?? course.workouts.indexOf(workout._id) + 1) - 1;
  const { title } = parseWorkoutName(workout.name);

  const onSave = async (next: number[]) => {
    await save(next);
    setDialog('accepted');
  };

  return (
    <main className="pb-16">
      <h1 className="mb-4 text-3xl font-medium sm:text-4xl md:mb-8 md:text-5xl">{course.nameRU}</h1>

      <div className="mb-6 aspect-video overflow-hidden rounded-3xl bg-gray-200 md:mb-10 md:rounded-[30px]">
        <iframe
          src={toEmbedUrl(workout.video)}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <section className="rounded-3xl bg-white p-5 shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] md:rounded-[30px] md:p-8">
        <h2 className="mb-5 text-2xl font-medium">
          {hasExercises ? 'Упражнения' : 'Тренировка'}
          {index >= 0 && ` тренировки ${index + 1}`}
        </h2>

        {hasExercises ? (
          <ul className="mb-8 grid gap-x-12 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {exercises.map((e, i) => {
              const percent = exercisePercent(values[i] ?? 0, e.quantity);
              return (
                <li key={e._id}>
                  <p className="mb-1 text-sm">
                    {exerciseLabel(e.name)} {percent}%
                  </p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#00C1FF]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mb-8 flex items-center gap-2 text-gray-500">
            {completed ? (
              <>
                <CheckCircleIcon size={20} /> Тренировка пройдена
              </>
            ) : (
              'В этой тренировке нет упражнений: посмотрите видео и отметьте её пройденной.'
            )}
          </p>
        )}

        {(hasExercises || !completed) && (
          <button
            type="button"
            onClick={() => (hasExercises ? setDialog('progress') : void onSave([]))}
            className="btn-primary w-full px-8 py-3 text-base sm:w-auto sm:text-lg"
          >
            {!hasExercises
              ? 'Отметить пройденной'
              : hasProgress
                ? 'Обновить свой прогресс'
                : 'Заполнить свой прогресс'}
          </button>
        )}
      </section>

      {dialog === 'progress' && (
        <ProgressModal
          exercises={exercises}
          initial={values}
          onSave={onSave}
          onClose={() => setDialog('none')}
        />
      )}

      {dialog === 'accepted' && (
        <Modal onClose={() => setDialog('none')} className="max-w-72 p-8 text-center">
          <h2 className="mb-5 text-2xl font-medium leading-tight">Ваш прогресс засчитан!</h2>
          <div className="flex justify-center">
            <CheckCircleIcon size={40} />
          </div>
        </Modal>
      )}
    </main>
  );
}
