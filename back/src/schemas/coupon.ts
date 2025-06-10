import { z } from 'zod';
import { CouponType, CouponScope } from '@prisma/client';
import { paginationSchema } from './pagination';

// Schema para ordenação
export const couponSortFieldSchema = z.enum([
  'code',
  'type',
  'scope',
  'createdAt',
  'startDate',
  'endDate',
  'active',
  'uses',
]);

export const couponSortOrderSchema = z.enum(['asc', 'desc']);

export const couponSortSchema = z.object({
  field: couponSortFieldSchema,
  order: couponSortOrderSchema,
});

// Schema do cupom
export const couponSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  description: z.string().nullable(),
  type: z.nativeEnum(CouponType),
  value: z.number(),
  scope: z.nativeEnum(CouponScope),
  maxUses: z.number().nullable(),
  uses: z.number(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable(),
  minBookingValue: z.number().nullable(),
  active: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  // Relacionamentos
  service: z
    .object({
      id: z.string().uuid(),
      nome: z.string(),
    })
    .nullable()
    .optional(),

  professional: z
    .object({
      id: z.string().uuid(),
      user: z.object({
        id: z.string().uuid(),
        nome: z.string(),
      }),
    })
    .nullable()
    .optional(),

  user: z
    .object({
      id: z.string().uuid(),
      nome: z.string(),
    })
    .nullable()
    .optional(),
});

// Schema para criação de cupom
export const createCouponBodySchema = z.object({
  code: z.string().min(3).max(50),
  type: z.nativeEnum(CouponType),
  value: z.number().positive(),
  scope: z.nativeEnum(CouponScope),
  description: z.string().max(255).optional(),
  maxUses: z.number().int().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minBookingValue: z.number().positive().optional(),
  serviceId: z.string().uuid().optional(),
  professionalId: z.string().uuid().optional(),
});

// Schema para atualização de cupom
export const updateCouponParamsSchema = z.object({
  couponId: z.string().uuid(),
});

// Schema para listagem de cupons
export const listCouponsQuerySchema = paginationSchema.extend({
  code: z.string().optional(),
  type: z.nativeEnum(CouponType).optional(),
  scope: z.nativeEnum(CouponScope).optional(),
  active: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sort: z.array(couponSortSchema).optional(),
  professionalId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
});

// Schema para resposta paginada
export const paginatedCouponResponseSchema = z.object({
  coupons: z.array(couponSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const updateCouponBodySchema = z.object({
  code: z.string().min(3).max(20).optional(),
  type: z.enum(['PERCENTAGE', 'FIXED', 'FREE']).optional(),
  value: z.number().min(0).optional(),
  scope: z.enum(['GLOBAL', 'SERVICE', 'PROFESSIONAL']).optional(),
  description: z.string().optional(),
  maxUses: z.number().int().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().nullable().optional(),
  minBookingValue: z.number().min(0).nullable().optional(),
  serviceId: z.string().uuid().nullable().optional(),
  professionalId: z.string().uuid().nullable().optional(),
  active: z.boolean().optional(),
});

// Tipos
export type CouponSortField = z.infer<typeof couponSortFieldSchema>;
export type CouponSortOrder = z.infer<typeof couponSortOrderSchema>;
export type CouponSort = z.infer<typeof couponSortSchema>;
export type CreateCouponBody = z.infer<typeof createCouponBodySchema>;
export type UpdateCouponParams = z.infer<typeof updateCouponParamsSchema>;
export type UpdateCouponBody = z.infer<typeof updateCouponBodySchema>;
export type ListCouponsQuery = z.infer<typeof listCouponsQuerySchema>;
export type PaginatedCouponResponse = z.infer<
  typeof paginatedCouponResponseSchema
>;
