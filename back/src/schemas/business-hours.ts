import { z } from 'zod';

// Regex para validação de horário no formato HH:MM
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createBusinessHoursBodySchema = z
  .object({
    dayOfWeek: z
      .number()
      .int({ message: 'Dia da semana deve ser um número inteiro' })
      .min(0, {
        message: 'Dia da semana deve ser entre 0 (domingo) e 6 (sábado)',
      })
      .max(6, {
        message: 'Dia da semana deve ser entre 0 (domingo) e 6 (sábado)',
      })
      .describe('Dia da semana (0=domingo a 6=sábado)'),

    opensAt: z
      .string()
      .regex(timeRegex, {
        message: 'Formato de horário inválido. Use HH:MM no formato 24 horas',
      })
      .describe('Horário de abertura no formato HH:MM'),

    closesAt: z
      .string()
      .regex(timeRegex, {
        message: 'Formato de horário inválido. Use HH:MM no formato 24 horas',
      })
      .describe('Horário de fechamento no formato HH:MM (deve ser após a abertura)'),

    breakStart: z
      .string()
      .regex(timeRegex, {
        message: 'Formato de horário inválido. Use HH:MM no formato 24 horas',
      })
      .nullable()
      .optional()
      .describe('Início da pausa (opcional) no formato HH:MM'),

    breakEnd: z
      .string()
      .regex(timeRegex, {
        message: 'Formato de horário inválido. Use HH:MM no formato 24 horas',
      })
      .nullable()
      .optional()
      .describe('Fim da pausa (opcional) no formato HH:MM (deve ser após o início)'),
  })
  .refine(
    (data) => {
      if (data.closesAt <= data.opensAt) {
        return false;
      }
      return true;
    },
    {
      message: 'Horário de fechamento deve ser após o horário de abertura',
      path: ['closesAt'],
    },
  )
  .refine(
    (data) => {
      if (data.breakStart && data.breakEnd) {
        return data.breakEnd > data.breakStart;
      }
      return true;
    },
    {
      message: 'Fim da pausa deve ser após o início da pausa',
      path: ['breakEnd'],
    },
  )
  .describe('Schema para criação de horário comercial');

export const updateBusinessHoursBodySchema = z
  .object({
    dayOfWeek: z
      .number()
      .int({ message: 'Dia da semana deve ser um número inteiro' })
      .min(0, {
        message: 'Dia da semana deve ser entre 0 (domingo) e 6 (sábado)',
      })
      .max(6, {
        message: 'Dia da semana deve ser entre 0 (domingo) e 6 (sábado)',
      })
      .optional()
      .describe('Dia da semana (0=domingo a 6=sábado)'),

    opensAt: z
      .string()
      .regex(timeRegex, {
        message: 'Formato de horário inválido. Use HH:MM no formato 24 horas',
      })
      .optional()
      .describe('Novo horário de abertura (opcional)'),

    closesAt: z
      .string()
      .regex(timeRegex, {
        message: 'Formato de horário inválido. Use HH:MM no formato 24 horas',
      })
      .optional()
      .describe('Novo horário de fechamento (opcional)'),

    breakStart: z
      .string()
      .regex(timeRegex, {
        message: 'Formato de horário inválido. Use HH:MM no formato 24 horas',
      })
      .nullable()
      .optional()
      .describe('Novo início de pausa (opcional)'),

    breakEnd: z
      .string()
      .regex(timeRegex, {
        message: 'Formato de horário inválido. Use HH:MM no formato 24 horas',
      })
      .nullable()
      .optional()
      .describe('Novo fim de pausa (opcional)'),
  })
  .refine(
    (data) => {
      if (data.opensAt && data.closesAt && data.closesAt <= data.opensAt) {
        return false;
      }
      return true;
    },
    {
      message: 'Horário de fechamento deve ser após o horário de abertura',
      path: ['closesAt'],
    },
  )
  .refine(
    (data) => {
      if (data.breakStart && data.breakEnd && data.breakEnd <= data.breakStart) {
        return false;
      }
      return true;
    },
    {
      message: 'Fim da pausa deve ser após o início da pausa',
      path: ['breakEnd'],
    },
  )
  .describe('Schema para atualização de horário comercial');

export const listBusinessHoursParamsSchema = z
  .object({
    professionalId: z
      .string()
      .uuid({ message: 'ID do profissional deve ser um UUID válido' })
      .describe('ID do profissional no formato UUID'),
  })
  .describe('Schema para listagem de horários por profissional');

export const deleteBusinessHoursParamsSchema = z
  .object({
    businessHoursId: z
      .string()
      .uuid({ message: 'ID do horário comercial deve ser um UUID válido' })
      .describe('ID do horário comercial no formato UUID'),
  })
  .describe('Schema para exclusão de horário comercial');

export const businessHoursSchema = z
  .object({
    id: z
      .string()
      .uuid({ message: 'ID do registro deve ser um UUID válido' })
      .describe('ID do registro'),

    ativo: z.boolean().describe('Indica se o horário está ativo'),

    dayOfWeek: z
      .number()
      .int({ message: 'Dia da semana deve ser um número inteiro' })
      .min(0, { message: 'Dia da semana inválido' })
      .max(6, { message: 'Dia da semana inválido' })
      .describe('Dia da semana (0=domingo a 6=sábado)'),

    opensAt: z.string().describe('Horário de abertura'),

    closesAt: z.string().describe('Horário de fechamento'),

    breakStart: z.string().nullable().describe('Início da pausa'),

    breakEnd: z.string().nullable().describe('Fim da pausa'),

    professionalId: z
      .string()
      .uuid({ message: 'ID do profissional deve ser um UUID válido' })
      .describe('ID do profissional associado'),
  })
  .describe('Schema completo de horário comercial');

// Tipos TypeScript inferidos
export type CreateBusinessHoursBody = z.infer<typeof createBusinessHoursBodySchema>;
export type UpdateBusinessHoursBody = z.infer<typeof updateBusinessHoursBodySchema>;
export type ListBusinessHoursParams = z.infer<typeof listBusinessHoursParamsSchema>;
export type DeleteBusinessHoursParams = z.infer<typeof deleteBusinessHoursParamsSchema>;
export type BusinessHours = z.infer<typeof businessHoursSchema>;
