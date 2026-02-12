import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetBookingUseCase } from './get-booking-use-case';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { mockBooking } from '@/dtos/booking-dto';
import { createMockBookingsRepository } from '@/mock/mock-repositories';

describe('GetBookingUseCase', () => {
  let useCase: GetBookingUseCase;
  let mockBookingsRepository: ReturnType<typeof createMockBookingsRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockBookingsRepository = createMockBookingsRepository();
    useCase = new GetBookingUseCase(mockBookingsRepository);
  });

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
    await expect(useCase.execute({ bookingId: '' })).rejects.toThrow(BookingNotFoundError);
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
