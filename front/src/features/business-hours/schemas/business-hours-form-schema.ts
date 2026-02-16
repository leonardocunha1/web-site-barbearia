import { z } from "zod";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const optionalString = (schema: z.ZodString) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional(),
  );

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const businessHoursFormSchema = z
  .object({
    dayOfWeek: z
      .number()
      .min(0, "Dia da semana invalido")
      .max(6, "Dia da semana invalido"),
    opensAt: z.string().regex(timeRegex, "Horario de abertura invalido"),
    closesAt: z.string().regex(timeRegex, "Horario de fechamento invalido"),
    breakStart: optionalString(
      z.string().regex(timeRegex, "Horario de pausa invalido"),
    ),
    breakEnd: optionalString(
      z.string().regex(timeRegex, "Horario de pausa invalido"),
    ),
  })
  .superRefine((data, context) => {
    if (toMinutes(data.closesAt) <= toMinutes(data.opensAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Horario de fechamento deve ser apos a abertura",
        path: ["closesAt"],
      });
    }

    if (
      (data.breakStart && !data.breakEnd) ||
      (!data.breakStart && data.breakEnd)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe inicio e fim da pausa",
        path: ["breakStart"],
      });
    }

    if (data.breakStart && data.breakEnd) {
      const breakStartMinutes = toMinutes(data.breakStart);
      const breakEndMinutes = toMinutes(data.breakEnd);
      const openMinutes = toMinutes(data.opensAt);
      const closeMinutes = toMinutes(data.closesAt);

      if (breakEndMinutes <= breakStartMinutes) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Fim da pausa deve ser apos o inicio",
          path: ["breakEnd"],
        });
      }

      if (breakStartMinutes < openMinutes || breakEndMinutes > closeMinutes) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pausa deve estar dentro do horario de funcionamento",
          path: ["breakStart"],
        });
      }
    }
  });

export type BusinessHoursFormValues = z.infer<typeof businessHoursFormSchema>;
