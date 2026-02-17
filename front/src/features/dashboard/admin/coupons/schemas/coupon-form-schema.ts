import { z } from "zod";

export const couponFormSchema = z
  .object({
    code: z.string().min(3, "Codigo invalido"),
    type: z.enum(["PERCENTAGE", "FIXED", "FREE"]),
    value: z.number().min(0, "Valor invalido"),
    scope: z.enum(["GLOBAL", "SERVICE", "PROFESSIONAL"]),
    expirationType: z.enum(["DATE", "QUANTITY", "BOTH"]),
    description: z.string().max(255, "Descricao muito longa").optional(),
    maxUses: z.number().min(1, "Maximo invalido").optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minBookingValue: z.number().min(0, "Valor minimo invalido").optional(),
    serviceId: z.string().uuid("Servico invalido").optional(),
    professionalId: z.string().uuid("Profissional invalido").optional(),
    active: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // Validação para expirationType DATE
    if (data.expirationType === "DATE") {
      if (!data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Data fim e obrigatoria para expiracao por data",
          path: ["endDate"],
        });
      }
      if (data.maxUses !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Maximo de usos nao deve ser informado para expiracao por data",
          path: ["maxUses"],
        });
      }
    }

    // Validação para expirationType QUANTITY
    if (data.expirationType === "QUANTITY") {
      if (!data.maxUses) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximo de usos e obrigatorio para expiracao por quantidade",
          path: ["maxUses"],
        });
      }
      if (data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Data fim nao deve ser informada para expiracao por quantidade",
          path: ["endDate"],
        });
      }
    }

    // Validação para expirationType BOTH
    if (data.expirationType === "BOTH") {
      if (!data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Data fim e obrigatoria para expiracao combinada",
          path: ["endDate"],
        });
      }
      if (!data.maxUses) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximo de usos e obrigatorio para expiracao combinada",
          path: ["maxUses"],
        });
      }
    }
  });

export type CouponFormValues = z.infer<typeof couponFormSchema>;
