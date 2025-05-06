import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListProfessionalBookingsUseCase } from './list-professional-bookings-use-case';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { BookingDTO } from '@/dtos/booking-dto';
import { createMockBookingsRepository } from '@/mock/mock-repositories';

describe('ListProfessionalBookingsUseCase', () => {
  let useCase: ListProfessionalBookingsUseCase;
  let mockBookingsRepository: ReturnType<typeof createMockBookingsRepository>;

  beforeEach(() => {
    mockBookingsRepository = createMockBookingsRepository();
    useCase = new ListProfessionalBookingsUseCase(mockBookingsRepository);
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

  it('deve retornar agendamentos com paginação', async () => {
    // Configurar mocks
    mockBookingsRepository.findManyByProfessionalId.mockResolvedValue([
      mockBooking,
    ]);
    mockBookingsRepository.countByProfessionalId.mockResolvedValue(1);

    // Executar
    const result = await useCase.execute({
      professionalId: 'pro-123',
      page: 1,
      limit: 10,
    });

    // Verificar
    expect(result).toEqual({
      bookings: [mockBooking],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    expect(
      mockBookingsRepository.findManyByProfessionalId,
    ).toHaveBeenCalledWith('pro-123', {
      page: 1,
      limit: 10,
      sort: [{ field: 'dataHoraInicio', order: 'asc' }],
      filters: {},
    });
  });

  it('deve aplicar filtros corretamente', async () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    mockBookingsRepository.findManyByProfessionalId.mockResolvedValue([
      mockBooking,
    ]);
    mockBookingsRepository.countByProfessionalId.mockResolvedValue(1);

    const result = await useCase.execute({
      professionalId: 'pro-123',
      filters: {
        status: 'CONFIRMADO',
        startDate,
        endDate,
      },
    });

    expect(result.bookings).toHaveLength(1);
    expect(
      mockBookingsRepository.findManyByProfessionalId,
    ).toHaveBeenCalledWith('pro-123', {
      page: 1,
      limit: 10,
      sort: [{ field: 'dataHoraInicio', order: 'asc' }],
      filters: {
        status: 'CONFIRMADO',
        startDate,
        endDate,
      },
    });
  });

  it('deve lançar erro quando página é maior que total de páginas', async () => {
    mockBookingsRepository.findManyByProfessionalId.mockResolvedValue([
      mockBooking,
    ]);
    mockBookingsRepository.countByProfessionalId.mockResolvedValue(10);

    await expect(
      useCase.execute({
        professionalId: 'pro-123',
        page: 2, // Página inválida pois com limit 10 só temos 1 página
        limit: 10,
      }),
    ).rejects.toThrow(InvalidPageRangeError);
  });

  it('deve lançar erro quando não encontra agendamentos', async () => {
    mockBookingsRepository.findManyByProfessionalId.mockResolvedValue([]);
    mockBookingsRepository.countByProfessionalId.mockResolvedValue(0);

    await expect(
      useCase.execute({
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(BookingNotFoundError);
  });

  it('deve lançar erro quando profissional tenta acessar agendamentos de outro', async () => {
    const wrongProfessionalBooking = {
      ...mockBooking,
      profissionalId: 'pro-456',
    };

    mockBookingsRepository.findManyByProfessionalId.mockResolvedValue([
      wrongProfessionalBooking,
    ]);
    mockBookingsRepository.countByProfessionalId.mockResolvedValue(1);

    await expect(
      useCase.execute({
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(ProfissionalTentandoPegarInformacoesDeOutro);
  });

  it('deve calcular corretamente o total de páginas', async () => {
    mockBookingsRepository.findManyByProfessionalId.mockResolvedValue([
      mockBooking,
    ]);
    mockBookingsRepository.countByProfessionalId.mockResolvedValue(25);

    const result = await useCase.execute({
      professionalId: 'pro-123',
      limit: 10,
    });

    expect(result.totalPages).toBe(3);
  });

  it('deve usar valores padrão quando não fornecidos', async () => {
    mockBookingsRepository.findManyByProfessionalId.mockResolvedValue([
      mockBooking,
    ]);
    mockBookingsRepository.countByProfessionalId.mockResolvedValue(1);

    const result = await useCase.execute({
      professionalId: 'pro-123',
    });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
});
