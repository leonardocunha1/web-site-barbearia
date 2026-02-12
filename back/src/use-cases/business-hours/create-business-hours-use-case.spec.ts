import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error';
import { InvalidBusinessHoursError } from '../errors/invalid-business-hours-error';
import { DuplicateBusinessHoursError } from '../errors/duplicate-business-hours-error';
import { IBusinessHoursRepository } from '@/repositories/business-hours-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { CreateBusinessHoursUseCase } from './create-business-hours-use-case';
import {
  createMockBusinessHoursRepository,
  createMockProfessionalsRepository,
} from '@/mock/mock-repositories';
import { makeBusinessHours, makeProfessional } from '@/test/factories';

// Tipos para os mocks
type MockBusinessHoursRepository = IBusinessHoursRepository & {
  findByProfessionalAndDay: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  listByProfessional: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = IProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

describe('Create Business Hours Use Case', () => {
  let useCase: CreateBusinessHoursUseCase;
  let mockBusinessHoursRepository: MockBusinessHoursRepository;
  let mockProfessionalsRepository: MockProfessionalsRepository;

  beforeEach(() => {
    mockBusinessHoursRepository = createMockBusinessHoursRepository();
    mockProfessionalsRepository = createMockProfessionalsRepository();

    useCase = new CreateBusinessHoursUseCase(
      mockBusinessHoursRepository,
      mockProfessionalsRepository,
    );
  });

  const mockProfessional = makeProfessional({
    id: 'prof-123',
    userId: 'user-123',
    specialty: 'Especialidade Teste',
    active: true,
  });

  const mockBusinessHours = makeBusinessHours({
    id: 'hours-123',
    professionalId: 'prof-123',
    dayOfWeek: 1,
    opensAt: '08:00',
    closesAt: '18:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    active: true,
  });

  it('deve criar horários de funcionamento com sucesso', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.findByProfessionalAndDay.mockResolvedValue(null);
    mockBusinessHoursRepository.create.mockResolvedValue(mockBusinessHours);

    // Executar
    const result = await useCase.execute({
      professionalId: 'prof-123',
      dayOfWeek: 1,
      opensAt: '08:00',
      closesAt: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
    });

    // Verificar
    expect(result).toEqual(mockBusinessHours);
    expect(mockProfessionalsRepository.findById).toHaveBeenCalledWith('prof-123');
    expect(mockBusinessHoursRepository.findByProfessionalAndDay).toHaveBeenCalledWith(
      'prof-123',
      1,
    );
    expect(mockBusinessHoursRepository.create).toHaveBeenCalledWith({
      professional: { connect: { id: 'prof-123' } },
      dayOfWeek: 1,
      opensAt: '08:00',
      closesAt: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      active: true,
    });
  });

  it('deve lançar erro quando profissional não existe', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        professionalId: 'non-existent-prof',
        dayOfWeek: 1,
        opensAt: '08:00',
        closesAt: '18:00',
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro para formato de horário inválido', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        opensAt: '25:00', // Hora inválida
        closesAt: '18:00',
      }),
    ).rejects.toThrow(InvalidTimeFormatError);
  });

  it('deve lançar erro quando horário de abertura é após fechamento', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        opensAt: '19:00',
        closesAt: '09:00', // Fecha antes de abrir
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando já existe horário para o mesmo dia', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.findByProfessionalAndDay.mockResolvedValue(mockBusinessHours);

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1, // Dia com horário já existente
        opensAt: '09:00',
        closesAt: '17:00',
      }),
    ).rejects.toThrow(DuplicateBusinessHoursError);
  });

  it('deve lançar erro para dia da semana inválido', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 7, // Dia inválido
        opensAt: '09:00',
        closesAt: '17:00',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando pausa está fora do horário de funcionamento', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        opensAt: '09:00',
        closesAt: '18:00',
        breakStart: '08:00', // Antes da abertura
        breakEnd: '09:30',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando apenas um dos horários de pausa é fornecido', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        opensAt: '09:00',
        closesAt: '18:00',
        breakStart: '12:00', // Sem breakEnd
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });
});
