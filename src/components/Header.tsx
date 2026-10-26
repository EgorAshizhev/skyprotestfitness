import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LogoIcon } from './Icons';
import UserMenu from './UserMenu';

export default function Header() {
  const { user, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-30 mb-4 flex items-center justify-between bg-[#fafafa] py-4 sm:mb-8 sm:items-start sm:py-5 md:mb-10">
      <Link to="/" className="block">
        <div className="flex items-center gap-2">
          <LogoIcon />
          <span className="text-xl font-medium sm:text-2xl">SkyFitnessPro</span>
        </div>
        <p className="mt-2 hidden text-sm text-gray-500 sm:block">
          Онлайн-тренировки для занятий дома
        </p>
      </Link>

      {user ? (
        <UserMenu />
      ) : (
        <button
          type="button"
          onClick={openAuthModal}
          className="btn-primary px-5 py-2 text-base sm:px-7 sm:py-3 sm:text-lg"
        >
          Войти
        </button>
      )}
    </header>
  );
}
