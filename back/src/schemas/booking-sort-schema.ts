import { z } from 'zod';

export const orderValues = ['asc', 'desc'] as const;
export const sortFields = [
  'dataHoraInicio',
  'profissional',
  'status',
  'valorFinal',
] as const;

export type SortField = (typeof sortFields)[number]; // Tipo literal para uso externo

export const sortFieldSchema = z.enum(sortFields);

export const sortOrderSchema = z.enum(['asc', 'desc']);
export type SortOrder = z.infer<typeof sortOrderSchema>;

export const sortSchema = z.object({
  field: sortFieldSchema,
  order: sortOrderSchema,
});
export type SortBookingSchema = z.infer<typeof sortSchema>; // Para tipar arrays, inputs etc.
