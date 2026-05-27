import { cn } from "@/shared/utils/utils";

export type LoadingStateProps = {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "block" | "inline";
  className?: string;
};

const sizeStyles = {
  sm: {
    spinner: "h-5 w-5 border-2",
    dot: "h-1.5 w-1.5",
    text: "text-xs",
  },
  md: {
    spinner: "h-9 w-9 border-2",
    dot: "h-2.5 w-2.5",
    text: "text-sm",
  },
  lg: {
    spinner: "h-12 w-12 border-2",
    dot: "h-3 w-3",
    text: "text-base",
  },
};

export function LoadingState({
  message = "Carregando...",
  size = "md",
  variant = "block",
  className,
}: LoadingStateProps) {
  const styles = sizeStyles[size];
  const isInline = variant === "inline";

  return (
    <div
      className={cn(
        "flex",
        isInline ? "items-center gap-2" : "flex-col items-center gap-3",
        className,
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "border-foreground/15 border-t-cobre-600 animate-spin rounded-full",
            styles.spinner,
          )}
        />
        <div
          className={cn(
            "bg-cobre-600/70 absolute inset-0 m-auto animate-pulse rounded-full",
            styles.dot,
          )}
        />
      </div>
      {message ? (
        <p
          className={cn(
            "text-foreground/70 font-mono tracking-widest uppercase",
            styles.text,
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
