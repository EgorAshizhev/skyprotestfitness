
export const parseWorkoutName = (name: string): { title: string; subtitle: string } => {
  const parts = name.split(' / ').map((p) => p.trim());
  const [title, ...rest] = parts;
  const subtitleParts = rest.length >= 3 ? rest.slice(0, -1) : rest;
  return { title, subtitle: subtitleParts.join(' / ') };
};

export const exerciseLabel = (name: string): string => name.replace(/\s*\([^)]*\)\s*$/, '').trim();


export const progressQuestion = (name: string): string => {
  const label = exerciseLabel(name);
  return `Сколько раз вы сделали ${label.charAt(0).toLowerCase()}${label.slice(1)}?`;
};


export const toEmbedUrl = (url: string): string => {
  const id =
    /youtu\.be\/embed\/([\w-]{6,})/.exec(url)?.[1] ??
    /youtu\.be\/([\w-]{6,})/.exec(url)?.[1] ??
    /youtube\.com\/watch\?(?:.*&)?v=([\w-]{6,})/.exec(url)?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : url;
};


export const workoutNumber = (name: string): number | undefined => {
  const match = /Урок\s*(\d+)/i.exec(name) ?? /(\d+)\s*день/i.exec(name);
  return match ? Number(match[1]) : undefined;
};


export const sortWorkouts = <T extends { name: string }>(workouts: T[]): T[] =>
  workouts
    .map((w, i) => ({ w, i, n: workoutNumber(w.name) ?? Number.POSITIVE_INFINITY }))
    .sort((a, b) => a.n - b.n || a.i - b.i)
    .map(({ w }) => w);
