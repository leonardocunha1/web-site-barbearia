import { BadRequestError } from './app-error';

const typeLabels: Record<string, string> = {
  CORTE: 'Corte',
  BARBA: 'Barba',
  SOBRANCELHA: 'Sobrancelha',
  ESTETICA: 'Estetica',
};

export class MultipleServicesPerTypeError extends BadRequestError {
  constructor(serviceType: keyof typeof typeLabels) {
    const label = typeLabels[serviceType] ?? 'servico';
    super(`Selecione apenas 1 servico do tipo ${label} por agendamento.`);
  }
}
