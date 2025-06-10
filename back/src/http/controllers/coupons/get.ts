import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeGetCouponUseCase } from '@/use-cases/factories/make-get-coupon-use-case';
import { CouponNotFoundError } from '@/use-cases/errors/coupon-not-found-error';
import { updateCouponParamsSchema } from '@/schemas/coupon';
import { formatZodError } from '@/utils/formatZodError';

export async function getCoupon(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { couponId } = updateCouponParamsSchema.parse(request.params);

    const getCouponUseCase = makeGetCouponUseCase();

    const { coupon } = await getCouponUseCase.execute({
      couponId,
    });

    return reply.status(200).send({ coupon });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (err instanceof CouponNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
