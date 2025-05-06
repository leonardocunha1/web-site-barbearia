import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HorariosFuncionamentoRepository } from '@/repositories/horarios-funcionamento-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { ListBusinessHoursUseCase } from './list-horario-funcionamento-profissional-use-case';
import { createMockHorariosRepository, createMockProfessionalsRepository } from '@/mock/mock-repositories';

// Tipos para os mocks
type MockHorariosRepository = HorariosFuncionamentoRepository & {
  listByProfessional: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  findByProfessionalAndDay: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = ProfessionalsRepository & {
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
  let mockHorariosRepository: MockHorariosRepository;
  let mockProfessionalsRepository: MockProfessionalsRepository;

  beforeEach(() => {
     mockHorariosRepository = createMockHorariosRepository()
    mockProfessionalsRepository = createMockProfessionalsRepository()

    useCase = new ListBusinessHoursUseCase(
      mockHorariosRepository,
      mockProfessionalsRepository,
    );
  });

  const mockProfessional = {
    id: 'prof-123',
    userId: 'user-123',
    especialidade: 'Especialidade Teste',
    ativo: true,
  };

  const mockBusinessHours = [
    {
      id: 'hours-1',
      profissionalId: 'prof-123',
      diaSemana: 1,
      abreAs: '08:00',
      fechaAs: '18:00',
      pausaInicio: '12:00',
      pausaFim: '13:00',
      ativo: true,
    },
    {
      id: 'hours-2',
      profissionalId: 'prof-123',
      diaSemana: 2,
      abreAs: '09:00',
      fechaAs: '17:00',
      pausaInicio: null,
      pausaFim: null,
      ativo: true,
    },
  ];

  it('deve listar horários de funcionamento com sucesso', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.listByProfessional.mockResolvedValue(
      mockBusinessHours,
    );

    // Executar
    const result = await useCase.execute({
      professionalId: 'prof-123',
    });

    // Verificar
    expect(result).toEqual(mockBusinessHours);
    expect(mockProfessionalsRepository.findById).toHaveBeenCalledWith(
      'prof-123',
    );
    expect(mockHorariosRepository.listByProfessional).toHaveBeenCalledWith(
      'prof-123',
    );
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
    mockHorariosRepository.listByProfessional.mockResolvedValue([]);

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
    expect(mockHorariosRepository.listByProfessional).not.toHaveBeenCalled();
  });
});
