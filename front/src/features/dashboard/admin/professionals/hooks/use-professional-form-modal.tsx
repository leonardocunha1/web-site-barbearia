"use client";

import { useOverlay } from "@/shared/hooks/useOverlay";
import {
  professionalSchema,
  professionalFields,
} from "../config/professional-form-config";

export type ProfessionalFormValues = {
  name?: string;
  email: string;
  phone?: string;
  specialty: string;
  status: "active" | "inactive";
};

type OpenProfessionalFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<ProfessionalFormValues>;
  onSubmit: (values: ProfessionalFormValues) => Promise<void>;
};

export function useProfessionalFormModal() {
  const { open } = useOverlay();

  const openProfessionalForm = ({
    mode,
    initialValues,
    onSubmit,
  }: OpenProfessionalFormProps) => {
    open(
      {
        schema: professionalSchema,
        fields: professionalFields,
        defaultButton: true,
        buttonText: mode === "create" ? "Adicionar" : "Salvar",
        resetAfterSubmit: mode === "create",
        initialValues: {
          name: "",
          email: "",
          phone: "",
          specialty: "",
          status: "active",
          ...initialValues,
        },
        onSubmit,
      },
      {
        type: "form",
        renderAs: "modal",
        title:
          mode === "create" ? "Adicionar Profissional" : "Editar Profissional",
      },
    );
  };

  return { openProfessionalForm };
}
