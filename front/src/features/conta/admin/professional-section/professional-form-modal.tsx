"use client";

import { useOverlay } from "@/hooks/useOverlay";
import {
  professionalSchema,
  professionalFields,
} from "./professional-form-config";
import { CreateProfessionalBody } from "@/api";

export type ProfessionalFormValues = Omit<CreateProfessionalBody, "ativo"> & {
  ativo: "Ativo" | "Inativo";
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
          email: "",
          especialidade: "",
          ativo: "Ativo",
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
