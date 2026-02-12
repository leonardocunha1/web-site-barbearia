import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetCouponUseCase } from '@/use-cases/factories/make-get-coupon-use-case';
import { updateCouponParamsSchema } from '@/schemas/coupon';

export async function getCoupon(request: FastifyRequest, reply: FastifyReply) {
  const { couponId } = updateCouponParamsSchema.parse(request.params);

  const getCouponUseCase = makeGetCouponUseCase();

  const { coupon } = await getCouponUseCase.execute({
    couponId,
  });

  return reply.status(200).send({ coupon });
}
