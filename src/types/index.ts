export interface ApiErrorBody {
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  email: string;
  selectedCourses: string[];
}

export interface Course {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  workouts: string[];
  // приходят только в GET /courses/:id
  difficulty?: string;
  durationInDays?: number;
  dailyDurationInMinutes?: { from: number; to: number };
}

export interface Exercise {
  _id: string;
  name: string;
  quantity: number;
}

export interface Workout {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
}

export interface WorkoutProgress {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}

export interface CourseProgress {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgress[];
}
