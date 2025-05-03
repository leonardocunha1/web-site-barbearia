import { z } from 'zod';

export const createHolidayBodySchema = z.object({
  date: z.coerce.date({
    required_error: 'Data é obrigatória',
    invalid_type_error: 'Data inválida',
  }),
  motivo: z.string().min(3).max(100),
});

export const deleteHolidayParamsSchema = z.object({
  holidayId: z.string().uuid(),
});

export const listHolidaysResponseSchema = z.object({
  holidays: z.array(
    z.object({
      id: z.string().uuid(),
      data: z.coerce.date(),
      motivo: z.string(),
      profissionalId: z.string().uuid(),
    }),
  ),
  total: z.number().int().positive(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().positive(),
});
