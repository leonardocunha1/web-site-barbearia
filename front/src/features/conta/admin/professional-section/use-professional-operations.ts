import { useCallback } from "react";
import { toast } from "sonner";
import {  useCreateProfessional, useUpdateProfessional } from "@/api";
import { ProfessionalFormValues } from "./professional-form-modal";

interface Professional {
  id: string;
  name: string;
  email: string;
  especialidade: string;
  ativo: string;
}

export function useProfessionalOperations(refetch: () => void) {
  const { mutateAsync: createProfessional, isPending: isCreating } = useCreateProfessional();
  const { mutateAsync: updateProfessional, isPending: isUpdating } = useUpdateProfessional();
  

  const handleCreate = useCallback(async (values: ProfessionalFormValues) => {
    try {
      await createProfessional({ data: { ...values, ativo: values.ativo === "Ativo" } });
      toast.success("Profissional criado com sucesso!");
      refetch();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao criar profissional";
      toast.error(message);
    }
  }, [createProfessional, refetch]);

  const handleUpdate = useCallback(async (professional: Professional, values: ProfessionalFormValues) => {
    try {
      await updateProfessional({ id: professional.id, data: { ...values, ativo: values.ativo === "Ativo" } });
      toast.success("Profissional atualizado com sucesso!");
      refetch();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar profissional";
      toast.error(message);
    }
  }, [updateProfessional, refetch]);

  return {
    handleCreate,
    handleUpdate,
    isCreating,
    isUpdating,
    isPending: isCreating || isUpdating,
  };
}
