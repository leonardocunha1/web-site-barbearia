import { IBookingsRepository } from '@/repositories/bookings-repository';
import { BookingDTO, toBookingDTO } from '@/dtos/booking-dto';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { calculatePointsEarned } from '@/utils/booking-points';

interface GetBookingRequest {
  bookingId: string;
}

interface GetBookingResponse {
  booking: BookingDTO;
}

export class GetBookingUseCase {
  constructor(private bookingsRepository: IBookingsRepository) {}

  async execute({ bookingId }: GetBookingRequest): Promise<GetBookingResponse> {
    if (!bookingId) {
      throw new BookingNotFoundError();
    }

    const booking = await this.bookingsRepository.findById(bookingId);

    if (!booking) {
      throw new BookingNotFoundError();
    }

    const bookingWithPoints = {
      ...booking,
      pointsEarned: calculatePointsEarned(booking.BonusTransaction),
    };

    return {
      booking: toBookingDTO(bookingWithPoints),
    };
  }
}
