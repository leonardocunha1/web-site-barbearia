import { z } from 'zod';
import { Status } from '@prisma/client';
import { sortSchema } from '@/schemas/booking-sort-schema';
import { paginationSchema } from './pagination';

/**
 * Schema de um item de agendamento.
 */
export const bookingItemSchema = z
  .object({
    id: z.string().uuid({ message: 'ID do item de agendamento inválido' }), duration: z.number()
      .int({ message: 'Duração deve ser um número inteiro' })
      .nonnegative({ message: 'Duração não pode ser negativa' }), price: z.number()
      .nonnegative({ message: 'Preço não pode ser negativo' }),
    serviceProfessional: z.object({
      id: z.string().uuid({ message: 'ID do profissional de serviço inválido' }),
      service: z.object({
        id: z.string().uuid({ message: 'ID do serviço inválido' }), name: z.string().min(2, { message: 'Nome do serviço deve ter pelo menos 2 caracteres' }),
      }),
    }),
  })
  .describe('Item de agendamento');

/**
 * Schema de um agendamento completo.
 */
export const bookingSchema = z
  .object({
    id: z.string().uuid({ message: 'ID do agendamento inválido' }),
    userId: z.string().uuid({ message: 'ID do usuário inválido' }),
    startDateTime: z.string().datetime({ message: 'Data/hora de início inválida' }),
    endDateTime: z.string().datetime({ message: 'Data/hora de fim inválida' }),
    status: z.nativeEnum(Status, {
      errorMap: () => ({ message: 'Status do agendamento inválido' })
    }),
    notes: z.string()
      .max(500, { message: 'Observações não podem exceder 500 caracteres' })
      .nullable()
      .optional(),
    totalAmount: z.number()
      .positive({ message: 'Valor final deve ser positivo' })
      .nullable()
      .optional(),
    canceledAt: z.string().datetime({ message: 'Data de cancelamento inválida' })
      .nullable()
      .optional(),
    confirmedAt: z.string().datetime({ message: 'Data de confirmação inválida' })
      .nullable()
      .optional(),
    updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }),
    createdAt: z.string().datetime({ message: 'Data de criação inválida' }), professional: z.object({
      id: z.string().uuid({ message: 'ID do profissional inválido' }),
      user: z.object({
        id: z.string().uuid({ message: 'ID do usuário profissional inválido' }), name: z.string().min(2, { message: 'Nome do profissional deve ter pelo menos 2 caracteres' }),
      }),
    }),
    user: z.object({
      id: z.string().uuid({ message: 'ID do usuário cliente inválido' }), name: z.string().min(2, { message: 'Nome do cliente deve ter pelo menos 2 caracteres' }),
    }),
    items: z.array(bookingItemSchema)
      .min(1, { message: 'Agendamento deve ter pelo menos 1 serviço' }),
  })
  .describe('Agendamento completo');

/**
 * Schema do corpo para criação de agendamento.
 */
export const createBookingBodySchema = z
  .object({
    professionalId: z.string().uuid({ message: 'ID do profissional inválido' }),
    services: z.array(
      z.object({
        serviceId: z.string().uuid({ message: 'ID do serviço inválido' }),
      }),
    ).min(1, { message: 'Selecione pelo menos 1 serviço' }),
    startDateTime: z.string()
      .datetime({ offset: true, message: 'Data/hora de início inválida. Use formato ISO com timezone' }),
    notes: z.string()
      .max(500, { message: 'Observações não podem exceder 500 caracteres' })
      .optional(),
    useBonusPoints: z.boolean()
      .optional()
      .default(false),
    couponCode: z.string()
      .max(50, { message: 'Código do cupom não pode exceder 50 caracteres' })
      .optional(),
  })
  .describe('Dados para criação de agendamento');

/**
 * Params de rota para busca ou alteração de status de agendamento.
 */
export const getOrUpdateBookingStatusParamsSchema = z
  .object({
    bookingId: z.string().uuid({ message: 'ID do agendamento inválido' }),
  })
  .describe('Parâmetros para busca/atualização de status de agendamento');

/**
 * Schema para atualizar status do agendamento.
 */
export const updateBookingStatusBodySchema = z
  .object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED'], {
      errorMap: () => ({ message: 'Status inválido. Valores válidos: PENDENTE, CONFIRMADO, CANCELADO, CONCLUIDO' })
    }),
    reason: z.string()
      .max(255, { message: 'Motivo não pode exceder 255 caracteres' })
      .optional(),
  })
  .describe('Dados para atualização de status de agendamento');

/**
 * Filtros de listagem de reservas para o usuário.
 */
export const listUserBookingsQuerySchema = paginationSchema
  .extend({
    sort: z.array(sortSchema)
      .optional(),
  })
  .describe('Filtros para listagem de agendamentos do usuário');

/**
 * Filtros de listagem de reservas para o profissional.
 */
export const listBookingsQuerySchema = paginationSchema
  .extend({
    startDate: z.string()
      .datetime({ message: 'Data de início inválida' })
      .optional(),
    endDate: z.string()
      .datetime({ message: 'Data de fim inválida' })
      .optional(),
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED'], {
      errorMap: () => ({ message: 'Status inválido. Valores válidos: PENDENTE, CONFIRMADO, CANCELADO, CONCLUIDO' })
    }).optional(),
    sort: z.array(sortSchema)
      .optional(),
  })
  .describe('Filtros para listagem de agendamentos do profissional');

/**
 * Resposta paginada de reservas.
 */
export const paginatedBookingResponseSchema = z
  .object({
    bookings: z.array(bookingSchema),
    total: z.number()
      .int({ message: 'Total deve ser inteiro' })
      .nonnegative({ message: 'Total não pode ser negativo' }),
    page: z.number()
      .int({ message: 'Página deve ser inteira' })
      .positive({ message: 'Página deve ser positiva' }),
    limit: z.number()
      .int({ message: 'Limite deve ser inteiro' })
      .positive({ message: 'Limite deve ser positivo' }),
    totalPages: z.number()
      .int({ message: 'Total de páginas deve ser inteiro' })
      .nonnegative({ message: 'Total de páginas não pode ser negativo' }),
  })
  .describe('Resposta paginada de agendamentos');

// Tipos derivados
export type GetOrUpdateBookingStatusParams = z.infer<
  typeof getOrUpdateBookingStatusParamsSchema
>;

export type UpdateBookingStatusBody = z.infer<
  typeof updateBookingStatusBodySchema
>;