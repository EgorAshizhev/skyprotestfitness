import { createContext } from 'react';
import type { Credentials, User } from '../types';

export interface AuthContextValue {
  user: User | null;
  /** true, пока проверяем сохранённый токен при старте приложения */
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (creds: Credentials) => Promise<void>;
  /** регистрация + автоматический вход (register не возвращает токен) */
  register: (creds: Credentials) => Promise<void>;
  logout: () => void;
  /** перезагрузить user (например, после добавления/удаления курса) */
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
