export default function ScrollToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="mx-auto my-10 block rounded-full bg-lime-300 px-6 py-3"
    >
      Наверх ↑
    </button>
  );
}
