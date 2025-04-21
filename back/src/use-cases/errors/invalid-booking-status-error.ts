export class InvalidBookingStatusError extends Error {
  constructor(currentStatus: string, requiredStatus: string) {
    super(
      `A reserva não pode ser atualizada de ${currentStatus} para ${requiredStatus}`,
    );
    this.name = 'InvalidBookingStatusError';
  }
}
