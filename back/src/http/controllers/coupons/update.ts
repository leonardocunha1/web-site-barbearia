import { FastifyReply, FastifyRequest } from 'fastify';
import { updateCouponBodySchema } from '@/schemas/coupon';
import { makeUpdateCouponUseCase } from '@/use-cases/factories/make-update-coupon-use-case';

export async function updateCoupon(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateCouponParamsSchema = z.object({
    couponId: z.string().uuid(),
  });
  const { couponId } = updateCouponParamsSchema.parse(request.params);
  const body = updateCouponBodySchema.parse(request.body);

  const updateCouponUseCase = makeUpdateCouponUseCase();

  const { coupon } = await updateCouponUseCase.execute({
    couponId, date: {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });

  return reply.status(200).send({ coupon });
}
