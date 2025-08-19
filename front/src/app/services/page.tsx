"use client";

import { useOverlay } from "@/hooks/useOverlay";

export default function Page() {
  const overlay = useOverlay();

  const handleOpenModal = () => {
    overlay.open(
      <div className="p-4">
        <p>Conteúdo do Modal</p>
      </div>,
      {
        type: "form",
        title: "Título do Modal",
        size: "md",
      },
    );
  };

  return (
    <div className="flex-1 bg-stone-500 pt-[124px]">
      <h1>Teste</h1>
      <button
        onClick={handleOpenModal}
        className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
      >
        Abrir Modal
      </button>
    </div>
  );
}
