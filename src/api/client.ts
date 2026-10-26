import { clearToken, getToken } from '../lib/token';
import type { ApiErrorBody } from '../types';

const BASE_URL: string =
  import.meta.env.VITE_API_URL ?? 'https://wedev-api.sky.pro/api/fitness';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (fn: (() => void) | null): void => {
  onUnauthorized = fn;
};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
}

export async function request<T>(
  path: string,
  { method = 'GET', body, auth = false }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Нет соединения с сервером', 0);
  }

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && auth) {
      clearToken();
      onUnauthorized?.();
    }
    const message = (data as ApiErrorBody | null)?.message ?? 'Что-то пошло не так';
    throw new ApiError(message, res.status);
  }

  return data as T;
}
