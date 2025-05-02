import { z } from 'zod';
import { Status } from '@prisma/client';
import { userSchema } from './user';
import { professionalSchema } from './profissional';
import { bookingItemSchema } from './booking-items';
import { sortSchema } from '@/schemas/booking-sort-schema';
import { paginationSchema } from './pagination-params';

export const createBookingBodySchema = z.object({
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

export const listUserBookingsQuerySchema = paginationSchema.extend({
  sort: z.array(sortSchema).optional(),
});

export const bookingSchema = z.object({
  id: z.string().uuid(),
  usuarioId: z.string().uuid(),
  dataHoraInicio: z.string().datetime(),
  dataHoraFim: z.string().datetime(),
  status: z.nativeEnum(Status),
  observacoes: z.string().optional(),
  valorFinal: z.number().positive().optional(),
  createdAt: z.string().datetime(),
  items: z.array(bookingItemSchema),
  profissional: professionalSchema,
  user: userSchema,
});

// Schema simplificado para listagens
export const bookingListSchema = bookingSchema
  .pick({
    id: true,
    dataHoraInicio: true,
    dataHoraFim: true,
    status: true,
    valorFinal: true,
  })
  .extend({
    profissional: professionalSchema
      .pick({
        id: true,
        especialidade: true,
      })
      .extend({
        user: z.object({ nome: z.string() }),
      }),
    usuario: userSchema.pick({ nome: true }),
  });

// Schema para filtros de listagem
export const listBookingsQuerySchema = paginationSchema.extend({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO']).optional(),
  sort: z.array(sortSchema).optional(),
});

// Schema para resposta paginada
export const paginatedBookingResponseSchema = z.object({
  bookings: z.array(bookingListSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});
