import { ForbiddenError } from './app-error';

export class ServiceWithBookingsError extends ForbiddenError {
  constructor() {
    super('O Serviço possui agendamentos ativos.', 'SERVICE_WITH_BOOKINGS');
  }
}
