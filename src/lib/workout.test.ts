import { describe, expect, it } from '@jest/globals';
import {
  exerciseLabel,
  parseWorkoutName,
  progressQuestion,
  sortWorkouts,
  toEmbedUrl,
  workoutNumber,
} from './workout';

describe('workout', () => {
  it('parseWorkoutName отбрасывает автора', () => {
    expect(
      parseWorkoutName('Утренняя практика / Йога на каждый день / 1 день / Алексей Казубский')
    ).toEqual({ title: 'Утренняя практика', subtitle: 'Йога на каждый день / 1 день' });
  });
  it('parseWorkoutName работает с простым названием', () => {
    expect(parseWorkoutName('Урок 2. Основные движения')).toEqual({
      title: 'Урок 2. Основные движения',
      subtitle: '',
    });
  });
  it('exerciseLabel убирает число повторений', () => {
    expect(exerciseLabel('Наклоны вперёд (10 повторений)')).toBe('Наклоны вперёд');
    expect(exerciseLabel('Шлюпка')).toBe('Шлюпка');
  });
  it('progressQuestion формирует вопрос', () => {
    expect(progressQuestion('Наклоны вперёд (10 повторений)')).toBe(
      'Сколько раз вы сделали наклоны вперёд?'
    );
  });
  it('toEmbedUrl чинит ссылки', () => {
    expect(toEmbedUrl('https://youtu.be/embed/UjVtcMD4On4')).toBe(
      'https://www.youtube.com/embed/UjVtcMD4On4'
    );
    expect(toEmbedUrl('https://www.youtube.com/embed/oqe98Dxivns')).toBe(
      'https://www.youtube.com/embed/oqe98Dxivns'
    );
    expect(toEmbedUrl('https://www.youtube.com/watch?v=oqe98Dxivns')).toBe(
      'https://www.youtube.com/embed/oqe98Dxivns'
    );
  });
  it('workoutNumber достаёт номер урока или дня', () => {
    expect(workoutNumber('Урок 3. Новые движения')).toBe(3);
    expect(workoutNumber('Асаны стоя / Йога на каждый день / 3 день / Алексей')).toBe(3);
    expect(workoutNumber('Без номера')).toBeUndefined();
  });
  it('sortWorkouts сортирует по номеру, без номера идут в конце', () => {
    const names = ['Урок 2. B', 'Без номера', 'Урок 1. A', 'Урок 10. J', 'Урок 3. C'];
    expect(sortWorkouts(names.map((name) => ({ name }))).map((w) => w.name)).toEqual([
      'Урок 1. A',
      'Урок 2. B',
      'Урок 3. C',
      'Урок 10. J',
      'Без номера',
    ]);
  });
});
