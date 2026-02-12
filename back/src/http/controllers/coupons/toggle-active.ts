import { FastifyReply, FastifyRequest } from 'fastify';
import { makeToggleCouponActiveUseCase } from '@/use-cases/factories/make-toggle-coupon-active-use-case';
import { updateCouponParamsSchema } from '@/schemas/coupon';

export async function toggleCouponActive(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { couponId } = updateCouponParamsSchema.parse(request.params);

  const toggleCouponActiveUseCase = makeToggleCouponActiveUseCase();

  const { coupon } = await toggleCouponActiveUseCase.execute({
    couponId,
  });

  return reply.status(200).send({ coupon });
}
