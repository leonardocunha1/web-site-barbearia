"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface GoBackButtonProps {
  href?: string;
  label?: string;
}

export function GoBackButton({ href, label = "Voltar" }: GoBackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-sm text-stone-600 transition hover:text-stone-900"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
