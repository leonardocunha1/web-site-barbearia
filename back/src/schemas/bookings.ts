import { z } from 'zod';

export const createBookingSchema = z.object({
  professionalId: z.string().uuid(),
  services: z.array(
    z.object({
      serviceId: z.string().uuid(),
    }),
  ),
  startDateTime: z.string().datetime({ offset: true }),
  notes: z.string().max(500).optional(),
});

export const updateBookingStatusParamsSchema = z.object({
  bookingId: z.string().uuid(),
});

export const updateBookingStatusBodySchema = z.object({
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'REALIZADO']),
  reason: z.string().max(255).optional(),
});

export const listUserBookingsQuerySchema = z.object({
  userId: z.string().uuid(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});
