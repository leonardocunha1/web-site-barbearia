import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { randomUUID } from 'node:crypto';
import { UpdateProfessionalUseCase } from './update-professional-use-case';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

let professionalsRepository: InMemoryProfessionalsRepository;
let sut: UpdateProfessionalUseCase;

describe('UpdateProfessionalUseCase', () => {
  beforeEach(() => {
    professionalsRepository = new InMemoryProfessionalsRepository();
    sut = new UpdateProfessionalUseCase(professionalsRepository);
  });

  it('deve atualizar um profissional com sucesso', async () => {
    const created = await professionalsRepository.create({
      especialidade: 'Dermatologia',
      bio: 'Especialista em pele',
      documento: '12345678900',
      ativo: true,
      avatarUrl: null,
      user: { connect: { id: randomUUID() } },
    });

    const updated = await sut.execute({
      id: created.id,
      especialidade: 'Cardiologia',
      bio: 'Atualizado para cardiologista',
      avatarUrl: 'https://imagem.com/foto.jpg',
    });

    expect(updated?.especialidade).toBe('Cardiologia');
    expect(updated?.bio).toBe('Atualizado para cardiologista');
    expect(updated?.avatarUrl).toBe('https://imagem.com/foto.jpg');
  });

  it('deve lançar erro se o profissional não existir', async () => {
    await expect(() =>
      sut.execute({
        id: 'non-existing-id',
        bio: 'Novo bio',
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundError);
  });
});
