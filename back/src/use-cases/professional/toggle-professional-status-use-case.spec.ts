import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { ToggleProfessionalStatusUseCase } from './toggle-professional-status-use-case';
import { randomUUID } from 'node:crypto';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

let professionalsRepository: InMemoryProfessionalsRepository;
let sut: ToggleProfessionalStatusUseCase;

describe('ToggleProfessionalStatusUseCase', () => {
  beforeEach(() => {
    professionalsRepository = new InMemoryProfessionalsRepository();
    sut = new ToggleProfessionalStatusUseCase(professionalsRepository);
  });

  it('deve alterar o status de ativo para inativo', async () => {
    const created = await professionalsRepository.create({
      especialidade: 'Dermatologia',
      bio: 'Especialista em pele',
      documento: '12345678900',
      ativo: true,
      avatarUrl: null,
      user: { connect: { id: randomUUID() } },
    });

    const updated = await sut.execute(created.id);

    if (!updated) {
      throw new Error('Updated professional is null');
    }

    expect(updated.ativo).toBe(false);
  });

  it('deve alterar o status de inativo para ativo', async () => {
    const created = await professionalsRepository.create({
      especialidade: 'Dermatologia',
      bio: 'Especialista em pele',
      documento: '12345678900',
      ativo: false,
      avatarUrl: null,
      user: { connect: { id: randomUUID() } },
    });

    const updated = await sut.execute(created.id);

    if (!updated) {
      throw new Error('Updated professional is null');
    }

    expect(updated.ativo).toBe(true);
  });

  it('deve lançar erro se o profissional não existir', async () => {
    await expect(() => sut.execute('non-existing-id')).rejects.toBeInstanceOf(
      ProfessionalNotFoundError,
    );
  });
});
