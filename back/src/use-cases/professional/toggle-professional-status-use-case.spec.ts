import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ToggleProfessionalStatusUseCase } from './toggle-professional-status-use-case';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { createMockProfessionalsRepository } from '@/mock/mock-repositories';
import { makeProfessional } from '@/test/factories';

// Tipo para o mock do repositório
type MockProfessionalsRepository = IProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

describe('ToggleProfessionalStatusUseCase', () => {
  let professionalsRepository: MockProfessionalsRepository;
  let sut: ToggleProfessionalStatusUseCase;

  beforeEach(() => {
    professionalsRepository = createMockProfessionalsRepository();

    sut = new ToggleProfessionalStatusUseCase(professionalsRepository);
  });

  it('deve alternar o status de ativo para falso quando profissional está ativo', async () => {
    // Mock do profissional ativo
    const mockProfessional = makeProfessional({
      id: 'prof-123',
      userId: 'user-123',
      specialty: 'Dentista',
      active: true,
    });

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue({
      ...mockProfessional,
      active: false,
    });

    // Executar
    const result = await sut.execute('prof-123');

    // Verificar
    expect(result).toEqual({
      ...mockProfessional,
      active: false,
    });
    expect(professionalsRepository.findById).toHaveBeenCalledWith('prof-123');
    expect(professionalsRepository.update).toHaveBeenCalledWith('prof-123', {
      active: false,
    });
  });

  it('deve alternar o status de ativo para verdadeiro quando profissional está inativo', async () => {
    // Mock do profissional inativo
    const mockProfessional = makeProfessional({
      id: 'prof-123',
      userId: 'user-123',
      specialty: 'Dentista',
      active: false,
    });

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue({
      ...mockProfessional,
      active: true,
    });

    // Executar
    const result = await sut.execute('prof-123');

    // Verificar
    expect(result).toEqual({
      ...mockProfessional,
      active: true,
    });
    expect(professionalsRepository.update).toHaveBeenCalledWith('prof-123', {
      active: true,
    });
  });

  it('deve lançar erro quando profissional não for encontrado', async () => {
    professionalsRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(sut.execute('prof-inexistente')).rejects.toThrow(ProfessionalNotFoundError);
    expect(professionalsRepository.update).not.toHaveBeenCalled();
  });

  it('deve chamar o repositório com os parâmetros corretos', async () => {
    const mockProfessional = makeProfessional({
      id: 'prof-123',
      userId: 'user-123',
      specialty: 'Dentista',
      active: true,
    });

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue({
      ...mockProfessional,
      active: false,
    });

    await sut.execute('prof-123');

    expect(professionalsRepository.update).toHaveBeenCalledWith(
      'prof-123',
      expect.objectContaining({
        active: false,
      }),
    );
  });
});
