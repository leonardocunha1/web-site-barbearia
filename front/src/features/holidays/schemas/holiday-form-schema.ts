import { z } from "zod";

export const holidayFormSchema = z.object({
  date: z.string().min(1, "Selecione a data"),
  reason: z.string().min(3, "Informe o motivo").max(100, "Motivo muito longo"),
});

export type HolidayFormValues = z.infer<typeof holidayFormSchema>;
