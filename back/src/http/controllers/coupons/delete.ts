import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeDeleteCouponUseCase } from '@/use-cases/factories/make-delete-coupon-use-case';
import { CouponNotFoundError } from '@/use-cases/errors/coupon-not-found-error';
import { CouponInUseError } from '@/use-cases/errors/coupon-in-use-error';
import { formatZodError } from '@/utils/formatZodError';
import { updateCouponParamsSchema } from '@/schemas/coupon';

export async function deleteCoupon(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { couponId } = updateCouponParamsSchema.parse(request.params);

    const deleteCouponUseCase = makeDeleteCouponUseCase();

    const { success } = await deleteCouponUseCase.execute({
      couponId,
    });

    return reply.status(200).send({ success });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (err instanceof CouponNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof CouponInUseError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
