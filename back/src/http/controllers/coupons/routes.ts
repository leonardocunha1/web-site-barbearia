import { FastifyTypedInstance } from '@/types';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';

import { createCoupon } from './create';

import { z } from 'zod';
import {
  couponSchema,
  createCouponBodySchema,
  listCouponsQuerySchema,
  updateCouponBodySchema,
  updateCouponParamsSchema,
} from '@/schemas/coupon';
import { listCoupons } from './list-coupons';
import { toggleCouponActive } from './toggle-active';
import { deleteCoupon } from './delete';
import { getCoupon } from './get';
import { updateCoupon } from './update';

export async function couponsRoutes(app: FastifyTypedInstance) {
  app.post(
    '/coupons',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        operationId: 'createCoupon',
        tags: ['coupons'],
        description: 'Criação de um novo cupom.',
        body: createCouponBodySchema,
        response: {
          201: z.object({ coupon: couponSchema }).describe('Cupom criado com sucesso.'),
          400: z.object({ message: z.string() }).describe('Erro de validação'),
          409: z.object({ message: z.string() }).describe('Código de cupom já existente.'),
        },
      },
    },
    createCoupon,
  );

  app.get(
    '/coupons',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        operationId: 'listCoupons',
        tags: ['coupons'],
        description: 'Lista todos os cupons com paginação.',
        querystring: listCouponsQuerySchema,
        response: {
          200: z.object({
            coupons: z.array(couponSchema),
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            totalPages: z.number(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    listCoupons,
  );

  app.get(
    '/coupons/:couponId',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        operationId: 'getCouponById',
        tags: ['coupons'],
        description: 'Retorna os detalhes de um cupom pelo ID.',
        params: updateCouponParamsSchema,
        response: {
          200: z.object({ coupon: couponSchema }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    getCoupon,
  );

  app.put(
    '/coupons/:couponId',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        operationId: 'updateCoupon',
        tags: ['coupons'],
        description: 'Atualiza um cupom existente.',
        params: updateCouponParamsSchema,
        body: updateCouponBodySchema,
        response: {
          200: z.object({ coupon: couponSchema }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    updateCoupon,
  );

  app.delete(
    '/coupons/:couponId',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        operationId: 'deleteCoupon',
        tags: ['coupons'],
        description: 'Deleta um cupom pelo ID.',
        params: updateCouponParamsSchema,
        response: {
          200: z.object({ success: z.boolean() }).describe('Cupom deletado com sucesso.'),
          404: z.object({ message: z.string() }),
        },
      },
    },
    deleteCoupon,
  );

  app.patch(
    '/coupons/:couponId/toggle-status',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        operationId: 'toggleCouponStatus',
        tags: ['coupons'],
        description: 'Ativa ou desativa o status de um cupom.',
        params: updateCouponParamsSchema,
        response: {
          200: z.object({ coupon: z.object({ id: z.string(), active: z.boolean() }) }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    toggleCouponActive,
  );
}
