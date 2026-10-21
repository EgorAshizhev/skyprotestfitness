import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ChevronDownIcon, UserAvatarIcon } from './Icons';

/** Меню пользователя из макета: имя, email, «Мой профиль» и «Выйти». */
export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // закрываем по клику вне меню и по Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;
  const name = user.email.split('@')[0] || 'Пользователь';

  const onLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 text-lg"
      >
        <UserAvatarIcon />
        <span className="hidden max-w-40 truncate sm:block">{name}</span>
        <ChevronDownIcon open={open} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-3 w-[266px] rounded-3xl bg-white p-6 text-center shadow-[0_4px_67px_-12px_rgba(0,0,0,0.25)]"
        >
          <p className="truncate text-lg">{name}</p>
          <p className="mb-6 truncate text-sm text-gray-400">{user.email}</p>

          <Link
            to="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mb-3 block rounded-full bg-brand px-6 py-3 transition-opacity hover:opacity-80"
          >
            Мой профиль
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="w-full rounded-full border border-black px-6 py-3 transition-colors hover:bg-gray-100"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}
