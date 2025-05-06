import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeriadosRepository } from '@/repositories/feriados-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';

import { startOfToday } from 'date-fns';
import { CreateHolidayUseCase } from './create-feriado-professional-use-case';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { PastDateError } from '../errors/past-date-error';
import { InvalidHolidayDescriptionError } from '../errors/invalid-holiday-description-error';
import { DuplicateHolidayError } from '../errors/duplicate-holiday-error';

// Tipos para os mocks
type MockFeriadosRepository = FeriadosRepository & {
  findByProfessionalAndDate: ReturnType<typeof vi.fn>;
  addHoliday: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = ProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

describe('CreateHolidayUseCase', () => {
  let useCase: CreateHolidayUseCase;
  let mockFeriadosRepository: MockFeriadosRepository;
  let mockProfessionalsRepository: MockProfessionalsRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    // Criar mocks
    mockFeriadosRepository = {
      findByProfessionalAndDate: vi.fn(),
      addHoliday: vi.fn(),
      isProfessionalHoliday: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
      findManyByProfessionalId: vi.fn(),
      countByProfessionalId: vi.fn(),
    };

    mockProfessionalsRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByProfessionalId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      count: vi.fn(),
      search: vi.fn(),
      countSearch: vi.fn(),
    };

    useCase = new CreateHolidayUseCase(
      mockFeriadosRepository,
      mockProfessionalsRepository,
    );
  });

  const today = startOfToday();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  it('deve criar um feriado com sucesso', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });
    mockFeriadosRepository.findByProfessionalAndDate.mockResolvedValue(null);

    // Executar
    await useCase.execute({
      professionalId: 'pro-123',
      date: tomorrow,
      motivo: 'Feriado teste',
    });

    // Verificar
    expect(mockFeriadosRepository.addHoliday).toHaveBeenCalledWith(
      'pro-123',
      tomorrow,
      'Feriado teste',
    );
  });

  it('deve lançar erro quando profissional não existe', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        professionalId: 'pro-123',
        date: tomorrow,
        motivo: 'Feriado teste',
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro quando data é no passado', async () => {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });

    await expect(
      useCase.execute({
        professionalId: 'pro-123',
        date: yesterday,
        motivo: 'Feriado teste',
      }),
    ).rejects.toThrow(PastDateError);
  });

  it('deve lançar erro quando motivo é muito curto', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });

    await expect(
      useCase.execute({
        professionalId: 'pro-123',
        date: tomorrow,
        motivo: 'a', // Muito curto
      }),
    ).rejects.toThrow(InvalidHolidayDescriptionError);
  });

  it('deve lançar erro quando motivo é muito longo', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });

    await expect(
      useCase.execute({
        professionalId: 'pro-123',
        date: tomorrow,
        motivo: 'a'.repeat(101), // 101 caracteres (limite é 100)
      }),
    ).rejects.toThrow(InvalidHolidayDescriptionError);
  });

  it('deve lançar erro quando motivo está vazio', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });

    await expect(
      useCase.execute({
        professionalId: 'pro-123',
        date: tomorrow,
        motivo: '', // Vazio
      }),
    ).rejects.toThrow(InvalidHolidayDescriptionError);
  });

  it('deve lançar erro quando já existe feriado na mesma data', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });
    mockFeriadosRepository.findByProfessionalAndDate.mockResolvedValue({
      id: 'feriado-123',
      motivo: 'Feriado existente',
    });

    await expect(
      useCase.execute({
        professionalId: 'pro-123',
        date: tomorrow,
        motivo: 'Novo feriado',
      }),
    ).rejects.toThrow(DuplicateHolidayError);
  });

  it('deve aceitar motivo com tamanho mínimo (3 caracteres)', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });
    mockFeriadosRepository.findByProfessionalAndDate.mockResolvedValue(null);

    await useCase.execute({
      professionalId: 'pro-123',
      date: tomorrow,
      motivo: 'abc', // 3 caracteres (mínimo)
    });

    expect(mockFeriadosRepository.addHoliday).toHaveBeenCalled();
  });

  it('deve aceitar motivo com tamanho máximo (100 caracteres)', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });
    mockFeriadosRepository.findByProfessionalAndDate.mockResolvedValue(null);

    await useCase.execute({
      professionalId: 'pro-123',
      date: tomorrow,
      motivo: 'a'.repeat(100), // 100 caracteres (máximo)
    });

    expect(mockFeriadosRepository.addHoliday).toHaveBeenCalled();
  });
});
