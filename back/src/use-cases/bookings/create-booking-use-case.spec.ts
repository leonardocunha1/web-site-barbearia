import { describe, it, expect, beforeEach } from 'vitest';
import { CreateBookingUseCase } from './create-booking-use-case';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidDateTimeError } from '../errors/invalid-date-time-error';
import { TimeSlotAlreadyBookedError } from '../errors/time-slot-already-booked-error';
import { ServiceProfessionalNotFoundError } from '../errors/service-professional-not-found-error';
import { InvalidDurationError } from '../errors/invalid-duration-error';
import {
  createMockBookingsRepository,
  createMockProfessionalsRepository,
  createMockServiceProfessionalRepository,
  createMockUsersRepository,
} from '@/mock/mock-repositories';

// Função para criar todos os mocks
const createMockRepositories = () => ({
  bookingsRepository: createMockBookingsRepository(),
  usersRepository: createMockUsersRepository(),
  professionalsRepository: createMockProfessionalsRepository(),
  serviceProfessionalRepository: createMockServiceProfessionalRepository(),
});

describe('CreateBookingUseCase', () => {
  let useCase: CreateBookingUseCase;
  let mockRepos: ReturnType<typeof createMockRepositories>;

  beforeEach(() => {
    mockRepos = createMockRepositories();
    useCase = new CreateBookingUseCase(
      mockRepos.bookingsRepository,
      mockRepos.usersRepository,
      mockRepos.professionalsRepository,
      mockRepos.serviceProfessionalRepository,
    );
  });

  it('deve criar um agendamento com sucesso', async () => {
    const now = new Date();
    const startDateTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 hora

    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      {
        id: 'sp-1',
        professionalId: 'pro-1',
        preco: 100,
        duracao: 60,
        service: {
          id: 'srv-1',
          nome: 'Serviço X',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      },
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    await useCase.execute({
      userId: 'user-1',
      professionalId: 'pro-1',
      services: [{ serviceId: 'srv-1' }],
      startDateTime,
      notes: 'observações',
    });

    expect(mockRepos.bookingsRepository.create).toHaveBeenCalledWith({
      dataHoraInicio: startDateTime,
      dataHoraFim: new Date(startDateTime.getTime() + 60 * 60000),
      observacoes: 'observações',
      user: { connect: { id: 'user-1' } },
      profissional: { connect: { id: 'pro-1' } },
      status: 'PENDENTE',
      valorFinal: 100,
      items: {
        create: [
          {
            serviceProfessionalId: 'sp-1',
            preco: 100,
            nome: 'Serviço X',
            duracao: 60,
          },
        ],
      },
    });
  });

  it('deve lançar erro se data for no passado', async () => {
    const pastDate = new Date(Date.now() - 1000);

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: pastDate,
      }),
    ).rejects.toThrow(InvalidDateTimeError);
  });

  it('deve lançar erro se usuário não existir', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue(null);
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('deve lançar erro se profissional não existir', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue(null);

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro se serviço não estiver vinculado ao profissional', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      null,
    );

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(ServiceProfessionalNotFoundError);
  });

  it('deve lançar erro se duração do serviço for inválida', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      {
        id: 'sp-1',
        professionalId: 'pro-1',
        preco: 100,
        duracao: 0, // duração inválida
        service: {
          id: 'srv-1',
          nome: 'Serviço X',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      },
    );

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(InvalidDurationError);
  });

  it('deve lançar erro se houver agendamento no mesmo horário', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional.mockResolvedValue(
      {
        id: 'sp-1',
        professionalId: 'pro-1',
        preco: 100,
        duracao: 60,
        service: {
          id: 'srv-1',
          nome: 'Serviço X',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      },
    );
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue({
      id: 'existing',
    });

    await expect(() =>
      useCase.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'srv-1' }],
        startDateTime: futureDate,
      }),
    ).rejects.toThrow(TimeSlotAlreadyBookedError);
  });

  it('deve calcular corretamente para múltiplos serviços', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    mockRepos.usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    mockRepos.professionalsRepository.findById.mockResolvedValue({
      id: 'pro-1',
    });
    mockRepos.serviceProfessionalRepository.findByServiceAndProfessional
      .mockResolvedValueOnce({
        // Primeiro serviço
        id: 'sp-1',
        professionalId: 'pro-1',
        preco: 100,
        duracao: 30,
        service: {
          id: 'srv-1',
          nome: 'Serviço A',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      })
      .mockResolvedValueOnce({
        // Segundo serviço
        id: 'sp-2',
        professionalId: 'pro-1',
        preco: 150,
        duracao: 45,
        service: {
          id: 'srv-2',
          nome: 'Serviço B',
          descricao: null,
          categoria: null,
          ativo: true,
        },
      });
    mockRepos.bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    await useCase.execute({
      userId: 'user-1',
      professionalId: 'pro-1',
      services: [{ serviceId: 'srv-1' }, { serviceId: 'srv-2' }],
      startDateTime: futureDate,
    });

    const createCall = mockRepos.bookingsRepository.create.mock.calls[0][0];
    expect(createCall.dataHoraFim).toEqual(
      new Date(futureDate.getTime() + 75 * 60000),
    ); // 30 + 45 minutos
    expect(createCall.valorFinal).toBe(250); // 100 + 150
    expect(createCall.items.create).toHaveLength(2);
  });
});
