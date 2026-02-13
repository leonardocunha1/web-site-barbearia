import { z } from "zod";

export const bookingFormSchema = z.object({
  professionalId: z.string().uuid({ message: "Selecione um profissional" }),
  date: z.string().min(1, "Selecione a data"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Selecione um horario valido"),
  services: z.array(z.string().uuid()).min(1, "Selecione ao menos 1 servico"),
  notes: z.string().max(500, "Observacao muito longa").optional(),
  useBonusPoints: z.boolean().optional(),
  couponCode: z.string().max(50, "Cupom muito longo").optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
