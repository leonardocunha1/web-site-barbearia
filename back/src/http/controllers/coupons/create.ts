import { FastifyReply, FastifyRequest } from 'fastify';
import { createCouponBodySchema } from '@/schemas/coupon';
import { makeCreateCouponUseCase } from '@/use-cases/factories/make-create-coupon-use-case';

export async function createCoupon(
  request: FastifyRequest,
  reply: FastifyReply,
) {
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
}
