import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ToggleProfessionalStatusUseCase } from './toggle-professional-status-use-case';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

// Tipo para o mock do repositório
type MockProfessionalsRepository = ProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

describe('ToggleProfessionalStatusUseCase', () => {
  let professionalsRepository: MockProfessionalsRepository;
  let sut: ToggleProfessionalStatusUseCase;

  beforeEach(() => {
    // Criar mock do repositório
    professionalsRepository = {
      findById: vi.fn(),
      update: vi.fn(),
      findByUserId: vi.fn(),
      findByProfessionalId: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      count: vi.fn(),
      search: vi.fn(),
      countSearch: vi.fn(),
    };

    sut = new ToggleProfessionalStatusUseCase(professionalsRepository);
  });

  it('deve alternar o status de ativo para falso quando profissional está ativo', async () => {
    // Mock do profissional ativo
    const mockProfessional = {
      id: 'prof-123',
      userId: 'user-123',
      especialidade: 'Dentista',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue({
      ...mockProfessional,
      ativo: false,
    });

    // Executar
    const result = await sut.execute('prof-123');

    // Verificar
    expect(result).toEqual({
      ...mockProfessional,
      ativo: false,
    });
    expect(professionalsRepository.findById).toHaveBeenCalledWith('prof-123');
    expect(professionalsRepository.update).toHaveBeenCalledWith('prof-123', {
      ativo: false,
    });
  });

  it('deve alternar o status de ativo para verdadeiro quando profissional está inativo', async () => {
    // Mock do profissional inativo
    const mockProfessional = {
      id: 'prof-123',
      userId: 'user-123',
      especialidade: 'Dentista',
      ativo: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue({
      ...mockProfessional,
      ativo: true,
    });

    // Executar
    const result = await sut.execute('prof-123');

    // Verificar
    expect(result).toEqual({
      ...mockProfessional,
      ativo: true,
    });
    expect(professionalsRepository.update).toHaveBeenCalledWith('prof-123', {
      ativo: true,
    });
  });

  it('deve lançar erro quando profissional não for encontrado', async () => {
    professionalsRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(sut.execute('prof-inexistente')).rejects.toThrow(
      ProfessionalNotFoundError,
    );
    expect(professionalsRepository.update).not.toHaveBeenCalled();
  });

  it('deve chamar o repositório com os parâmetros corretos', async () => {
    const mockProfessional = {
      id: 'prof-123',
      userId: 'user-123',
      especialidade: 'Dentista',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue({
      ...mockProfessional,
      ativo: false,
    });

    await sut.execute('prof-123');

    expect(professionalsRepository.update).toHaveBeenCalledWith(
      'prof-123',
      expect.objectContaining({
        ativo: false,
      }),
    );
  });
});
