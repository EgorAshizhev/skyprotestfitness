import { request } from './client';
import type { Credentials, LoginResponse, MessageResponse, User } from '../types';

export const register = (creds: Credentials) =>
  request<MessageResponse>('/auth/register', { method: 'POST', body: creds });

export const login = (creds: Credentials) =>
  request<LoginResponse>('/auth/login', { method: 'POST', body: creds });

export const getMe = () => request<User>('/users/me', { auth: true });
