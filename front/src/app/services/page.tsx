'use client'

import { useOverlay } from "@/hooks/useOverlay";

export default function Page() {
  const overlay = useOverlay();

  const handleOpenModal = () => {
    overlay.open(
      <div className="p-4">
        <p>Conteúdo do Modal</p>
      </div>,
      {
        type: 'modal',
        title: 'Título do Modal',
        size: 'md',
      }
    );
  };

  return (
    <div className="pt-[124px] flex-1 bg-stone-500">
      <h1>Teste</h1>
      <button
        onClick={handleOpenModal}
        className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
      >
        Abrir Modal
      </button>
    </div>
  );
}
