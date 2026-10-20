export default function ScrollToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="mx-auto mb-14 mt-10 block rounded-full bg-brand px-7 py-3 text-lg transition-opacity hover:opacity-80"
    >
      Наверх ↑
    </button>
  );
}
