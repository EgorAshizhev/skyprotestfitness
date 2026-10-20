// API не отдаёт картинки и цвета карточек, поэтому сопоставляем по nameEN.
// Положите изображения из Figma в public/img/courses/<slug>.png

interface CourseMeta {
  slug: string;
  bg: string; // цвет фона карточки (Tailwind)
}

const META: Array<{ match: string; meta: CourseMeta }> = [
  { match: 'yoga', meta: { slug: 'yoga', bg: 'bg-[#FFC700]' } },
  { match: 'stretch', meta: { slug: 'stretching', bg: 'bg-[#2491D2]' } },
  { match: 'step', meta: { slug: 'step-aerobics', bg: 'bg-[#F7A012]' } },
  { match: 'body', meta: { slug: 'bodyflex', bg: 'bg-[#7D458C]' } },
  { match: 'fitness', meta: { slug: 'fitness', bg: 'bg-[#F7A012]' } },
];

const FALLBACK: CourseMeta = { slug: 'default', bg: 'bg-gray-300' };

export const getCourseMeta = (nameEN: string): CourseMeta => {
  const key = nameEN.toLowerCase();
  return META.find((m) => key.includes(m.match))?.meta ?? FALLBACK;
};

export const courseImage = (nameEN: string): string =>
  `/img/courses/${getCourseMeta(nameEN).slug}.png`;
