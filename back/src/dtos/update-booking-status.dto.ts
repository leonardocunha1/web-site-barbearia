import { z } from 'zod';

export const updateBookingStatusParamsSchema = z.object({
  bookingId: z.string().uuid(),
});

export const updateBookingStatusBodySchema = z.object({
  status: z.enum(['CONFIRMADO', 'CANCELADO']),
  reason: z.string().max(500).optional(),
});

export type UpdateBookingStatusParams = z.infer<
  typeof updateBookingStatusParamsSchema
>;
export type UpdateBookingStatusBody = z.infer<
  typeof updateBookingStatusBodySchema
>;
