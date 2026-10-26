import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';
import { clearToken, getToken, setToken } from '../lib/token';
import type { Credentials, User } from '../types';
import { AuthContext, type AuthContextValue } from './authContextValue';

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
    [refreshUser]
  );

  const register = useCallback(
    async (creds: Credentials) => {
      await authApi.register(creds);
      await login(creds);
    },
    [login]
  );

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    authApi
      .getMe()
      .then((u) => !cancelled && setUser(u))
      .catch(() => clearToken())
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

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
    [user, isLoading, isAuthModalOpen, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
