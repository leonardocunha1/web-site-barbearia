import { z } from 'zod';

export const createHolidayBodySchema = z.object({
  date: z
    .string()
    .datetime({ 
      offset: true,
      message: 'Data inválida. Utilize o formato ISO 8601 com timezone (ex: 2023-12-25T00:00:00-03:00)' 
    })
    .describe('Data do feriado no formato ISO 8601 com timezone')
    .refine(val => new Date(val) > new Date(), {
      message: 'A data do feriado deve ser futura'
    }),
  motivo: z
    .string()
    .trim()
    .min(3, { message: 'O motivo deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'O motivo não pode exceder 100 caracteres' })
    .describe('Motivo do feriado (3-100 caracteres)')
}).describe("Schema para criação de feriados");

export const deleteHolidayParamsSchema = z.object({
  holidayId: z.string()
    .uuid({ message: 'ID do feriado deve ser um UUID válido' })
    .describe('ID do feriado no formato UUID')
}).describe("Schema para exclusão de feriados");

export const listHolidaysResponseSchema = z.object({
  holidays: z.array(
    z.object({
      id: z.string()
        .uuid({ message: 'ID do feriado inválido' })
        .describe('ID do feriado'),
      data: z.string()
        .datetime({ message: 'Formato de data inválido' })
        .describe('Data no formato ISO 8601'),
      motivo: z.string()
        .describe('Motivo do feriado'),
      profissionalId: z.string()
        .uuid({ message: 'ID do profissional inválido' })
        .describe('ID do profissional')
    })
  ).describe("Lista de feriados"),
  total: z.number()
    .int({ message: 'O total deve ser um número inteiro' })
    .nonnegative({ message: 'O total não pode ser negativo' })
    .describe('Total de registros'),
  page: z.number()
    .int({ message: 'A página deve ser um número inteiro' })
    .positive({ message: 'O número da página deve ser positivo' })
    .describe('Página atual'),
  limit: z.number()
    .int({ message: 'O limite deve ser um número inteiro' })
    .positive({ message: 'O limite deve ser positivo' })
    .max(100, { message: 'O limite máximo por página é 100' })
    .describe('Itens por página'),
  totalPages: z.number()
    .int({ message: 'O total de páginas deve ser um número inteiro' })
    .nonnegative({ message: 'O total de páginas não pode ser negativo' })
    .describe('Total de páginas')
}).describe("Resposta paginada de feriados");

// Tipos TypeScript inferidos
export type CreateHolidayBody = z.infer<typeof createHolidayBodySchema>;
export type DeleteHolidayParams = z.infer<typeof deleteHolidayParamsSchema>;
export type ListHolidaysResponse = z.infer<typeof listHolidaysResponseSchema>;