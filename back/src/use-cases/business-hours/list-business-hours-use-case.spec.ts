import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IBusinessHoursRepository } from '@/repositories/business-hours-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { ListBusinessHoursUseCase } from './list-business-hours-use-case';
import {
  createMockBusinessHoursRepository,
  createMockProfessionalsRepository,
} from '@/mock/mock-repositories';
import { makeBusinessHours, makeProfessional } from '@/test/factories';

// Tipos para os mocks
type MockBusinessHoursRepository = IBusinessHoursRepository & {
  listByProfessional: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  findByProfessionalAndDay: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = IProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
  findByUserId: ReturnType<typeof vi.fn>;
  findByProfessionalId: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  list: ReturnType<typeof vi.fn>;
  count: ReturnType<typeof vi.fn>;
  search: ReturnType<typeof vi.fn>;
  countSearch: ReturnType<typeof vi.fn>;
};

describe('List Business Hours Use Case', () => {
  let useCase: ListBusinessHoursUseCase;
  let mockBusinessHoursRepository: MockBusinessHoursRepository;
  let mockProfessionalsRepository: MockProfessionalsRepository;

  beforeEach(() => {
    mockBusinessHoursRepository = createMockBusinessHoursRepository();
    mockProfessionalsRepository = createMockProfessionalsRepository();

    useCase = new ListBusinessHoursUseCase(
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

  const mockBusinessHours = [
    makeBusinessHours({
      id: 'hours-1',
      professionalId: 'prof-123',
      dayOfWeek: 1,
      opensAt: '08:00',
      closesAt: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      active: true,
    }),
    makeBusinessHours({
      id: 'hours-2',
      professionalId: 'prof-123',
      dayOfWeek: 2,
      opensAt: '09:00',
      closesAt: '17:00',
      breakStart: null,
      breakEnd: null,
      active: true,
    }),
  ];

  it('deve listar horários de funcionamento com sucesso', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.listByProfessional.mockResolvedValue(mockBusinessHours);

    // Executar
    const result = await useCase.execute({
      professionalId: 'prof-123',
    });

    // Verificar
    expect(result).toEqual(mockBusinessHours);
    expect(mockProfessionalsRepository.findById).toHaveBeenCalledWith('prof-123');
    expect(mockBusinessHoursRepository.listByProfessional).toHaveBeenCalledWith('prof-123');
  });

  it('deve lançar erro quando profissional não existe', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'non-existent-prof',
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve retornar lista vazia quando não há horários cadastrados (se não for erro)', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockBusinessHoursRepository.listByProfessional.mockResolvedValue([]);

    // Executar
    const result = await useCase.execute({
      professionalId: 'prof-123',
    });

    // Verificar
    expect(result).toEqual([]);
  });

  it('deve garantir que o método listByProfessional é chamado apenas se o profissional existe', async () => {
    // Configurar mocks para simular profissional não encontrado
    mockProfessionalsRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
      }),
    ).rejects.toThrow();

    // Verificar que listByProfessional não foi chamado
    expect(mockBusinessHoursRepository.listByProfessional).not.toHaveBeenCalled();
  });
});
