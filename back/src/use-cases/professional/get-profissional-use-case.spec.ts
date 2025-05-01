import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { GetProfessionalDashboardUseCase } from './get-profissional-use-case';
import { createMockBookingsRepository } from '@/mock/mock-bookings-repository';
import { createMockProfessionalsRepository } from '@/mock/mock-professionals-repository';
import bcrypt from 'bcryptjs';
import { createMockUsersRepository } from '@/mock/mock-users-repository';

describe('GetProfessionalDashboardUseCase', () => {
  const { mockRepository: mockBookingsRepository } =
    createMockBookingsRepository();

  const {
    mockRepository: mockProfessionalsRepository,
    createMockProfessionalWithRelations,
  } = createMockProfessionalsRepository();

  let useCase: GetProfessionalDashboardUseCase;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-06-15T12:00:00'));

    // Configuração padrão dos mocks
    mockProfessionalsRepository.findByProfessionalId.mockImplementation((id) =>
      Promise.resolve(createMockProfessionalWithRelations({ id })),
    );

    useCase = new GetProfessionalDashboardUseCase(
      mockProfessionalsRepository,
      mockBookingsRepository,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should return correct dashboard structure', async () => {
    // Arrange
    const { createMockUser } = createMockUsersRepository();
    const user = createMockUser({
      nome: 'Custom Name',
    });

    const professional = createMockProfessionalWithRelations({
      id: 'prof-1',
      especialidade: 'Corte de Cabelo',
      user,
    });

    mockProfessionalsRepository.findByProfessionalId.mockResolvedValueOnce(
      professional,
    );

    mockBookingsRepository.findNextAppointments.mockResolvedValueOnce([
      {
        id: 'booking-1',
        dataHoraInicio: new Date('2023-06-15T10:00:00'),
        status: 'CONFIRMADO',
        user: { nome: 'Cliente Teste' },
        items: [{ service: { nome: 'Corte de Cabelo' } }],
      },
    ]);

    mockBookingsRepository.countByProfessionalAndDate.mockResolvedValueOnce(1);
    mockBookingsRepository.getEarningsByProfessionalAndDate.mockResolvedValueOnce(
      50,
    );
    mockBookingsRepository.countByProfessionalAndStatus.mockResolvedValueOnce(
      1,
    );

    // Act
    const dashboard = await useCase.execute('prof-1', { range: 'today' });

    // Assert
    expect(
      mockProfessionalsRepository.findByProfessionalId,
    ).toHaveBeenCalledWith('prof-1');
    expect(dashboard).toMatchObject({
      professional: {
        name: 'Custom Name',
        specialty: 'Corte de Cabelo',
        avatarUrl: null,
      },
      metrics: {
        appointments: 1,
        earnings: 50,
        canceled: 1,
        completed: 1,
      },
      nextAppointments: [
        {
          id: 'booking-1',
          date: expect.any(Date),
          clientName: 'Cliente Teste',
          service: 'Corte de Cabelo',
          status: 'CONFIRMADO',
        },
      ],
    });
  });

  it('should return professional dashboard with metrics and next appointments', async () => {
    // Arrange
    const { createMockUser } = createMockUsersRepository();
    const user = createMockUser({
      nome: 'João Barber',
      email: 'teste@teste.com',
      senha: bcrypt.hashSync('123456', 8),
      role: 'PROFISSIONAL',
    });

    const professional = createMockProfessionalWithRelations({
      id: 'prof-1',
      especialidade: 'Barbeiro',
      avatarUrl: 'http://example.com/avatar.jpg',
      user,
    });

    mockProfessionalsRepository.findByProfessionalId.mockResolvedValueOnce(
      professional,
    );

    mockBookingsRepository.findNextAppointments.mockResolvedValueOnce([
      {
        id: 'booking-3',
        dataHoraInicio: new Date('2023-06-16T10:00:00'),
        status: 'PENDENTE',
        user: { nome: 'Cliente 3' },
        items: [{ service: { nome: 'Corte e Barba' } }],
      },
    ]);

    mockBookingsRepository.countByProfessionalAndDate.mockResolvedValueOnce(2);
    mockBookingsRepository.getEarningsByProfessionalAndDate.mockResolvedValueOnce(
      50,
    );
    mockBookingsRepository.countByProfessionalAndStatus
      .mockResolvedValueOnce(1) // canceled
      .mockResolvedValueOnce(1); // completed

    // Act
    const dashboard = await useCase.execute('prof-1', { range: 'today' });

    // Assert
    expect(
      mockProfessionalsRepository.findByProfessionalId,
    ).toHaveBeenCalledWith('prof-1');
    expect(dashboard.nextAppointments).toHaveLength(1);
    expect(dashboard.metrics.earnings).toBe(50);
    expect(dashboard.nextAppointments[0].service).toBe('Corte e Barba');
    expect(dashboard.nextAppointments[0].status).toBe('PENDENTE');
    expect(dashboard.professional.name).toBe('João Barber');
    expect(dashboard.professional.specialty).toBe('Barbeiro');
  });
});
