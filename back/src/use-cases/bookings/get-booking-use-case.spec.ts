import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetBookingUseCase } from './get-booking-use-case';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { BookingDTO } from '@/dtos/booking-dto';
import { createMockBookingsRepository } from '@/mock/mock-repositories';

// Tipo para o mock do repositório com métodos do Vitest
type MockBookingsRepository = BookingsRepository & {
  findById: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  findOverlappingBooking: ReturnType<typeof vi.fn>;
};

describe('GetBookingUseCase', () => {
  let useCase: GetBookingUseCase;
  let mockBookingsRepository: MockBookingsRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockBookingsRepository = createMockBookingsRepository();
    useCase = new GetBookingUseCase(mockBookingsRepository);
  });

  const mockBooking: BookingDTO = {
    id: 'booking-123',
    canceledAt: null,
    confirmedAt: null,
    createdAt: new Date('2023-01-01T09:00:00'),
    updatedAt: new Date('2023-01-01T09:00:00'),
    profissionalId: 'pro-123',
    usuarioId: 'user-123',
    dataHoraInicio: new Date('2023-01-01T10:00:00'),
    dataHoraFim: new Date('2023-01-01T11:00:00'),
    observacoes: 'Test booking',
    status: 'CONFIRMADO',
    valorFinal: 100,
    user: {
      id: 'user-123',
      nome: 'John Doe',
    },
    profissional: {
      id: 'pro-123',
      user: {
        id: 'pro-user-123',
        nome: 'Professional User',
      },
    },
    items: [
      {
        id: 'item-123',
        serviceProfessional: {
          id: 'sp-123',
          service: {
            id: 'service-123',
            nome: 'Service Name',
          },
        },
        preco: 100,
        duracao: 60,
      },
    ],
  };

  it('deve retornar um agendamento existente', async () => {
    // Configurar o mock
    mockBookingsRepository.findById.mockResolvedValue(mockBooking);

    // Executar
    const result = await useCase.execute({ bookingId: 'booking-123' });

    // Verificar
    expect(mockBookingsRepository.findById).toHaveBeenCalledWith('booking-123');
    expect(result).toEqual({
      booking: mockBooking,
    });
  });

  it('deve lançar erro quando o agendamento não existe', async () => {
    // Configurar o mock para retornar null
    mockBookingsRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(useCase.execute({ bookingId: 'booking-123' })).rejects.toThrow(
      BookingNotFoundError,
    );
    expect(mockBookingsRepository.findById).toHaveBeenCalledWith('booking-123');
  });

  it('deve lançar erro quando o ID do agendamento é vazio', async () => {
    // Executar e verificar
    await expect(useCase.execute({ bookingId: '' })).rejects.toThrow(
      BookingNotFoundError,
    );
    expect(mockBookingsRepository.findById).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando o ID do agendamento é inválido', async () => {
    // Configurar o mock para retornar null
    mockBookingsRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(useCase.execute({ bookingId: 'invalid-id' })).rejects.toThrow(
      BookingNotFoundError,
    );
    expect(mockBookingsRepository.findById).toHaveBeenCalledWith('invalid-id');
  });
});
