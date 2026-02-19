import { cn } from "@/shared/utils/utils";
import { AlertTriangle, Info, XCircle } from "lucide-react";

export type ErrorStateType = "error" | "warning" | "info";

export type ErrorStateProps = {
  message?: string;
  type?: ErrorStateType;
  variant?: "block" | "inline";
  className?: string;
};

const typeStyles: Record<ErrorStateType, {
  className: string;
  icon: typeof XCircle;
}> = {
  error: {
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: XCircle,
  },
  warning: {
    className: "border-amber-200 bg-amber-50 text-amber-800",
    icon: AlertTriangle,
  },
  info: {
    className: "border-sky-200 bg-sky-50 text-sky-700",
    icon: Info,
  },
};

export function ErrorState({
  message = "Algo deu errado.",
  type = "error",
  variant = "block",
  className,
}: ErrorStateProps) {
  if (!message) return null;

  const styles = typeStyles[type];
  const Icon = styles.icon;
  const isInline = variant === "inline";

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm",
        !isInline && "rounded-md border px-3 py-2",
        styles.className,
        isInline && "border-transparent bg-transparent px-0 py-0",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
