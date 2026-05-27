interface BookingStepHeaderProps {
  step: string;
  title: string;
  highlight?: string;
  description: string;
}

export function BookingStepHeader({
  step,
  title,
  highlight,
  description,
}: BookingStepHeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="bg-foreground/60 h-px w-8" aria-hidden />
        <span className="text-foreground/70 font-mono text-[10px] tracking-[0.25em] uppercase">
          Passo {step}
        </span>
      </div>
      <h3 className="font-display text-foreground text-2xl leading-tight font-medium tracking-tight sm:text-3xl">
        {title}
        {highlight && (
          <>
            {" "}
            <span className="text-cobre-700 italic">{highlight}</span>
          </>
        )}
        .
      </h3>
      <p className="text-foreground/70 max-w-prose text-sm">{description}</p>
    </header>
  );
}
