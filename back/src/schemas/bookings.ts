import { z } from 'zod';
import { Status } from '@prisma/client';
import { sortSchema } from '@/schemas/booking-sort-schema';
import { paginationSchema } from './pagination';

/**
 * Schema de um item de agendamento.
 */
export const bookingItemSchema = z
  .object({
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
  })
  .describe('BookingItem');

/**
 * Schema de um agendamento completo.
 */
export const bookingSchema = z
  .object({
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
    profissional: z.object({
      id: z.string().uuid(),
      user: z.object({
        id: z.string().uuid(),
        nome: z.string(),
      }),
    }),
    user: z.object({
      id: z.string().uuid(),
      nome: z.string(),
    }),
    items: z.array(bookingItemSchema),
  })
  .describe('Booking');

/**
 * Schema do corpo para criação de agendamento.
 */
export const createBookingBodySchema = z
  .object({
    professionalId: z.string().uuid(),
    services: z.array(
      z.object({
        serviceId: z.string().uuid(),
      }),
    ),
    startDateTime: z.string().datetime({ offset: true }),
    notes: z.string().max(500).optional(),
    useBonusPoints: z.boolean().optional().default(false),
    couponCode: z.string().max(50).optional(),
  })
  .describe('CreateBookingBody');

/**
 * Params de rota para busca ou alteração de status de agendamento.
 */
export const getOrUpdateBookingStatusParamsSchema = z
  .object({
    bookingId: z.string().uuid(),
  })
  .describe('GetOrUpdateBookingStatusParams');

/**
 * Schema para atualizar status do agendamento.
 */
export const updateBookingStatusBodySchema = z
  .object({
    status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']),
    reason: z.string().max(255).optional(),
  })
  .describe('UpdateBookingStatusBody');

/**
 * Filtros de listagem de reservas para o usuário.
 */
export const listUserBookingsQuerySchema = paginationSchema
  .extend({
    sort: z.array(sortSchema).optional(),
  })
  .describe('ListUserBookingsQuery');

/**
 * Filtros de listagem de reservas para o profissional.
 */
export const listBookingsQuerySchema = paginationSchema
  .extend({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    status: z
      .enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO'])
      .optional(),
    sort: z.array(sortSchema).optional(),
  })
  .describe('ListBookingsQuery');

/**
 * Resposta paginada de reservas.
 */
export const paginatedBookingResponseSchema = z
  .object({
    bookings: z.array(bookingSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  })
  .describe('PaginatedBookingResponse');

// Tipos derivados
export type getOrUpdateBookingStatusParams = z.infer<
  typeof getOrUpdateBookingStatusParamsSchema
>;

export type UpdateBookingStatusBody = z.infer<
  typeof updateBookingStatusBodySchema
>;
