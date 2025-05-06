import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeriadosRepository } from '@/repositories/feriados-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';

import { startOfToday } from 'date-fns';
import { DeleteHolidayUseCase } from './delete-feriado-professional-use-case';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { HolidayNotFoundError } from '../errors/holiday-not-found-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { PastHolidayDeletionError } from '../errors/past-holiday-deletion-error';
import { createMockFeriadosRepository, createMockProfessionalsRepository } from '@/mock/mock-repositories';

// Tipos para os mocks
type MockFeriadosRepository = FeriadosRepository & {
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = ProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

describe('DeleteHolidayUseCase', () => {
  let useCase: DeleteHolidayUseCase;
  let mockFeriadosRepository: MockFeriadosRepository;
  let mockProfessionalsRepository: MockProfessionalsRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    mockFeriadosRepository = createMockFeriadosRepository()
    mockProfessionalsRepository = createMockProfessionalsRepository()

    useCase = new DeleteHolidayUseCase(
      mockFeriadosRepository,
      mockProfessionalsRepository,
    );
  });

  const today = startOfToday();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const mockHoliday = {
    id: 'feriado-123',
    profissionalId: 'pro-123',
    data: tomorrow,
    motivo: 'Feriado teste',
  };

  it('deve deletar um feriado com sucesso', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });
    mockFeriadosRepository.findById.mockResolvedValue(mockHoliday);

    // Executar
    await useCase.execute({
      holidayId: 'feriado-123',
      professionalId: 'pro-123',
    });

    // Verificar
    expect(mockFeriadosRepository.delete).toHaveBeenCalledWith('feriado-123');
  });

  it('deve lançar erro quando profissional não existe', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        holidayId: 'feriado-123',
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro quando feriado não existe', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });
    mockFeriadosRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        holidayId: 'feriado-123',
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(HolidayNotFoundError);
  });

  it('deve lançar erro quando profissional não é o dono do feriado', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });
    mockFeriadosRepository.findById.mockResolvedValue({
      ...mockHoliday,
      profissionalId: 'pro-456', // ID diferente
    });

    await expect(
      useCase.execute({
        holidayId: 'feriado-123',
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(ProfissionalTentandoPegarInformacoesDeOutro);
  });

  it('deve lançar erro quando tentar deletar feriado passado', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });
    mockFeriadosRepository.findById.mockResolvedValue({
      ...mockHoliday,
      data: yesterday, // Data no passado
    });

    await expect(
      useCase.execute({
        holidayId: 'feriado-123',
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(PastHolidayDeletionError);
  });

  it('não deve lançar erro quando data do feriado é hoje', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue({ id: 'pro-123' });
    mockFeriadosRepository.findById.mockResolvedValue({
      ...mockHoliday,
      data: today, // Data é hoje
    });

    await useCase.execute({
      holidayId: 'feriado-123',
      professionalId: 'pro-123',
    });

    expect(mockFeriadosRepository.delete).toHaveBeenCalled();
  });
});
