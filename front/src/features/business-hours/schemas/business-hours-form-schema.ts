import { z } from "zod";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const businessHoursFormSchema = z
  .object({
    dayOfWeek: z
      .number()
      .min(0, "Dia da semana invalido")
      .max(6, "Dia da semana invalido"),
    opensAt: z.string().regex(timeRegex, "Horario de abertura invalido"),
    closesAt: z.string().regex(timeRegex, "Horario de fechamento invalido"),
    breakStart: z
      .string()
      .regex(timeRegex, "Horario de pausa invalido")
      .optional(),
    breakEnd: z
      .string()
      .regex(timeRegex, "Horario de pausa invalido")
      .optional(),
  })
  .refine((data) => data.closesAt > data.opensAt, {
    message: "Horario de fechamento deve ser apos a abertura",
    path: ["closesAt"],
  })
  .refine(
    (data) =>
      !data.breakStart || !data.breakEnd || data.breakEnd > data.breakStart,
    {
      message: "Fim da pausa deve ser apos o inicio",
      path: ["breakEnd"],
    },
  );

export type BusinessHoursFormValues = z.infer<typeof businessHoursFormSchema>;
