import { z } from "zod";

export const workingHoursSchema = z.object({
  monday: z.array(z.string()).length(2),
  tuesday: z.array(z.string()).length(2),
  wednesday: z.array(z.string()).length(2),
  thursday: z.array(z.string()).length(2),
  friday: z.array(z.string()).length(2),
  saturday: z.array(z.string()).length(2),
  sunday: z.array(z.string()).max(2),
});

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido"),
  specialty: z.enum(
    ["Barbeiro", "Cabeleireiro", "Esteticista", "Manicure", "Outro"],
    {
      errorMap: () => ({ message: "Selecione uma especialidade válida" }),
    },
  ),
  bio: z
    .string()
    .min(10, "Biografia deve ter no mínimo 10 caracteres")
    .max(500, "Biografia muito longa"),
  services: z.array(z.string().min(1)).min(1, "Adicione ao menos um serviço"),
  workingHours: workingHoursSchema,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type WorkingHours = z.infer<typeof workingHoursSchema>;
