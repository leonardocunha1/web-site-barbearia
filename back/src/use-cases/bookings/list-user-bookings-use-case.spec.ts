import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import { UsuarioTentandoPegarInformacoesDeOutro } from '../errors/usuario-pegando-informacao-de-outro-usuario-error';
import { BookingDTO } from '@/dtos/booking-dto';
import { ListBookingsUseCase } from './list-user-bookings-use-case';
import { createMockBookingsRepository } from '@/mock/mock-repositories';

// Tipo para o mock do repositório com métodos do Vitest
type MockBookingsRepository = BookingsRepository & {
  findManyByUserId: ReturnType<typeof vi.fn>;
  countByUserId: ReturnType<typeof vi.fn>;
};

describe('ListBookingsUseCase', () => {
  let useCase: ListBookingsUseCase;
  let mockBookingsRepository: MockBookingsRepository;

  beforeEach(() => {
    mockBookingsRepository = createMockBookingsRepository();

    useCase = new ListBookingsUseCase(mockBookingsRepository);
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
    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(1);

    // Executar
    const result = await useCase.execute({
      userId: 'user-123',
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
    expect(mockBookingsRepository.findManyByUserId).toHaveBeenCalledWith(
      'user-123',
      {
        page: 1,
        limit: 10,
        sort: [{ field: 'dataHoraInicio', order: 'asc' }],
        filters: {},
      },
    );
  });

  it('deve aplicar filtros corretamente', async () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(1);

    const result = await useCase.execute({
      userId: 'user-123',
      filters: {
        status: 'CONFIRMADO',
        startDate,
        endDate,
      },
    });

    expect(result.bookings).toHaveLength(1);
    expect(mockBookingsRepository.findManyByUserId).toHaveBeenCalledWith(
      'user-123',
      {
        page: 1,
        limit: 10,
        sort: [{ field: 'dataHoraInicio', order: 'asc' }],
        filters: {
          status: 'CONFIRMADO',
          startDate,
          endDate,
        },
      },
    );
  });

  it('deve lançar erro quando página é maior que total de páginas', async () => {
    // Configurar para retornar 1 booking mas total de 10 registros
    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(10);

    await expect(
      useCase.execute({
        userId: 'user-123',
        page: 2, // Inválido pois com limit=10 e total=10 só tem 1 página
        limit: 10,
      }),
    ).rejects.toThrow(InvalidPageRangeError);
  });

  it('deve lançar erro quando página é maior que total de registros', async () => {
    // Configurar para retornar 1 booking mas total de 10 registros
    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(10);

    await expect(
      useCase.execute({
        userId: 'user-123',
        page: 2,
        limit: 10,
      }),
    ).rejects.toThrow(InvalidPageRangeError);
  });

  it('deve lançar erro quando não encontra agendamentos', async () => {
    // Configurar mocks para retornar array vazio e total zero
    mockBookingsRepository.findManyByUserId.mockResolvedValue([]);
    mockBookingsRepository.countByUserId.mockResolvedValue(0);

    await expect(
      useCase.execute({
        userId: 'user-123',
      }),
    ).rejects.toThrow(BookingNotFoundError);
  });

  it('deve lançar erro quando usuário tenta acessar agendamentos de outro', async () => {
    const wrongUserBooking = {
      ...mockBooking,
      usuarioId: 'user-456', // ID diferente do solicitado
    };

    mockBookingsRepository.findManyByUserId.mockResolvedValue([
      wrongUserBooking,
    ]);
    mockBookingsRepository.countByUserId.mockResolvedValue(1);

    await expect(
      useCase.execute({
        userId: 'user-123', // ID diferente do retornado
      }),
    ).rejects.toThrow(UsuarioTentandoPegarInformacoesDeOutro);
  });

  it('deve calcular corretamente o total de páginas', async () => {
    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(25); // 25 registros no total

    const result = await useCase.execute({
      userId: 'user-123',
      limit: 10,
    });

    expect(result.totalPages).toBe(3); // 25/10 = 2.5 → arredonda para 3
  });

  it('deve usar valores padrão quando não fornecidos', async () => {
    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(1);

    const result = await useCase.execute({
      userId: 'user-123',
    });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
});
