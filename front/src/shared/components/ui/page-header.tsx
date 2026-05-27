import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/shared/utils/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: Icon;
  kicker?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  icon: IconComponent,
  kicker = "Painel · El Bigodón",
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "border-foreground/15 flex flex-col gap-3 border-b pb-6",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="bg-foreground/60 h-px w-8" aria-hidden />
        <span className="text-foreground/70 font-mono text-[10px] tracking-[0.25em] uppercase">
          {kicker}
        </span>
      </div>
      <div className="flex items-start gap-4">
        {IconComponent ? (
          <IconComponent
            className="text-cobre-700 h-7 w-7 shrink-0"
            weight="duotone"
          />
        ) : null}
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-foreground text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="text-foreground/70 max-w-prose text-sm sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
