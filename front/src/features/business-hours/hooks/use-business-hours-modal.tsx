"use client";

import { useOverlay } from "@/shared/hooks/useOverlay";
import { BusinessHoursFormModal } from "../components/business-hours-form-modal";
import type { BusinessHoursFormValues } from "../schemas/business-hours-form-schema";

type OpenBusinessHoursModalProps = {
  mode: "create" | "edit";
  initialValues?: Partial<BusinessHoursFormValues>;
  onSubmit: (values: BusinessHoursFormValues) => Promise<void>;
  isSaving?: boolean;
};

export function useBusinessHoursModal() {
  const { open, close } = useOverlay();

  const openBusinessHoursModal = ({
    mode,
    initialValues,
    onSubmit,
    isSaving,
  }: OpenBusinessHoursModalProps) => {
    open(
      <BusinessHoursFormModal
        mode={mode}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onClose={close}
        isSaving={isSaving}
      />,
      {
        type: "modal",
        title: mode === "create" ? "Novo horario" : "Editar horario",
        size: "md",
      },
    );
  };

  return { openBusinessHoursModal };
}
