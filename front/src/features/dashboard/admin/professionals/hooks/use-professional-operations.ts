import { useCallback } from "react";
import { toast } from "sonner";
import { useCreateProfessional, useUpdateProfessional, zodupdateProfessionalBody, zodupdateProfessionalParams } from "@/api";
import { ProfessionalFormValues } from "./use-professional-form-modal";
import { z } from "zod";

export type Professional = z.infer<typeof zodupdateProfessionalBody> & z.infer<typeof zodupdateProfessionalParams>;

export function useProfessionalOperations(refetch: () => void) {
  const { mutateAsync: createProfessional, isPending: isCreating } =
    useCreateProfessional();
  const { mutateAsync: updateProfessional, isPending: isUpdating } =
    useUpdateProfessional();

  const handleCreate = useCallback(
    async (values: ProfessionalFormValues) => {
      try {
        await createProfessional({
          data: {
            email: values.email,
            specialty: values.specialty,
            active: values.status === "active",
          },
        });
        toast.success("Profissional criado com sucesso!");
        refetch();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro ao criar profissional";
        toast.error(message);
      }
    },
    [createProfessional, refetch],
  );

  const handleUpdate = useCallback(
    async (professional: Professional, values: ProfessionalFormValues) => {
      try {
        await updateProfessional({
          id: professional.id,
          data: {
            name: values.name,
            email: values.email,
            phone: values.phone ?? null,
            specialty: values.specialty,
            active: values.status === "active",
          },
        });
        toast.success("Profissional atualizado com sucesso!");
        refetch();
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro ao atualizar profissional";
        toast.error(message);
      }
    },
    [updateProfessional, refetch],
  );

  return {
    handleCreate,
    handleUpdate,
    isCreating,
    isUpdating,
    isPending: isCreating || isUpdating,
  };
}
