import { Button } from "@/shared/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";

interface ProfessionalActionsProps {
  onAdd: () => void;
  isPending?: boolean;
}

export function ProfessionalActions({
  onAdd,
  isPending,
}: ProfessionalActionsProps) {
  return (
    <div className="flex justify-end">
      <Button
        onClick={onAdd}
        disabled={isPending}
        variant="editorial"
        size="sm"
        className="gap-2"
      >
        <PlusIcon weight="bold" className="h-4 w-4" />
        Novo profissional
      </Button>
    </div>
  );
}

