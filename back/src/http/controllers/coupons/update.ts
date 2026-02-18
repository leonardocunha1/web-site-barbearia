import { FastifyReply, FastifyRequest } from 'fastify';
import { updateCouponBodySchema } from '@/schemas/coupon';
import { makeUpdateCouponUseCase } from '@/use-cases/factories/make-update-coupon-use-case';
import { z } from 'zod';

// Helper to convert Date objects to ISO strings for Zod validation
function serializeCoupon(coupon: any) {
  return {
    ...coupon,
    startDate: coupon.startDate instanceof Date ? coupon.startDate.toISOString() : coupon.startDate,
    endDate: coupon.endDate instanceof Date ? coupon.endDate.toISOString() : coupon.endDate,
    createdAt: coupon.createdAt instanceof Date ? coupon.createdAt.toISOString() : coupon.createdAt,
    updatedAt: coupon.updatedAt instanceof Date ? coupon.updatedAt.toISOString() : coupon.updatedAt,
  };
}

export async function updateCoupon(request: FastifyRequest, reply: FastifyReply) {
  const updateCouponParamsSchema = z.object({
    couponId: z.string().uuid(),
  });
  const { couponId } = updateCouponParamsSchema.parse(request.params);
  const body = updateCouponBodySchema.parse(request.body);

  const updateCouponUseCase = makeUpdateCouponUseCase();

  const { coupon } = await updateCouponUseCase.execute({
    couponId,
    date: {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });

  return reply.status(200).send({ coupon: serializeCoupon(coupon) });
}
