"use client";

import { InstagramLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react";

interface SocialButtonProps {
  href: string;
  label?: string;
  colorClass: string;
  type: "whatsapp" | "instagram";
}

export function SocialButton({
  href,
  label,
  colorClass,
  type,
}: SocialButtonProps) {
  const icon =
    type === "whatsapp" ? (
      <WhatsappLogoIcon size={20} weight="fill" />
    ) : (
      <InstagramLogoIcon size={20} weight="fill" />
    );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-lg ${colorClass} text-principal-200 px-4 py-2 transition-colors duration-200 hover:brightness-110`}
    >
      <span className={label ? "mr-2" : ""}>{icon}</span>
      {label && <span>{label}</span>}
    </a>
  );
}
