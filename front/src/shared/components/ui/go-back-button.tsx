"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react";

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
      className="text-foreground/70 hover:text-foreground group flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-colors"
    >
      <ArrowLeftIcon
        weight="bold"
        className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
      />
      {label}
    </button>
  );
}
