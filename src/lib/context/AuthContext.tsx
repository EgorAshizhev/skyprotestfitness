import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';
import { clearToken, getToken, setToken } from '../lib/token';
import type { Credentials, User } from '../types';

interface AuthContextValue {
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

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => getToken() !== null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    setUser(await authApi.getMe());
  }, []);

  const login = useCallback(
    async (creds: Credentials) => {
      const { token } = await authApi.login(creds);
      setToken(token);
      await refreshUser();
      setAuthModalOpen(false);
    },
    [refreshUser],
  );

  const register = useCallback(
    async (creds: Credentials) => {
      await authApi.register(creds);
      await login(creds);
    },
    [login],
  );

  // 401 в любом защищённом запросе -> выходим
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  // восстановление сессии по сохранённому токену
  useEffect(() => {
    if (!getToken()) return;
    refreshUser()
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, [refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthModalOpen,
      openAuthModal: () => setAuthModalOpen(true),
      closeAuthModal: () => setAuthModalOpen(false),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, isAuthModalOpen, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
