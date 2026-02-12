import { Button } from "@/shared/components/ui/button";

interface ProfessionalActionsProps {
  onAdd: () => void;
  isPending?: boolean;
}

export function ProfessionalActions({
  onAdd,
  isPending,
}: ProfessionalActionsProps) {
  return (
    <div>
      <Button
        onClick={onAdd}
        disabled={isPending}
        className="bg-principal-500 hover:bg-principal-600 cursor-pointer text-white"
      >
        Novo Profissional
      </Button>
    </div>
  );
}

