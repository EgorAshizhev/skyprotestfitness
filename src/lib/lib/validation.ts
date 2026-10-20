const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): string | null =>
  EMAIL_RE.test(email) ? null : 'Введите корректный Email';

/** Возвращает текст первой ошибки или null. Сообщения совпадают с API. */
export const validatePassword = (password: string): string | null => {
  if (password.length < 6) return 'Пароль должен содержать не менее 6 симоволов';
  const special = password.match(/[^\p{L}\p{N}\s]/gu)?.length ?? 0;
  if (special < 2) return 'Пароль должен содержать не менее 2 спецсимволов';
  if (!/\p{Lu}/u.test(password)) {
    return 'Пароль должен содержать как минимум одну заглавную букву';
  }
  return null;
};
