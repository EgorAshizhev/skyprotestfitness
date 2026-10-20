import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LogoIcon } from './Icons';

export default function Header() {
  const { user, openAuthModal } = useAuth();

  return (
    <header className="flex items-start justify-between pb-10 pt-10 md:pb-14">
      <Link to="/" className="block">
        <div className="flex items-center gap-2">
          <LogoIcon />
          <span className="text-2xl font-medium">SkyFitnessPro</span>
        </div>
        <p className="mt-2 hidden text-sm text-gray-500 sm:block">
          Онлайн-тренировки для занятий дома
        </p>
      </Link>

      {user ? (
        <Link to="/profile" className="text-lg">
          {user?.email?.split('@')[0] || 'Пользователь'}
        </Link>
      ) : (
        <button
          type="button"
          onClick={openAuthModal}
          className="rounded-full bg-brand px-7 py-3 text-lg transition-opacity hover:opacity-80"
        >
          Войти
        </button>
      )}
    </header>
  );
}
