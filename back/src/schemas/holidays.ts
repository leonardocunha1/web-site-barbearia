import { z } from 'zod';

export const createHolidayBodySchema = z.object({
  date: z
    .string()
    .datetime({ offset: true })
    .describe('Data do feriado no formato ISO 8601 com timezone')
    .refine(val => new Date(val) > new Date(), {
      message: 'Data deve ser futura'
    }),
  motivo: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .describe('Motivo do feriado (3-100 caracteres)')
}).describe("Schema para criação de feriados");

export const deleteHolidayParamsSchema = z.object({
  holidayId: z.string()
    .uuid()
    .describe('ID do feriado no formato UUID')
}).describe("Schema para exclusão de feriados");

export const listHolidaysResponseSchema = z.object({
  holidays: z.array(
    z.object({
      id: z.string().uuid().describe('ID do feriado'),
      data: z.string().datetime().describe('Data no formato ISO 8601'),
      motivo: z.string().describe('Motivo do feriado'),
      profissionalId: z.string().uuid().describe('ID do profissional')
    })
  ).describe("Lista de feriados"),
  total: z.number().int().nonnegative().describe('Total de registros'),
  page: z.number().int().positive().describe('Página atual'),
  limit: z.number().int().positive().max(100).describe('Itens por página'),
  totalPages: z.number().int().nonnegative().describe('Total de páginas')
}).describe("Resposta paginada de feriados");

// Tipos TypeScript inferidos
export type CreateHolidayBody = z.infer<typeof createHolidayBodySchema>;
export type DeleteHolidayParams = z.infer<typeof deleteHolidayParamsSchema>;
export type ListHolidaysResponse = z.infer<typeof listHolidaysResponseSchema>;