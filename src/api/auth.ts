import { request } from './client';
import type { Credentials, LoginResponse, MessageResponse, User } from '../types';

export const register = (creds: Credentials) =>
  request<MessageResponse>('/auth/register', { method: 'POST', body: creds });

export const login = (creds: Credentials) =>
  request<LoginResponse>('/auth/login', { method: 'POST', body: creds });

// ИСПРАВЛЕНИЕ: Сервер возвращает { user: User }, поэтому мы достаем data.user
export const getMe = async () => {
  const data = await request<{ user: User }>('/users/me', { auth: true });
  return data.user;
};