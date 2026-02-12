import { z } from 'zod';
import { CouponType, CouponScope } from '@prisma/client';
import { paginationSchema } from './pagination';

/**
 * Campos válidos para ordenação de cupons.
 */
export const couponSortFieldSchema = z
  .enum([
    'code',
    'type',
    'scope',
    'createdAt',
    'startDate',
    'endDate',
    'active',
    'uses',
  ], {
    errorMap: () => ({ message: 'Campo de ordenação inválido. Valores válidos: code, type, scope, createdAt, startDate, endDate, active, uses' })
  })
  .describe('Campo para ordenação de cupons');

/**
 * Ordem válida para ordenação.
 */
export const couponSortOrderSchema = z.enum(['asc', 'desc'], {
  errorMap: () => ({ message: 'Ordem de ordenação inválida. Use "asc" ou "desc"' })
}).describe('Ordem de ordenação');

/**
 * Schema para ordenação de cupons.
 */
export const couponSortSchema = z
  .object({
    field: couponSortFieldSchema,
    order: couponSortOrderSchema,
  })
  .describe('Configuração de ordenação para cupons');

/**
 * Schema do cupom.
 */
export const couponSchema = z
  .object({
    id: z.string().uuid({ message: 'ID inválido' }),
    code: z.string().min(3, { message: 'Código deve ter pelo menos 3 caracteres' }),
    description: z.string().nullable(),
    type: z.nativeEnum(CouponType, {
      errorMap: () => ({ message: 'Tipo de cupom inválido' })
    }),
    value: z.number().min(0, { message: 'Valor não pode ser negativo' }),
    scope: z.nativeEnum(CouponScope, {
      errorMap: () => ({ message: 'Escopo do cupom inválido' })
    }),
    maxUses: z.number().int().nullable(),
    uses: z.number().int().nonnegative({ message: 'Usos não pode ser negativo' }),
    startDate: z.string().datetime({ message: 'Data de início inválida' }),
    endDate: z.string().datetime({ message: 'Data de término inválida' }).nullable(),
    minBookingValue: z.number().min(0, { message: 'Valor mínimo não pode ser negativo' }).nullable(),
    active: z.boolean(),
    createdAt: z.string().datetime({ message: 'Data de criação inválida' }),
    updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }),

    // Relacionamentos
    service: z
      .object({
        id: z.string().uuid({ message: 'ID do serviço inválido' }), name: z.string(),
      })
      .nullable()
      .optional(),

    professional: z
      .object({
        id: z.string().uuid({ message: 'ID do profissional inválido' }),
        user: z.object({
          id: z.string().uuid({ message: 'ID do usuário inválido' }), name: z.string(),
        }),
      })
      .nullable()
      .optional(),

    user: z
      .object({
        id: z.string().uuid({ message: 'ID do usuário inválido' }), name: z.string(),
      })
      .nullable()
      .optional(),
  })
  .describe('Modelo completo de cupom');

/**
 * Schema para criação de cupom.
 */
export const createCouponBodySchema = z
  .object({
    code: z.string()
      .min(3, { message: 'Código deve ter pelo menos 3 caracteres' })
      .max(50, { message: 'Código não pode exceder 50 caracteres' }),
    type: z.nativeEnum(CouponType, {
      errorMap: () => ({ message: 'Tipo de cupom inválido' })
    }),
    value: z.number()
      .min(0, { message: 'Valor não pode ser negativo' }),
    scope: z.nativeEnum(CouponScope, {
      errorMap: () => ({ message: 'Escopo do cupom inválido' })
    }),
    description: z.string()
      .max(255, { message: 'Descrição não pode exceder 255 caracteres' })
      .optional(),
    maxUses: z.number()
      .int({ message: 'Máximo de usos deve ser inteiro' })
      .positive({ message: 'Máximo de usos deve ser positivo' })
      .optional(),
    startDate: z.string()
      .datetime({ message: 'Data de início inválida' })
      .optional(),
    endDate: z.string()
      .datetime({ message: 'Data de término inválida' })
      .optional(),
    minBookingValue: z.number()
      .positive({ message: 'Valor mínimo deve ser positivo' })
      .optional(),
    serviceId: z.string()
      .uuid({ message: 'ID do serviço inválido' })
      .optional(),
    professionalId: z.string()
      .uuid({ message: 'ID do profissional inválido' })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'FREE' && data.value !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cupons do tipo FREE devem ter valor 0',
        path: ['value'],
      });
    }

    if (data.type !== 'FREE' && data.value <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Valor deve ser positivo para este tipo de cupom',
        path: ['value'],
      });
    }
  })
  .describe('Dados para criação de cupom');

