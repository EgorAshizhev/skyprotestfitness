import { useEffect, type ReactNode } from 'react';

interface Props {
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

/** Затемнение + белая карточка по центру. Закрывается по Escape и клику вне окна. */
export default function Modal({ onClose, children, className = '' }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`max-h-full w-full overflow-y-auto rounded-[30px] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.25)] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
