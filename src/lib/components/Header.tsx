import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, openAuthModal } = useAuth();

  return (
    <header className="flex items-center justify-between py-6">
      <Link to="/">
        <span className="text-xl font-medium">SkyFitnessPro</span>
        <p className="text-sm text-gray-500">Онлайн-тренировки для занятий дома</p>
      </Link>

      {user ? (
        <Link to="/profile">{user.email.split('@')[0]}</Link>
      ) : (
        <button onClick={openAuthModal} className="rounded-full bg-lime-300 px-6 py-2">
          Войти
        </button>
      )}
    </header>
  );
}
