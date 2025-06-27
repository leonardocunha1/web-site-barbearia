import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export interface ErrorMessageProps extends ComponentPropsWithoutRef<"p"> {
  message?: string;
  className?: string;
}

const ErrorMessage = forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  ({ message, className, ...props }, ref) => {
    if (!message) return null;

    return (
      <p
        ref={ref}
        className={cn(
          "text-destructive flex items-center gap-2 text-sm font-medium",
          className,
        )}
        {...props}
      >
        <ExclamationTriangleIcon className="h-4 w-4" />
        <span>{message}</span>
      </p>
    );
  },
);

ErrorMessage.displayName = "ErrorMessage";

export { ErrorMessage };
