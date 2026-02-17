import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const holidayFormSchema = z.object({
  date: z
    .string()
    .min(1, "Selecione a data")
    .refine((value) => {
      const selected = new Date(`${value}T00:00:00`);
      return !Number.isNaN(selected.getTime()) && selected >= today;
    }, "Selecione uma data igual ou posterior a hoje"),
  reason: z.string().min(3, "Informe o motivo").max(100, "Motivo muito longo"),
});

export type HolidayFormValues = z.infer<typeof holidayFormSchema>;
