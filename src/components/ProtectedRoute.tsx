import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/** Профиль и тренировки доступны только авторизованным. */
export default function ProtectedRoute() {
  const { user, isLoading, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) openAuthModal();
  }, [isLoading, user, openAuthModal]);

  if (isLoading) return null; // или спиннер
  if (!user) return <Navigate to="/" replace />;
  return <Outlet />;
}
