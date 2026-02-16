import { IBookingsRepository } from '@/repositories/bookings-repository';

export class CancelExpiredBookingsUseCase {
  constructor(private bookingsRepository: IBookingsRepository) {}

  async execute(): Promise<{ canceledCount: number }> {
    const now = new Date();

    // Buscar agendamentos PENDING com horário já passado
    const expiredBookings = await this.bookingsRepository.findExpiredPendingBookings(now);

    // Cancelar todos em lote
    const canceledCount = await this.bookingsRepository.cancelExpiredBookings(
      expiredBookings.map((b) => b.id),
    );

    return { canceledCount };
  }
}
