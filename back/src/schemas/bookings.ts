import { z } from 'zod';
import { Status } from '@prisma/client';
import { sortSchema } from '@/schemas/booking-sort-schema';
import { paginationSchema } from './pagination';

// schema dos itens de agendamento )
export const bookingItemSchema = z.object({
  id: z.string().uuid(),
  duracao: z.number().int().nonnegative(),
  preco: z.number().nonnegative(),
  serviceProfessional: z.object({
    id: z.string().uuid(),
    service: z.object({
      id: z.string().uuid(),
      nome: z.string(),
    }),
  }),
});

// Schema do agendamento
export const bookingSchema = z.object({
  id: z.string().uuid(),
  usuarioId: z.string().uuid(),
  dataHoraInicio: z.string().datetime(),
  dataHoraFim: z.string().datetime(),
  status: z.nativeEnum(Status),
  observacoes: z.string().nullable().optional(),
  valorFinal: z.number().positive().nullable().optional(),
  canceledAt: z.string().datetime().nullable().optional(),
  confirmedAt: z.string().datetime().nullable().optional(),
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),

  // Relacionamento com o profissional
  profissional: z.object({
    id: z.string().uuid(),
    user: z.object({
      id: z.string().uuid(),
      nome: z.string(),
    }),
  }),

  // Usuário que fez a reserva
  user: z.object({
    id: z.string().uuid(),
    nome: z.string(),
  }),

  // Itens da reserva
  items: z.array(bookingItemSchema),
});

// Schema para criação de agendamento
export const createBookingBodySchema = z.object({
  professionalId: z.string().uuid(),
  services: z.array(
    z.object({
      serviceId: z.string().uuid(),
    }),
  ),
  startDateTime: z.string().datetime({ offset: true }),
  notes: z.string().max(500).optional(),
  useBonusPoints: z.boolean().optional().default(false),
});

// Schema para atualização do status da reserva
export const getOrUpdateBookingStatusParamsSchema = z.object({
  bookingId: z.string().uuid(),
});

export const updateBookingStatusBodySchema = z.object({
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']),
  reason: z.string().max(255).optional(),
});

// Schema para listagem de reservas do usuário
export const listUserBookingsQuerySchema = paginationSchema.extend({
  sort: z.array(sortSchema).optional(),
});

// Schema para filtros de listagem de reservas do profissional
export const listBookingsQuerySchema = paginationSchema.extend({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z
    .enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO'])
    .optional(),
  sort: z.array(sortSchema).optional(),
});

// Schema para resposta paginada
export const paginatedBookingResponseSchema = z.object({
  bookings: z.array(bookingSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type getOrUpdateBookingStatusParams = z.infer<
  typeof getOrUpdateBookingStatusParamsSchema
>;
export type UpdateBookingStatusBody = z.infer<
  typeof updateBookingStatusBodySchema
>;
