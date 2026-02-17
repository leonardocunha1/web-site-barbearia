"use client";

import { useOverlay } from "@/shared/hooks/useOverlay";
import { serviceFields, serviceSchema } from "../config/service-form-config";

export type ServiceFormValues = {
  nome: string;
  descricao?: string;
  categoria?: string;
  tipo: "CORTE" | "BARBA" | "SOBRANCELHA" | "ESTETICA";
  ativo: "Ativo" | "Inativo";
};

type OpenServiceFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<ServiceFormValues>;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
};

export function useServiceFormModal() {
  const { open } = useOverlay();

  const openServiceForm = ({
    mode,
    initialValues,
    onSubmit,
  }: OpenServiceFormProps) => {
    open(
      {
        schema: serviceSchema,
        fields: serviceFields,
        defaultButton: true,
        buttonText: mode === "create" ? "Adicionar" : "Salvar",
        resetAfterSubmit: mode === "create",
        initialValues: {
          nome: "",
          tipo: "CORTE",
          descricao: "",
          categoria: "",
          ...initialValues,
        },
        onSubmit,
      },
      {
        type: "form",
        renderAs: "modal",
        title: mode === "create" ? "Adicionar Serviço" : "Editar Serviço",
      },
    );
  };

  return { openServiceForm };
}
