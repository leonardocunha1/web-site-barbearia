import { z } from "zod";
import { zodcreateCouponBody } from "@/api"; // Ajuste o caminho para o seu arquivo Orval

// Helper para converter lixo de UI (strings vazias) em undefined
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preprocessData = (data: any) => {
  const result = { ...data };

  const fieldsToClean = [
    "serviceId",
    "professionalId",
    "startDate",
    "endDate",
    "description",
  ];

  fieldsToClean.forEach((field) => {
    if (result[field] === "" || result[field] === null) {
      result[field] = undefined;
    }
  });

  // Garante que números não sejam NaN
  if (typeof result.maxUses !== "number" || Number.isNaN(result.maxUses))
    result.maxUses = undefined;
  if (
    typeof result.minBookingValue !== "number" ||
    Number.isNaN(result.minBookingValue)
  )
    result.minBookingValue = undefined;

  return result;
};

export const couponFormSchema = z
  .preprocess(
    preprocessData,
    zodcreateCouponBody.extend({
      active: z.boolean().optional(),
    }),
  )
  .superRefine((data, ctx) => {
    // Validação de Datas baseada no tipo de expiração
    if (data.expirationType === "DATE" || data.expirationType === "BOTH") {
      if (!data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Data de término é obrigatória",
          path: ["endDate"],
        });
      }
    }

    if (data.expirationType === "QUANTITY" || data.expirationType === "BOTH") {
      if (!data.maxUses) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Limite de usos é obrigatório",
          path: ["maxUses"],
        });
      }
    }

    // Validação de Escopo
    if (data.scope === "SERVICE" && !data.serviceId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione um serviço",
        path: ["serviceId"],
      });
    }

    if (data.scope === "PROFESSIONAL" && !data.professionalId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione um profissional",
        path: ["professionalId"],
      });
    }
  });

export type CouponFormValues = z.infer<typeof couponFormSchema>;
