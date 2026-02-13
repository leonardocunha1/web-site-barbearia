import { z } from "zod";

export const couponFormSchema = z.object({
  code: z.string().min(3, "Codigo invalido"),
  type: z.enum(["PERCENTAGE", "FIXED", "FREE"]),
  value: z.number().min(0, "Valor invalido"),
  scope: z.enum(["GLOBAL", "SERVICE", "PROFESSIONAL"]),
  description: z.string().max(255, "Descricao muito longa").optional(),
  maxUses: z.number().min(1, "Maximo invalido").optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minBookingValue: z.number().min(0, "Valor minimo invalido").optional(),
  serviceId: z.string().uuid("Servico invalido").optional(),
  professionalId: z.string().uuid("Profissional invalido").optional(),
  active: z.boolean().optional(),
});

export type CouponFormValues = z.infer<typeof couponFormSchema>;
