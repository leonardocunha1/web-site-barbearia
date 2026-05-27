"use client";

import { WhatsappLogoIcon } from "@phosphor-icons/react";

export function WhatsAppFloat() {
  const phoneNumber = "5511999999999";
  const message = "Olá! Gostaria de agendar um horário no El Bigodón.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="group fixed right-5 bottom-5 z-50 sm:right-7 sm:bottom-7"
    >
      <span className="bg-foreground text-background border-cobre-500 hover:bg-cobre-700 relative flex h-14 items-center gap-3 border-2 px-5 shadow-[4px_4px_0_0_var(--color-cobre-700)] transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:h-15 sm:px-6">
        <WhatsappLogoIcon weight="fill" className="size-5 shrink-0" />
        <span className="hidden font-mono text-[11px] tracking-[0.22em] uppercase sm:inline">
          Fale conosco
        </span>
      </span>
    </a>
  );
}