/**
 * Schema para parâmetros de atualização de cupom.
 */
export const updateCouponParamsSchema = z
  .object({
    couponId: z.string()
      .uuid({ message: 'ID do cupom inválido' }),
  })
  .describe('Parâmetros para atualização de cupom');

/**
 * Schema para listagem de cupons.
 */
export const listCouponsQuerySchema = paginationSchema
  .extend({
    code: z.string()
      .optional(),
    type: z.nativeEnum(CouponType, {
      errorMap: () => ({ message: 'Tipo de cupom inválido' })
    }).optional(),
    scope: z.nativeEnum(CouponScope, {
      errorMap: () => ({ message: 'Escopo do cupom inválido' })
    }).optional(),
    active: z.boolean()
      .optional(),
    startDate: z.string()
      .datetime({ message: 'Data de início inválida' })
      .optional(),
    endDate: z.string()
      .datetime({ message: 'Data de término inválida' })
      .optional(),
    sort: z.array(couponSortSchema)
      .optional(),
    professionalId: z.string()
      .uuid({ message: 'ID do profissional inválido' })
      .optional(),
    serviceId: z.string()
      .uuid({ message: 'ID do serviço inválido' })
      .optional(),
  })
  .describe('Parâmetros para listagem de cupons');

/**
 * Schema para resposta paginada de cupons.
 */
export const paginatedCouponResponseSchema = z
  .object({
    coupons: z.array(couponSchema),
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
  .describe('Resposta paginada de cupons');

/**
 * Schema para atualização do cupom.
 */
export const updateCouponBodySchema = z
  .object({
    code: z.string()
      .min(3, { message: 'Código deve ter pelo menos 3 caracteres' })
      .max(20, { message: 'Código não pode exceder 20 caracteres' })
      .optional(),
    type: z.enum(['PERCENTAGE', 'FIXED', 'FREE'], {
      errorMap: () => ({ message: 'Tipo inválido. Valores válidos: PERCENTAGE, FIXED, FREE' })
    }).optional(),
    value: z.number()
      .min(0, { message: 'Valor não pode ser negativo' })
      .optional(),
    scope: z.enum(['GLOBAL', 'SERVICE', 'PROFESSIONAL'], {
      errorMap: () => ({ message: 'Escopo inválido. Valores válidos: GLOBAL, SERVICE, PROFESSIONAL' })
    }).optional(),
    description: z.string()
      .optional(),
    maxUses: z.number()
      .int({ message: 'Máximo de usos deve ser inteiro' })
      .min(1, { message: 'Máximo de usos deve ser pelo menos 1' })
      .optional(),
    startDate: z.string()
      .datetime({ message: 'Data de início inválida' })
      .optional(),
    endDate: z.string()
      .datetime({ message: 'Data de término inválida' })
      .nullable()
      .optional(),
    minBookingValue: z.number()
      .min(0, { message: 'Valor mínimo não pode ser negativo' })
      .nullable()
      .optional(),
    serviceId: z.string()
      .uuid({ message: 'ID do serviço inválido' })
      .nullable()
      .optional(),
    professionalId: z.string()
      .uuid({ message: 'ID do profissional inválido' })
      .nullable()
      .optional(),
    active: z.boolean()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'FREE' && data.value !== undefined && data.value !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cupons do tipo FREE devem ter valor 0',
        path: ['value'],
      });
    }

    if (data.type && data.type !== 'FREE' && data.value !== undefined) {
      if (data.value <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valor deve ser positivo para este tipo de cupom',
          path: ['value'],
        });
      }
    }
  })
  .describe('Dados para atualização de cupom');

// Tipos inferidos
export type CouponSortField = z.infer<typeof couponSortFieldSchema>;
export type CouponSortOrder = z.infer<typeof couponSortOrderSchema>;
export type CouponSort = z.infer<typeof couponSortSchema>;
export type CreateCouponBody = z.infer<typeof createCouponBodySchema>;
export type UpdateCouponParams = z.infer<typeof updateCouponParamsSchema>;
export type UpdateCouponBody = z.infer<typeof updateCouponBodySchema>;
export type ListCouponsQuery = z.infer<typeof listCouponsQuerySchema>;
export type PaginatedCouponResponse = z.infer<typeof paginatedCouponResponseSchema>;