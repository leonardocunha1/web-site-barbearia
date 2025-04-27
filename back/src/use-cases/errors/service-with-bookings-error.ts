export class ServiceWithBookingsError extends Error {
  constructor() {
    super('O Serviço possui agendamentos ativos.');
    this.name = 'ServiceWithBookingsError';
  }
}
