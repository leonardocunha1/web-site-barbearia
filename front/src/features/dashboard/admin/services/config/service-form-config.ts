import { FormField } from "@/shared/components/form/types";
import { z } from "zod";

export const serviceSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome do serviço deve ter pelo menos 3 caracteres" })
    .max(100, { message: "O nome do serviço não pode exceder 100 caracteres" }),
  tipo: z.enum(["CORTE", "BARBA", "SOBRANCELHA", "ESTETICA"], {
    errorMap: () => ({ message: "Selecione um tipo" }),
  }),
  descricao: z
    .string()
    .max(500, { message: "A descrição não pode exceder 500 caracteres" })
    .optional(),
  categoria: z
    .string()
    .max(50, { message: "A categoria não pode exceder 50 caracteres" })
    .optional(),
  ativo: z.enum(["Ativo", "Inativo"], {
    errorMap: () => ({ message: "Selecione um status" }),
  }),
});

export const serviceFields: FormField[] = [
  { name: "nome", label: "Nome", type: "text" },
  {
    name: "tipo",
    label: "Tipo",
    type: "select",
    options: [
      { value: "CORTE", label: "Corte" },
      { value: "BARBA", label: "Barba" },
      { value: "SOBRANCELHA", label: "Sobrancelha" },
      { value: "ESTETICA", label: "Estetica" },
    ],
  },
  { name: "descricao", label: "Descrição", type: "textarea" },
  {
    name: "categoria",
    label: "Detalhe",
    type: "text",
  },
  {
    name: "ativo",
    label: "Status",
    type: "select",
    options: [
      { value: "Ativo", label: "Ativo" },
      { value: "Inativo", label: "Inativo" },
    ],
  },
];
