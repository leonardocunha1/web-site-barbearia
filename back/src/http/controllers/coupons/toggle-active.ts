import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeToggleCouponActiveUseCase } from '@/use-cases/factories/make-toggle-coupon-active-use-case';
import { CouponNotFoundError } from '@/use-cases/errors/coupon-not-found-error';
import { updateCouponParamsSchema } from '@/schemas/coupon';
import { formatZodError } from '@/utils/formatZodError';

export async function toggleCouponActive(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { couponId } = updateCouponParamsSchema.parse(request.params);

    const toggleCouponActiveUseCase = makeToggleCouponActiveUseCase();

    const { coupon } = await toggleCouponActiveUseCase.execute({
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
