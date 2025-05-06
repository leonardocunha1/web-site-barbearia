import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidDataError } from '../errors/invalid-data-error';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { GetProfessionalDashboardUseCase } from './get-profissional-use-case';
import {
  createMockBookingsRepository,
  createMockProfessionalsRepository,
} from '@/mock/mock-repositories';

// Tipos para os mocks
type MockProfessionalsRepository = ProfessionalsRepository & {
  findByProfessionalId: ReturnType<typeof vi.fn>;
};

type MockBookingsRepository = BookingsRepository & {
  countByProfessionalAndDate: ReturnType<typeof vi.fn>;
  getEarningsByProfessionalAndDate: ReturnType<typeof vi.fn>;
  countByProfessionalAndStatus: ReturnType<typeof vi.fn>;
  findNextAppointments: ReturnType<typeof vi.fn>;
};

describe('Get Professional Dashboard Use Case', () => {
  let useCase: GetProfessionalDashboardUseCase;
  let mockProfessionalsRepository: MockProfessionalsRepository;
  let mockBookingsRepository: MockBookingsRepository;

  beforeEach(() => {
    mockProfessionalsRepository = createMockProfessionalsRepository();
    mockBookingsRepository = createMockBookingsRepository();

    useCase = new GetProfessionalDashboardUseCase(
      mockProfessionalsRepository,
      mockBookingsRepository,
    );
  });

  const mockProfessional = {
    id: 'prof-123',
    userId: 'user-123',
    especialidade: 'Dentista',
    avatarUrl: 'avatar.jpg',
    user: {
      id: 'user-123',
      nome: 'Dr. Smith',
      email: 'dr.smith@example.com',
    },
  };

  const mockNextAppointments = [
    {
      id: 'booking-1',
      dataHoraInicio: new Date('2023-01-01T10:00:00'),
      user: {
        id: 'user-1',
        nome: 'Client 1',
      },
      items: [
        {
          serviceProfessional: {
            service: {
              nome: 'Limpeza',
            },
          },
        },
      ],
      status: 'CONFIRMADO',
    },
  ];

  const mockDashboardData = {
    professional: {
      name: mockProfessional.user.nome,
      specialty: mockProfessional.especialidade,
      avatarUrl: mockProfessional.avatarUrl,
    },
    metrics: {
      appointments: 10,
      earnings: 2500,
      canceled: 2,
      completed: 8,
    },
    nextAppointments: [
      {
        id: 'booking-1',
        date: new Date('2023-01-01T10:00:00'),
        clientName: 'Client 1',
        service: 'Limpeza',
        status: 'CONFIRMADO',
      },
    ],
  };

  it('deve retornar dashboard para intervalo "today"', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findByProfessionalId.mockResolvedValue(
      mockProfessional,
    );
    mockBookingsRepository.countByProfessionalAndDate.mockResolvedValue(10);
    mockBookingsRepository.getEarningsByProfessionalAndDate.mockResolvedValue(
      2500,
    );
    mockBookingsRepository.countByProfessionalAndStatus.mockResolvedValueOnce(
      2,
    ); // canceled
    mockBookingsRepository.countByProfessionalAndStatus.mockResolvedValueOnce(
      8,
    ); // completed
    mockBookingsRepository.findNextAppointments.mockResolvedValue(
      mockNextAppointments,
    );

    // Executar
    const result = await useCase.execute('prof-123', { range: 'today' });

    // Verificar
    expect(result).toEqual(mockDashboardData);

    // Verificar datas (hoje)
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    expect(
      mockBookingsRepository.countByProfessionalAndDate,
    ).toHaveBeenCalledWith('prof-123', todayStart, todayEnd);
  });

  it('deve retornar dashboard para intervalo "week"', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findByProfessionalId.mockResolvedValue(
      mockProfessional,
    );
    mockBookingsRepository.countByProfessionalAndDate.mockResolvedValue(15);
    mockBookingsRepository.getEarningsByProfessionalAndDate.mockResolvedValue(
      3500,
    );
    mockBookingsRepository.countByProfessionalAndStatus.mockResolvedValueOnce(
      3,
    ); // canceled
    mockBookingsRepository.countByProfessionalAndStatus.mockResolvedValueOnce(
      12,
    ); // completed
    mockBookingsRepository.findNextAppointments.mockResolvedValue(
      mockNextAppointments,
    );

    // Executar
    await useCase.execute('prof-123', { range: 'week' });

    // Verificar datas (últimos 7 dias)
    const now = new Date();
    const weekStart = startOfDay(subDays(now, 6));
    const weekEnd = endOfDay(now);
    expect(
      mockBookingsRepository.countByProfessionalAndDate,
    ).toHaveBeenCalledWith('prof-123', weekStart, weekEnd);
  });

  it('deve retornar dashboard para intervalo "month"', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findByProfessionalId.mockResolvedValue(
      mockProfessional,
    );
    mockBookingsRepository.countByProfessionalAndDate.mockResolvedValue(50);
    mockBookingsRepository.getEarningsByProfessionalAndDate.mockResolvedValue(
      12000,
    );
    mockBookingsRepository.countByProfessionalAndStatus.mockResolvedValueOnce(
      5,
    ); // canceled
    mockBookingsRepository.countByProfessionalAndStatus.mockResolvedValueOnce(
      45,
    ); // completed
    mockBookingsRepository.findNextAppointments.mockResolvedValue(
      mockNextAppointments,
    );

    // Executar
    await useCase.execute('prof-123', { range: 'month' });

    // Verificar datas (últimos 30 dias)
    const now = new Date();
    const monthStart = startOfDay(subDays(now, 30));
    const monthEnd = endOfDay(now);
    expect(
      mockBookingsRepository.countByProfessionalAndDate,
    ).toHaveBeenCalledWith('prof-123', monthStart, monthEnd);
  });

  it('deve retornar dashboard para intervalo "custom" com datas válidas', async () => {
    // Configurar mocks com valores consistentes
    const customMetrics = {
      appointments: 5,
      earnings: 1500,
      canceled: 1,
      completed: 4,
    };

    mockProfessionalsRepository.findByProfessionalId.mockResolvedValue(
      mockProfessional,
    );
    mockBookingsRepository.countByProfessionalAndDate.mockResolvedValue(
      customMetrics.appointments,
    );
    mockBookingsRepository.getEarningsByProfessionalAndDate.mockResolvedValue(
      customMetrics.earnings,
    );
    mockBookingsRepository.countByProfessionalAndStatus
      .mockResolvedValueOnce(customMetrics.canceled)
      .mockResolvedValueOnce(customMetrics.completed);
    mockBookingsRepository.findNextAppointments.mockResolvedValue(
      mockNextAppointments,
    );

    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    // Executar
    const result = await useCase.execute('prof-123', {
      range: 'custom',
      startDate,
      endDate,
    });

    // Criar objeto de expectativa específico para este teste
    const expectedResponse = {
      professional: {
        name: mockProfessional.user.nome,
        specialty: mockProfessional.especialidade,
        avatarUrl: mockProfessional.avatarUrl,
      },
      metrics: customMetrics,
      nextAppointments: mockNextAppointments.map((appointment) => ({
        id: appointment.id,
        date: appointment.dataHoraInicio,
        clientName: appointment.user.nome,
        service:
          appointment.items[0]?.serviceProfessional.service.nome ||
          'Vários serviços',
        status: appointment.status as 'PENDENTE' | 'CONFIRMADO',
      })),
    };

    // Verificar
    expect(result).toEqual(expectedResponse);
    expect(
      mockBookingsRepository.countByProfessionalAndDate,
    ).toHaveBeenCalledWith(
      'prof-123',
      startOfDay(startDate),
      endOfDay(endDate),
    );
  });

  it('deve lançar erro quando profissional não existe', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findByProfessionalId.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute('non-existent-prof', { range: 'today' }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro para intervalo "custom" sem datas', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findByProfessionalId.mockResolvedValue(
      mockProfessional,
    );

    // Executar e verificar
    await expect(
      useCase.execute('prof-123', { range: 'custom' }),
    ).rejects.toThrow(InvalidDataError);
  });

  it('deve lançar erro para intervalo "custom" com datas inválidas', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findByProfessionalId.mockResolvedValue(
      mockProfessional,
    );

    // Executar e verificar - datas inválidas
    await expect(
      useCase.execute('prof-123', {
        range: 'custom',
        startDate: new Date('invalid'),
        endDate: new Date('2023-01-01'),
      }),
    ).rejects.toThrow(InvalidDataError);

    // Executar e verificar - data inicial após data final
    await expect(
      useCase.execute('prof-123', {
        range: 'custom',
        startDate: new Date('2023-01-02'),
        endDate: new Date('2023-01-01'),
      }),
    ).rejects.toThrow(InvalidDataError);
  });

  it('deve lançar erro para intervalo inválido', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findByProfessionalId.mockResolvedValue(
      mockProfessional,
    );

    // Executar e verificar
    await expect(
      useCase.execute('prof-123', {
        range: 'invalid' as 'today' | 'week' | 'month' | 'custom',
      }),
    ).rejects.toThrow(InvalidDataError);
  });

  it('deve retornar "Vários serviços" quando há múltiplos itens', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findByProfessionalId.mockResolvedValue(
      mockProfessional,
    );
    mockBookingsRepository.countByProfessionalAndDate.mockResolvedValue(1);
    mockBookingsRepository.getEarningsByProfessionalAndDate.mockResolvedValue(
      100,
    );
    mockBookingsRepository.countByProfessionalAndStatus.mockResolvedValue(0);

    // Criar mock com múltiplos itens (2 serviços)
    const multiServiceAppointment = {
      id: 'booking-multi',
      dataHoraInicio: new Date('2023-01-01T10:00:00'),
      user: {
        id: 'user-1',
        nome: 'Client 1',
      },
      items: [
        {
          serviceProfessional: {
            service: {
              nome: 'Limpeza',
            },
          },
        },
        {
          serviceProfessional: {
            service: {
              nome: 'Clareamento',
            },
          },
        },
      ],
      status: 'CONFIRMADO',
    };

    mockBookingsRepository.findNextAppointments.mockResolvedValue([
      multiServiceAppointment,
    ]);

    // Executar
    const result = await useCase.execute('prof-123', { range: 'today' });

    // Verificar
    expect(result.nextAppointments).toHaveLength(1);
    expect(result.nextAppointments[0].service).toBe('Vários serviços');
  });

  it('deve retornar nome do serviço quando há apenas um item', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findByProfessionalId.mockResolvedValue(
      mockProfessional,
    );
    mockBookingsRepository.countByProfessionalAndDate.mockResolvedValue(1);
    mockBookingsRepository.getEarningsByProfessionalAndDate.mockResolvedValue(
      100,
    );
    mockBookingsRepository.countByProfessionalAndStatus.mockResolvedValue(0);

    // Criar mock com um único item
    const singleServiceAppointment = {
      id: 'booking-single',
      dataHoraInicio: new Date('2023-01-01T10:00:00'),
      user: {
        id: 'user-1',
        nome: 'Client 1',
      },
      items: [
        {
          serviceProfessional: {
            service: {
              nome: 'Limpeza',
            },
          },
        },
      ],
      status: 'CONFIRMADO',
    };

    mockBookingsRepository.findNextAppointments.mockResolvedValue([
      singleServiceAppointment,
    ]);

    // Executar
    const result = await useCase.execute('prof-123', { range: 'today' });

    // Verificar
    expect(result.nextAppointments).toHaveLength(1);
    expect(result.nextAppointments[0].service).toBe('Limpeza');
  });

  it('deve retornar "Serviço não especificado" quando não há itens', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findByProfessionalId.mockResolvedValue(
      mockProfessional,
    );
    mockBookingsRepository.countByProfessionalAndDate.mockResolvedValue(1);
    mockBookingsRepository.getEarningsByProfessionalAndDate.mockResolvedValue(
      100,
    );
    mockBookingsRepository.countByProfessionalAndStatus.mockResolvedValue(0);

    // Criar mock sem itens
    const noServiceAppointment = {
      id: 'booking-no-service',
      dataHoraInicio: new Date('2023-01-01T10:00:00'),
      user: {
        id: 'user-1',
        nome: 'Client 1',
      },
      items: [],
      status: 'CONFIRMADO',
    };

    mockBookingsRepository.findNextAppointments.mockResolvedValue([
      noServiceAppointment,
    ]);

    // Executar
    const result = await useCase.execute('prof-123', { range: 'today' });

    // Verificar
    expect(result.nextAppointments).toHaveLength(1);
    expect(result.nextAppointments[0].service).toBe('Serviço não especificado');
  });
});
