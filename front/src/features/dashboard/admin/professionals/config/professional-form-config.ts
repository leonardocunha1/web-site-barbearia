import { z } from "zod";
import { FormField } from "@/shared/components/form/types";

const optionalString = (schema: z.ZodString) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional(),
  );

export const professionalSchema = z.object({
  email: z.string().email("Email inválido"),
  name: optionalString(z.string().min(2, "Nome inválido")),
  phone: optionalString(
    z.string().regex(/^\+?[\d\s()-]{10,20}$/, "Telefone inválido"),
  ),
  especialidade: z.string().min(1, "Informe a função"),
  ativo: z.enum(["Ativo", "Inativo"], {
    errorMap: () => ({ message: "Selecione um status" }),
  }),
});

export const professionalFields: FormField[] = [
  {
    name: "name",
    label: "Nome",
    type: "text",
    placeholder: "Digite o nome",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Digite o email",
  },
  {
    name: "phone",
    label: "Telefone",
    type: "text",
    placeholder: "(11) 99999-9999",
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
    name: "ativo",
    label: "Status",
    type: "select",
    placeholder: "Selecione o status",
    options: [
      { value: "Ativo", label: "Ativo" },
      { value: "Inativo", label: "Inativo" },
    ],
  },
];
