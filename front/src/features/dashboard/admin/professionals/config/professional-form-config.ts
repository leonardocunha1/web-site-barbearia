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
  specialty: z.string().min(1, "Informe a função"),
  status: z.enum(["active", "inactive"], {
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
    name: "specialty",
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
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
];
