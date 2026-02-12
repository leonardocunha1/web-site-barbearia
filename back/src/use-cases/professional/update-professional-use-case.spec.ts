import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UpdateProfessionalUseCase } from './update-professional-use-case';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { createMockProfessionalsRepository } from '@/mock/mock-repositories';

// Tipo para o mock do repositório
type MockProfessionalsRepository = IProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

describe('UpdateProfessionalUseCase', () => {
  let professionalsRepository: MockProfessionalsRepository;
  let sut: UpdateProfessionalUseCase;

  beforeEach(() => {
    professionalsRepository = createMockProfessionalsRepository();

    sut = new UpdateProfessionalUseCase(professionalsRepository);
  });

  it('deve atualizar um profissional com todos os campos', async () => {
    // Mock do profissional existente
    const mockProfessional = {
      id: 'prof-123',
      userId: 'user-123',
      especialidade: 'Dentista',
      bio: 'Bio antiga',
      documento: '12345',
      ativo: true,
      avatarUrl: 'old-avatar.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock da atualização
    const updatedProfessional = {
      ...mockProfessional,
      especialidade: 'Ortodontista',
      bio: 'Nova bio',
      documento: '54321',
      ativo: false,
      avatarUrl: 'new-avatar.jpg',
      updatedAt: new Date(),
    };

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue(updatedProfessional);

    // Dados para atualização
    const updateData = {
      id: 'prof-123',
      especialidade: 'Ortodontista',
      bio: 'Nova bio',
      documento: '54321',
      ativo: false,
      avatarUrl: 'new-avatar.jpg',
    };

    // Executar
    const result = await sut.execute(updateData);

    // Verificar
    expect(result).toEqual(updatedProfessional);
    expect(professionalsRepository.findById).toHaveBeenCalledWith('prof-123');
    expect(professionalsRepository.update).toHaveBeenCalledWith('prof-123', {
      especialidade: 'Ortodontista',
      bio: 'Nova bio',
      documento: '54321',
      ativo: false,
      avatarUrl: 'new-avatar.jpg',
      updatedAt: expect.any(Date),
    });
  });

  it('deve atualizar apenas campos específicos quando outros são undefined', async () => {
    const mockProfessional = {
      id: 'prof-123',
      userId: 'user-123',
      especialidade: 'Dentista',
      bio: 'Bio antiga',
      documento: '12345',
      ativo: true,
      avatarUrl: 'old-avatar.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue({
      ...mockProfessional,
      especialidade: 'Ortodontista',
      updatedAt: new Date(),
    });

    const result = await sut.execute({
      id: 'prof-123',
      especialidade: 'Ortodontista',
    });

    expect(result?.specialty).toBe('Ortodontista');
    expect(result?.bio).toBe('Bio antiga'); // Deve manter o valor antigo
    expect(professionalsRepository.update).toHaveBeenCalledWith('prof-123', {
      especialidade: 'Ortodontista',
      updatedAt: expect.any(Date),
    });
  });

  it('deve permitir definir campos como null', async () => {
    const mockProfessional = {
      id: 'prof-123',
      userId: 'user-123',
      especialidade: 'Dentista',
      bio: 'Bio antiga',
      documento: '12345',
      ativo: true,
      avatarUrl: 'old-avatar.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue({
      ...mockProfessional,
      bio: null,
      documento: null,
      updatedAt: new Date(),
    });

    const result = await sut.execute({
      id: 'prof-123',
      bio: null,
      documento: null,
    });

    expect(result?.bio).toBeNull();
    expect(result?.document).toBeNull();
  });

  it('deve lançar erro quando profissional não for encontrado', async () => {
    professionalsRepository.findById.mockResolvedValue(null);

    await expect(
      sut.execute({
        id: 'prof-inexistente',
        especialidade: 'Dentista',
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);

    expect(professionalsRepository.update).not.toHaveBeenCalled();
  });

  it('deve atualizar a data de atualização mesmo quando outros campos não mudam', async () => {
    const mockProfessional = {
      id: 'prof-123',
      userId: 'user-123',
      especialidade: 'Dentista',
      bio: 'Bio existente',
      createdAt: new Date(),
      updatedAt: new Date('2023-01-01'),
    };

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockImplementation(async (id, data) => ({
      ...mockProfessional,
      ...date,
    }));

    const oldUpdatedAt = mockProfessional.updatedAt;
    const result = await sut.execute({
      id: 'prof-123',
      bio: 'Bio existente', // Mesmo valor
    });

    expect(result?.updatedAt).not.toEqual(oldUpdatedAt);
    expect(result?.updatedAt).toEqual(expect.any(Date));
  });
});

