import { FastifyReply, FastifyRequest } from 'fastify';
import { previewBookingBodySchema } from '@/schemas/bookings';
import { makePreviewBookingPriceUseCase } from '@/use-cases/factories/make-preview-booking-price-use-case';

export async function previewBookingPrice(request: FastifyRequest, reply: FastifyReply) {
  const { professionalId, services, useBonusPoints, couponCode } = previewBookingBodySchema.parse(
    request.body,
  );

  const previewUseCase = makePreviewBookingPriceUseCase();

  const preview = await previewUseCase.execute({
    userId: request.user.sub,
    professionalId,
    services,
    useBonusPoints,
    couponCode,
  });

  return reply.status(200).send(preview);
}
