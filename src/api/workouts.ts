import { request } from './client';
import type { CourseProgress, MessageResponse, Workout, WorkoutProgress } from '../types';

export const getWorkout = (workoutId: string) =>
  request<Workout>(`/workouts/${workoutId}`, { auth: true });

export const getCourseProgress = (courseId: string) =>
  request<CourseProgress>(`/users/me/progress?courseId=${courseId}`, { auth: true });

export const getWorkoutProgress = (courseId: string, workoutId: string) =>
  request<WorkoutProgress>(
    `/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
    { auth: true },
  );

/** progressData: массив той же длины, что и exercises тренировки */
export const saveWorkoutProgress = (
  courseId: string,
  workoutId: string,
  progressData: number[],
) =>
  request<MessageResponse>(`/courses/${courseId}/workouts/${workoutId}`, {
    method: 'PATCH',
    body: { progressData },
    auth: true,
  });

export const resetWorkoutProgress = (courseId: string, workoutId: string) =>
  request<MessageResponse>(`/courses/${courseId}/workouts/${workoutId}/reset`, {
    method: 'PATCH',
    auth: true,
  });
