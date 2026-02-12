import { z } from 'zod';

export const orderValues = ['asc', 'desc'] as const;

export const sortFields = ['startDateTime', 'PROFESSIONAL', 'status', 'totalAmount'] as const;

/**
 * Tipo literal para os campos de ordenação permitidos.
 */
export type SortField = (typeof sortFields)[number];

/**
 * Enum Zod com os campos de ordenação válidos.
 */
export const sortFieldSchema = z.enum(sortFields).describe('SortField');

/**
 * Enum Zod com as direções de ordenação válidas.
 */
export const sortOrderSchema = z.enum(orderValues).describe('SortOrder');

export type SortOrder = z.infer<typeof sortOrderSchema>;

/**
 * Schema completo para uma regra de ordenação.
 */
export const sortSchema = z
  .object({
    field: sortFieldSchema,
    order: sortOrderSchema,
  })
  .describe('SortSchema');

/**
 * Tipo inferido para uso geral do sortSchema.
 */
export type SortBookingSchema = z.infer<typeof sortSchema>;
