import { request } from './client';
import type { Course, MessageResponse, Workout } from '../types';

export const getCourses = () => request<Course[]>('/courses');

export const getCourse = (courseId: string) => request<Course>(`/courses/${courseId}`);

export const getCourseWorkouts = (courseId: string) =>
  request<Workout[]>(`/courses/${courseId}/workouts`, { auth: true });

export const addCourse = (courseId: string) =>
  request<MessageResponse>('/users/me/courses', {
    method: 'POST',
    body: { courseId },
    auth: true,
  });

export const removeCourse = (courseId: string) =>
  request<MessageResponse>(`/users/me/courses/${courseId}`, {
    method: 'DELETE',
    auth: true,
  });

export const resetCourseProgress = (courseId: string) =>
  request<MessageResponse>(`/courses/${courseId}/reset`, {
    method: 'PATCH',
    auth: true,
  });
