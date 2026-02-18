import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetCouponUseCase } from '@/use-cases/factories/make-get-coupon-use-case';
import { updateCouponParamsSchema } from '@/schemas/coupon';

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

export async function getCoupon(request: FastifyRequest, reply: FastifyReply) {
  const { couponId } = updateCouponParamsSchema.parse(request.params);

  const getCouponUseCase = makeGetCouponUseCase();

  const { coupon } = await getCouponUseCase.execute({
    couponId,
  });

  return reply.status(200).send({ coupon: serializeCoupon(coupon) });
}
