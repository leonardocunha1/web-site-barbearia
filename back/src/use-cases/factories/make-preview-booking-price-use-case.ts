import { usersRepository, professionalsRepository, serviceProfessionalRepository, userBonusRepository, couponRepository } from '@/repositories/prisma/instances';
import { PreviewBookingPriceUseCase } from '@/use-cases/bookings/preview-booking-price-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makePreviewBookingPriceUseCase() {
  const useCase = new PreviewBookingPriceUseCase(
    usersRepository,
    professionalsRepository,
    serviceProfessionalRepository,
    userBonusRepository,
    couponRepository,
  );

  return traceUseCase('booking.preview_price', useCase);
}
