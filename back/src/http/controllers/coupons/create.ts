import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { formatZodError } from '@/utils/formatZodError';
import { DuplicateCouponError } from '@/use-cases/errors/duplicate-coupon-error';
import { createCouponBodySchema } from '@/schemas/coupon';
import { makeCreateCouponUseCase } from '@/use-cases/factories/make-create-coupon-use-case';

export async function createCoupon(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const {
      code,
      type,
      value,
      scope,
      description,
      maxUses,
      startDate,
      endDate,
      minBookingValue,
      serviceId,
      professionalId,
    } = createCouponBodySchema.parse(request.body);

    const createCouponUseCase = makeCreateCouponUseCase();

    const { coupon } = await createCouponUseCase.execute({
      code,
      type,
      value,
      scope,
      description,
      maxUses,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : null,
      minBookingValue,
      serviceId,
      professionalId,
    });

    return reply.status(201).send({ coupon });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (err instanceof DuplicateCouponError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
