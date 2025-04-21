import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { CreateProfessionalUseCase } from './create-professional-use-case';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserAlreadyProfessionalError } from '../errors/user-already-professional-error';

let usersRepository: InMemoryUsersRepository;
let professionalsRepository: InMemoryProfessionalsRepository;
let sut: CreateProfessionalUseCase; // system under test

describe('CreateProfessionalUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    professionalsRepository = new InMemoryProfessionalsRepository();
    sut = new CreateProfessionalUseCase(
      professionalsRepository,
      usersRepository,
    );
  });

  it('deve criar um profissional com sucesso', async () => {
    const user = await usersRepository.create({
      nome: 'João Silva',
      email: 'joao@example.com',
      senha: 'senha123',
    });

    const result = await sut.execute({
      userId: user.id,
      especialidade: 'Psicologia',
      bio: 'Experiente em psicologia clínica.',
      documento: '123.456.789-00',
      registro: 'CRP-0001',
    });

    expect(result).toHaveProperty('id');
    expect(result.userId).toBe(user.id);

    const updatedUser = await usersRepository.findById(user.id);
    expect(updatedUser?.role).toBe('PROFISSIONAL');
  });

  it('deve lançar erro se o usuário não existir', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-invalido',
        especialidade: 'Psicologia',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('deve lançar erro se o usuário já for um profissional', async () => {
    const user = await usersRepository.create({
      nome: 'Maria',
      email: 'maria@example.com',
      senha: 'senha456',
    });

    await professionalsRepository.create({
      especialidade: 'Fisioterapia',
      user: { connect: { id: user.id } },
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        especialidade: 'Nutrição',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyProfessionalError);
  });
});
