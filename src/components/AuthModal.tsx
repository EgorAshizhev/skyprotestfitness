import { useState, type FormEvent } from 'react';
import { ApiError } from '../api/client';
import { useAuth } from '../context/useAuth';
import { validateEmail, validatePassword } from '../lib/validation';

type Mode = 'login' | 'register';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!isAuthModalOpen) return null;

  const submit = async (mode: Mode) => {
    setError(null);

    if (!email || !password) return setError('Заполните все поля');
    if (mode === 'register') {
      // на входе пароль не проверяем: правила нужны только при регистрации
      const msg = validateEmail(email) ?? validatePassword(password);
      if (msg) return setError(msg);
    }

    setPending(true);
    try {
      await (mode === 'login' ? login : register)({ email, password });
      setPassword('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Что-то пошло не так');
    } finally {
      setPending(false);
    }
  };

  // Enter в форме = «Войти»
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit('login');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={closeAuthModal}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-[360px] rounded-3xl bg-white p-10 shadow-xl"
      >
        <h2 className="mb-8 text-2xl font-medium">SkyFitnessPro</h2>

        <input
          type="email"
          placeholder="Логин"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mb-4 w-full rounded-lg border px-4 py-3 ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`mb-4 w-full rounded-lg border px-4 py-3 ${error ? 'border-red-500' : 'border-gray-300'}`}
        />

        {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mb-3 w-full rounded-full bg-lime-300 py-3 disabled:opacity-60"
        >
          Войти
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => void submit('register')}
          className="w-full rounded-full border border-black py-3 disabled:opacity-60"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
