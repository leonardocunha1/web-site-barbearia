import { z } from 'zod';

export const createBusinessHoursBodySchema = z.object({
  professionalId: z.string(),
  diaSemana: z.number().int().min(0).max(6),
  abreAs: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Formato de hora inválido. Use "HH:MM".',
  }),
  fechaAs: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Formato de hora inválido. Use "HH:MM".',
  }),
  pausaInicio: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .nullable()
    .optional(),
  pausaFim: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .nullable()
    .optional(),
});

export const updateBusinessHoursBodySchema = z.object({
  diaSemana: z.number().int().min(0).max(6),
  abreAs: z.string().optional(),
  fechaAs: z.string().optional(),
  pausaInicio: z.string().nullable().optional(),
  pausaFim: z.string().nullable().optional(),
});

export const listBusinessHoursParamsSchema = z.object({
  professionalId: z.string().uuid(),
});

export const deleteBusinessHoursParamsSchema = z.object({
  businessHoursId: z.string().uuid(),
});

export const businessHoursSchema = z.object({
  id: z.string().uuid(),
  ativo: z.boolean(),
  diaSemana: z.number().int().min(0).max(6),
  abreAs: z.string(),
  fechaAs: z.string(),
  pausaInicio: z.string().nullable(),
  pausaFim: z.string().nullable(),
  profissionalId: z.string(),
});
