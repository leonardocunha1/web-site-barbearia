import { Marquee } from "@/shared/components/magicui/marquee";

const items = [
  "Corte clássico",
  "Barba navalhada",
  "Toalha quente",
  "Bigode aparado",
  "Sobrancelha",
  "Pigmentação capilar",
  "Lavagem premium",
  "Café da casa",
];

export function MarqueeDetails() {
  return (
    <section
      aria-label="Serviços em destaque"
      className="bg-foreground text-background border-cobre-700/30 relative w-full overflow-hidden border-y"
    >
      {/* paper-grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "5px 5px",
        }}
        aria-hidden
      />

      <Marquee
        className="[--duration:48s] [--gap:0px] py-5"
        repeat={4}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="font-display flex items-center gap-8 px-8 text-2xl tracking-tight sm:text-3xl md:text-4xl"
          >
            <span className="text-background/95">{item}</span>
            <span
              className="text-cobre-400 inline-block translate-y-[-0.15em] text-2xl"
              aria-hidden
            >
              ✦
            </span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
