import { FastifyReply, FastifyRequest } from 'fastify';
import { makeDeleteCouponUseCase } from '@/use-cases/factories/make-delete-coupon-use-case';
import { updateCouponParamsSchema } from '@/schemas/coupon';

export async function deleteCoupon(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { couponId } = updateCouponParamsSchema.parse(request.params);

  const deleteCouponUseCase = makeDeleteCouponUseCase();

  const { success } = await deleteCouponUseCase.execute({
    couponId,
  });

  return reply.status(200).send({ success });
}
