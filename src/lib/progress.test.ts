import { describe, expect, it } from '@jest/globals';
import {
  courseCompletionPercent,
  coursePercent,
  exercisePercent,
  withExerciseProgress,
  workoutPercent,
} from './progress';

describe('progress', () => {
  it('exercisePercent ограничен 100', () => {
    expect(exercisePercent(5, 10)).toBe(50);
    expect(exercisePercent(30, 10)).toBe(100);
    expect(exercisePercent(1, 0)).toBe(0);
  });
  it('workoutPercent считает по сумме повторений', () => {
    const ex = [
      { _id: 'a', name: 'a', quantity: 10 },
      { _id: 'b', name: 'b', quantity: 10 },
    ];
    expect(workoutPercent(ex, [10, 0])).toBe(50);
  });
  it('coursePercent считает долю завершённых тренировок', () => {
    expect(
      coursePercent([
        { workoutId: '1', workoutCompleted: true, progressData: [] },
        { workoutId: '2', workoutCompleted: false, progressData: [] },
      ])
    ).toBe(50);
  });
  it('withExerciseProgress сохраняет остальные значения', () => {
    expect(withExerciseProgress([1, 7, 0, 10], 4, 2, 5)).toEqual([1, 7, 5, 10]);
  });
  it('courseCompletionPercent считает от общего числа тренировок', () => {
    const done = [{ workoutId: '1', workoutCompleted: true, progressData: [] }];
    expect(courseCompletionPercent(5, done)).toBe(20);
    expect(courseCompletionPercent(0, done)).toBe(0);
    expect(courseCompletionPercent(1, done)).toBe(100);
  });
});
