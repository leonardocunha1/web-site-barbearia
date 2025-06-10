import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateBookingUseCase } from '@/use-cases/factories/make-create-booking-use-case';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { TimeSlotAlreadyBookedError } from '@/use-cases/errors/time-slot-already-booked-error';
import { InvalidDateTimeError } from '@/use-cases/errors/invalid-date-time-error';
import { InvalidDurationError } from '@/use-cases/errors/invalid-duration-error';
import { formatZodError } from '@/utils/formatZodError';
import { createBookingBodySchema } from '@/schemas/bookings';
import { InsufficientBonusPointsError } from '@/use-cases/errors/insufficient-bonus-points-error';
import { InvalidBonusRedemptionError } from '@/use-cases/errors/invalid-bonus-redemption-error';
import { CouponBonusConflictError } from '@/use-cases/errors/coupon-bonus-conflict-error';
import { CouponNotApplicableError } from '@/use-cases/errors/coupon-not-applicable-error';
import { InvalidCouponError } from '@/use-cases/bookings/invalid-coupon-error';

export async function createBooking(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const {
      professionalId,
      services,
      startDateTime,
      notes,
      useBonusPoints,
      couponCode,
    } = createBookingBodySchema.parse(request.body);

    const createBookingUseCase = makeCreateBookingUseCase();

    await createBookingUseCase.execute({
      userId: request.user.sub,
      professionalId,
      services,
      startDateTime: new Date(startDateTime),
      notes,
      useBonusPoints,
      couponCode,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (
      err instanceof UserNotFoundError ||
      err instanceof ProfessionalNotFoundError ||
      err instanceof ServiceNotFoundError
    ) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof TimeSlotAlreadyBookedError) {
      return reply.status(409).send({ message: err.message });
    }

    if (
      err instanceof InvalidDateTimeError ||
      err instanceof InvalidDurationError ||
      err instanceof InsufficientBonusPointsError ||
      err instanceof InvalidBonusRedemptionError ||
      err instanceof CouponBonusConflictError ||
      err instanceof InvalidCouponError ||
      err instanceof CouponNotApplicableError
    ) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
