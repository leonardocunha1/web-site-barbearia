import Link from "next/link";
import {
  InstagramLogoIcon,
  WhatsappLogoIcon,
  MapPinIcon,
} from "@phosphor-icons/react";

const linkColumns = [
  {
    label: "Navegação",
    items: [
      { name: "Agendar", href: "/agendar" },
      { name: "Serviços", href: "/#servicos" },
      { name: "Minha conta", href: "/cliente" },
    ],
  },
  {
    label: "Informações",
    items: [
      { name: "Ter — Sáb · 09h às 19h", href: null },
      { name: "Rua Exemplo, 123 — Franca/SP", href: null },
      { name: "(35) 9 9999-9999", href: null },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background w-full">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          {/* Identidade */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="bg-cobre-500 h-px w-8" aria-hidden />
              <span className="text-background/70 font-mono text-[10px] tracking-[0.25em] uppercase">
                Estd. MMXXIV
              </span>
            </div>
            <h2 className="font-display text-background text-3xl font-medium tracking-tight">
              El Bigodón
            </h2>
            <p className="text-background/65 max-w-xs text-sm leading-relaxed">
              Templo do bom gosto masculino em Franca — SP. Corte na régua,
              barba afiada, estilo de verdade.
            </p>
          </div>

          {/* Colunas de links */}
          {linkColumns.map((col) => (
            <div key={col.label} className="space-y-3">
              <p className="text-background/60 font-mono text-[10px] tracking-[0.25em] uppercase">
                {col.label}
              </p>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.name}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-background/85 hover:text-cobre-300 text-sm transition-colors"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className="text-background/85 text-sm">
                        {item.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div className="space-y-3">
            <p className="text-background/60 font-mono text-[10px] tracking-[0.25em] uppercase">
              Social
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/85 hover:text-cobre-300 flex items-center gap-2 text-sm transition-colors"
              >
                <InstagramLogoIcon weight="bold" className="h-4 w-4" />
                Instagram
              </a>
              <a
                href="https://wa.me/5535999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/85 hover:text-cobre-300 flex items-center gap-2 text-sm transition-colors"
              >
                <WhatsappLogoIcon weight="bold" className="h-4 w-4" />
                WhatsApp
              </a>
              <span className="text-background/85 flex items-center gap-2 text-sm">
                <MapPinIcon weight="bold" className="h-4 w-4" />
                Centro · Franca SP
              </span>
            </div>
          </div>
        </div>

        <div className="border-background/15 mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-background/60 font-mono text-[10px] tracking-widest uppercase">
            © {new Date().getFullYear()} · El Bigodón · Todos os direitos reservados
          </p>
          <p className="text-background/40 font-mono text-[10px] tracking-widest uppercase">
            N° 01 · Barber Shop
          </p>
        </div>
      </div>
    </footer>
  );
}
