export class ServiceWithBookingsError extends Error {
  constructor() {
    super('Service has active bookings');
    this.name = 'ServiceWithBookingsError';
  }
}
