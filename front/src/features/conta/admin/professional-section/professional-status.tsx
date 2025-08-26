import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfessionalStatus({ value }: { value: string }) {
  return (
    <Button
      variant={value === "Ativo" ? "default" : "destructive"}
      size="sm"
      className={cn(
        "font-medium transition-all duration-200",
        "min-w-[80px]",
        value === "Ativo"
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-red-500 text-white hover:bg-red-600",
        "shadow-sm hover:shadow-md",
        "rounded-full",
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-white" />
        {value}
      </div>
    </Button>
  );
}
