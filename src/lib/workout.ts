/**
 * Название тренировки в API: «Утренняя практика / Йога на каждый день / 1 день / Алексей Казубский»
 * (иногда просто «Урок 2. Основные движения»). Макет показывает заголовок и подпись без автора.
 */
export const parseWorkoutName = (name: string): { title: string; subtitle: string } => {
  const parts = name.split(' / ').map((p) => p.trim());
  const [title, ...rest] = parts;
  const subtitleParts = rest.length >= 3 ? rest.slice(0, -1) : rest;
  return { title, subtitle: subtitleParts.join(' / ') };
};

/** «Наклоны вперёд (10 повторений)» -> «Наклоны вперёд» */
export const exerciseLabel = (name: string): string => name.replace(/\s*\([^)]*\)\s*$/, '').trim();

/** «Наклоны вперёд» -> «Сколько раз вы сделали наклоны вперёд?» */
export const progressQuestion = (name: string): string => {
  const label = exerciseLabel(name);
  return `Сколько раз вы сделали ${label.charAt(0).toLowerCase()}${label.slice(1)}?`;
};

/** В части данных лежат нерабочие ссылки вроде youtu.be/embed/ID: приводим к embed-формату. */
export const toEmbedUrl = (url: string): string => {
  const id =
    /youtu\.be\/embed\/([\w-]{6,})/.exec(url)?.[1] ??
    /youtu\.be\/([\w-]{6,})/.exec(url)?.[1] ??
    /youtube\.com\/watch\?(?:.*&)?v=([\w-]{6,})/.exec(url)?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : url;
};

/** Номер урока из названия: «Урок 3. Новые движения» или «… / 2 день …». Если номера нет, undefined. */
export const workoutNumber = (name: string): number | undefined => {
  const match = /Урок\s*(\d+)/i.exec(name) ?? /(\d+)\s*день/i.exec(name);
  return match ? Number(match[1]) : undefined;
};

/** Тренировки по порядку 1, 2, 3…; без номера в названии остаются в порядке API (после нумерованных). */
export const sortWorkouts = <T extends { name: string }>(workouts: T[]): T[] =>
  workouts
    .map((w, i) => ({ w, i, n: workoutNumber(w.name) ?? Number.POSITIVE_INFINITY }))
    .sort((a, b) => a.n - b.n || a.i - b.i)
    .map(({ w }) => w);
