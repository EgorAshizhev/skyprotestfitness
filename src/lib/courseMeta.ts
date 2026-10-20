// API не отдаёт картинки и цвета карточек, поэтому сопоставляем по nameEN.
// Картинки лежат в public/ и доступны по адресу /<файл>.

interface CourseMeta {
  image: string; // имя файла в public/
  bg: string; // цвет фона карточки, пока грузится картинка
}

const META: Array<{ match: string; meta: CourseMeta }> = [
  { match: 'yoga', meta: { image: 'yoga.jpg', bg: 'bg-[#FFC700]' } },
  { match: 'stretch', meta: { image: 'stretching.jpg', bg: 'bg-[#2491D2]' } },
  { match: 'step', meta: { image: 'stepairobika.jpg', bg: 'bg-[#FF7E66]' } },
  { match: 'body', meta: { image: 'bodyflex.jpg', bg: 'bg-[#7D458C]' } },
  { match: 'fitness', meta: { image: 'fitness.jpg', bg: 'bg-[#F7A012]' } },
];

const FALLBACK: CourseMeta = { image: '', bg: 'bg-gray-300' };

export const getCourseMeta = (nameEN: string): CourseMeta => {
  const key = nameEN.toLowerCase();
  return META.find((m) => key.includes(m.match))?.meta ?? FALLBACK;
};

export const courseImage = (nameEN: string): string => {
  const { image } = getCourseMeta(nameEN);
  return image ? `/${image}` : '';
};
