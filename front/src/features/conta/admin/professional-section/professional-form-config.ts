import { z } from "zod";
import { FormField } from "@/components/form/types";

export const professionalSchema = z.object({
  email: z.string().email("Email inválido"),
  especialidade: z.string().min(1, "Informe a função"),
  status: z.enum(["Ativo", "Inativo"], {
    errorMap: () => ({ message: "Selecione um status" }),
  }),
});

export const professionalFields: FormField[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Digite o email",
  },
  {
    name: "especialidade",
    label: "Especialidade",
    type: "select",
    placeholder: "Selecione a especialidade",
    options: [
      { value: "Cabeleireiro", label: "Cabeleireiro" },
      { value: "Barbeiro", label: "Barbeiro" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Selecione o status",
    options: [
      { value: "Ativo", label: "Ativo" },
      { value: "Inativo", label: "Inativo" },
    ],
  },
];
