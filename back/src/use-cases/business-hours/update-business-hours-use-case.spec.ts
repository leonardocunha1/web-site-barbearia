import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IBusinessHoursRepository } from '@/repositories/business-hours-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error';
import { InvalidBusinessHoursError } from '../errors/invalid-business-hours-error';
import { UpdateBusinessHoursUseCase } from './update-business-hours-use-case';
import {
  createMockBusinessHoursRepository,
  createMockProfessionalsRepository,
} from '@/mock/mock-repositories';
import { makeBusinessHours, makeProfessional } from '@/test/factories';

// Tipos para os mocks
type MockBusinessHoursRepository = IBusinessHoursRepository & {
  findByProfessionalAndDay: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  listByProfessional: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = IProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

describe('Update Business Hours Use Case', () => {
  let useCase: UpdateBusinessHoursUseCase;
  let mockBusinessHoursRepository: MockBusinessHoursRepository;
  let mockProfessionalsRepository: MockProfessionalsRepository;

  beforeEach(() => {
    mockBusinessHoursRepository = createMockBusinessHoursRepository();
    mockProfessionalsRepository = createMockProfessionalsRepository();

    useCase = new UpdateBusinessHoursUseCase(
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

  const mockExistingHours = makeBusinessHours({
    id: 'hours-123',
    professionalId: 'prof-123',
    dayOfWeek: 1,
    opensAt: '08:00',
    closesAt: '18:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    active: true,
  });

  it('deve atualizar horários de funcionamento com sucesso', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.findByProfessionalAndDay.mockResolvedValue(mockExistingHours);
    mockBusinessHoursRepository.update.mockResolvedValue({
      ...mockExistingHours,
      opensAt: '09:00',
      closesAt: '19:00',
    });

    // Executar
    const result = await useCase.execute({
      professionalId: 'prof-123',
      dayOfWeek: 1,
      opensAt: '09:00',
      closesAt: '19:00',
    });

    // Verificar
    expect(result).toEqual({
      ...mockExistingHours,
      opensAt: '09:00',
      closesAt: '19:00',
    });
    expect(mockProfessionalsRepository.findById).toHaveBeenCalledWith('prof-123');
    expect(mockBusinessHoursRepository.findByProfessionalAndDay).toHaveBeenCalledWith(
      'prof-123',
      1,
    );
    expect(mockBusinessHoursRepository.update).toHaveBeenCalledWith('hours-123', {
      opensAt: '09:00',
      closesAt: '19:00',
      breakStart: '12:00',
      breakEnd: '13:00',
    });
  });

  it('deve atualizar apenas a pausa mantendo outros horários', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.findByProfessionalAndDay.mockResolvedValue(mockExistingHours);
    mockBusinessHoursRepository.update.mockResolvedValue({
      ...mockExistingHours,
      breakStart: '12:30',
      breakEnd: '13:30',
    });

    // Executar
    const result = await useCase.execute({
      professionalId: 'prof-123',
      dayOfWeek: 1,
      breakStart: '12:30',
      breakEnd: '13:30',
    });

    // Verificar
    expect(result).toEqual({
      ...mockExistingHours,
      breakStart: '12:30',
      breakEnd: '13:30',
    });
    expect(mockBusinessHoursRepository.update).toHaveBeenCalledWith('hours-123', {
      opensAt: '08:00',
      closesAt: '18:00',
      breakStart: '12:30',
      breakEnd: '13:30',
    });
  });

  it('deve remover a pausa quando informado null', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.findByProfessionalAndDay.mockResolvedValue(mockExistingHours);
    mockBusinessHoursRepository.update.mockResolvedValue({
      ...mockExistingHours,
      breakStart: null,
      breakEnd: null,
    });

    // Executar
    const result = await useCase.execute({
      professionalId: 'prof-123',
      dayOfWeek: 1,
      breakStart: null,
      breakEnd: null,
    });

    // Verificar
    expect(result).toEqual({
      ...mockExistingHours,
      breakStart: null,
      breakEnd: null,
    });
  });

  it('deve lançar erro quando profissional não existe', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'non-existent-prof',
        dayOfWeek: 1,
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro para dia da semana inválido', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 7, // Inválido (deve ser 0-6)
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando horário não existe para atualização', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.findByProfessionalAndDay.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando apenas um horário de pausa é informado', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.findByProfessionalAndDay.mockResolvedValue(mockExistingHours);

    // Executar e verificar - apenas breakStart
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        breakStart: '12:30',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);

    // Executar e verificar - apenas breakEnd
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        breakEnd: '13:30',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro para formato de horário inválido', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.findByProfessionalAndDay.mockResolvedValue(mockExistingHours);

    // Executar e verificar - opensAt inválido
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        opensAt: '25:00', // Hora inválida
      }),
    ).rejects.toThrow(InvalidTimeFormatError);

    // Executar e verificar - closesAt inválido
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        closesAt: '18:60', // Minutos inválidos
      }),
    ).rejects.toThrow(InvalidTimeFormatError);
  });

  it('deve lançar erro quando horário de abertura é após fechamento', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.findByProfessionalAndDay.mockResolvedValue(mockExistingHours);

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        opensAt: '19:00',
        closesAt: '09:00', // Fecha antes de abrir
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando pausa está fora do horário de funcionamento', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.findByProfessionalAndDay.mockResolvedValue(mockExistingHours);

    // Executar e verificar - pausa antes da abertura
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        breakStart: '07:00',
        breakEnd: '08:30',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);

    // Executar e verificar - pausa após o fechamento
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        breakStart: '18:30',
        breakEnd: '19:00',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando início da pausa é após o fim', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.findByProfessionalAndDay.mockResolvedValue(mockExistingHours);

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        dayOfWeek: 1,
        breakStart: '14:00',
        breakEnd: '13:00', // Fim antes do início
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });
});
