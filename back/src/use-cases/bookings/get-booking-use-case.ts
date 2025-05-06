import { BookingsRepository } from '@/repositories/bookings-repository';
import { BookingDTO } from '@/dtos/booking-dto';
import { BookingNotFoundError } from '../errors/booking-not-found-error';

interface GetBookingRequest {
  bookingId: string;
}

interface GetBookingResponse {
  booking: BookingDTO;
}

export class GetBookingUseCase {
  constructor(private bookingsRepository: BookingsRepository) {}

  async execute({ bookingId }: GetBookingRequest): Promise<GetBookingResponse> {
    if (!bookingId) {
      throw new BookingNotFoundError();
    }

    const booking = await this.bookingsRepository.findById(bookingId);

    if (!booking) {
      throw new BookingNotFoundError();
    }

    return {
      booking,
    };
  }
}
