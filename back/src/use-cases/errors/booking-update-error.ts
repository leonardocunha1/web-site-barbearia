export class BookingUpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookingUpdateError';
  }
}
