import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { formatZodError } from '@/utils/formatZodError';
import { updateCouponBodySchema } from '@/schemas/coupon';
import { DuplicateCouponError } from '@/use-cases/errors/duplicate-coupon-error';
import { InvalidCouponValueError } from '@/use-cases/errors/invalid-coupon-value-error';
import { InvalidCouponScopeError } from '@/use-cases/errors/invalid-coupon-scope-error';
import { InvalidCouponDatesError } from '@/use-cases/errors/invalid-coupon-dates-error';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { CouponNotFoundError } from '@/use-cases/errors/coupon-not-found-error';
import { makeUpdateCouponUseCase } from '@/use-cases/factories/make-update-coupon-use-case';

export async function updateCoupon(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateCouponParamsSchema = z.object({
    couponId: z.string().uuid(),
  });

  try {
    const { couponId } = updateCouponParamsSchema.parse(request.params);
    const body = updateCouponBodySchema.parse(request.body);

    const updateCouponUseCase = makeUpdateCouponUseCase();

    const { coupon } = await updateCouponUseCase.execute({
      couponId,
      data: {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });

    return reply.status(200).send({ coupon });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (err instanceof CouponNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (
      err instanceof ServiceNotFoundError ||
      err instanceof ProfessionalNotFoundError
    ) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof DuplicateCouponError) {
      return reply.status(409).send({ message: err.message });
    }

    if (
      err instanceof InvalidCouponValueError ||
      err instanceof InvalidCouponScopeError ||
      err instanceof InvalidCouponDatesError
    ) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
