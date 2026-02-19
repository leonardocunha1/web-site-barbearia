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
    spinner: "h-9 w-9 border-4",
    dot: "h-2.5 w-2.5",
    text: "text-sm",
  },
  lg: {
    spinner: "h-12 w-12 border-4",
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
        isInline ? "items-center gap-2" : "flex-col items-center gap-2",
        className,
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "animate-spin rounded-full border-stone-200 border-t-principal-500",
            styles.spinner,
          )}
        />
        <div
          className={cn(
            "absolute inset-0 m-auto animate-pulse rounded-full bg-principal-500/70",
            styles.dot,
          )}
        />
      </div>
      {message ? (
        <p className={cn("text-principal-600", styles.text)}>{message}</p>
      ) : null}
    </div>
  );
}
