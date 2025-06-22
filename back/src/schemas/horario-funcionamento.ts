import { z } from 'zod';

// Regex para validação de horário no formato HH:MM
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createBusinessHoursBodySchema = z.object({
  professionalId: z.string()
    .uuid()
    .describe('ID do profissional no formato UUID'),
  
  diaSemana: z.number()
    .int()
    .min(0, 'Dia da semana deve ser entre 0 (domingo) e 6 (sábado)')
    .max(6, 'Dia da semana deve ser entre 0 (domingo) e 6 (sábado)')
    .describe('Dia da semana (0=domingo a 6=sábado)'),
  
  abreAs: z.string()
    .regex(timeRegex, { message: 'Formato inválido. Use HH:MM (24 horas)' })
    .describe('Horário de abertura no formato HH:MM'),
  
  fechaAs: z.string()
    .regex(timeRegex, { message: 'Formato inválido. Use HH:MM (24 horas)' })
    .describe('Horário de fechamento no formato HH:MM (deve ser após a abertura)'),
  
  pausaInicio: z.string()
    .regex(timeRegex, { message: 'Formato inválido. Use HH:MM (24 horas)' })
    .nullable()
    .optional()
    .describe('Início da pausa (opcional) no formato HH:MM'),
  
  pausaFim: z.string()
    .regex(timeRegex, { message: 'Formato inválido. Use HH:MM (24 horas)' })
    .nullable()
    .optional()
    .describe('Fim da pausa (opcional) no formato HH:MM (deve ser após o início)')
}).describe("Schema para criação de horário comercial");

export const updateBusinessHoursBodySchema = z.object({
  diaSemana: z.number()
    .int()
    .min(0)
    .max(6)
    .optional()
    .describe('Dia da semana (0=domingo a 6=sábado)'),
  
  abreAs: z.string()
    .regex(timeRegex)
    .optional()
    .describe('Novo horário de abertura (opcional)'),
  
  fechaAs: z.string()
    .regex(timeRegex)
    .optional()
    .describe('Novo horário de fechamento (opcional)'),
  
  pausaInicio: z.string()
    .regex(timeRegex)
    .nullable()
    .optional()
    .describe('Novo início de pausa (opcional)'),
  
  pausaFim: z.string()
    .regex(timeRegex)
    .nullable()
    .optional()
    .describe('Novo fim de pausa (opcional)')
}).describe("Schema para atualização de horário comercial");

export const listBusinessHoursParamsSchema = z.object({
  professionalId: z.string()
    .uuid()
    .describe('ID do profissional no formato UUID')
}).describe("Schema para listagem de horários por profissional");

export const deleteBusinessHoursParamsSchema = z.object({
  businessHoursId: z.string()
    .uuid()
    .describe('ID do horário comercial no formato UUID')
}).describe("Schema para exclusão de horário comercial");

export const businessHoursSchema = z.object({
  id: z.string()
    .uuid()
    .describe('ID do registro'),
  
  ativo: z.boolean()
    .describe('Indica se o horário está ativo'),
  
  diaSemana: z.number()
    .int()
    .min(0)
    .max(6)
    .describe('Dia da semana (0=domingo a 6=sábado)'),
  
  abreAs: z.string()
    .describe('Horário de abertura'),
  
  fechaAs: z.string()
    .describe('Horário de fechamento'),
  
  pausaInicio: z.string()
    .nullable()
    .describe('Início da pausa'),
  
  pausaFim: z.string()
    .nullable()
    .describe('Fim da pausa'),
  
  profissionalId: z.string()
    .uuid()
    .describe('ID do profissional associado')
}).describe("Schema completo de horário comercial");

// Tipos TypeScript inferidos
export type CreateBusinessHoursBody = z.infer<typeof createBusinessHoursBodySchema>;
export type UpdateBusinessHoursBody = z.infer<typeof updateBusinessHoursBodySchema>;
export type ListBusinessHoursParams = z.infer<typeof listBusinessHoursParamsSchema>;
export type DeleteBusinessHoursParams = z.infer<typeof deleteBusinessHoursParamsSchema>;
export type BusinessHours = z.infer<typeof businessHoursSchema>;