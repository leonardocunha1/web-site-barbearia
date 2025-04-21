import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UpdateUserProfileUseCase } from './update-user-profile-use-case';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { InvalidDataError } from '../errors/invalid-data-error';
import { EmailAlreadyExistsError } from '../errors/user-email-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let sut: UpdateUserProfileUseCase;

describe('Caso de Uso: Atualizar Perfil do Usuário', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateUserProfileUseCase(usersRepository);
  });

  it('deve atualizar o nome do usuário', async () => {
    const createdUser = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
      nome: 'John Updated',
    });

    expect(user.nome).toBe('John Updated');
    expect(user.email).toBe(createdUser.email); // Email não foi alterado
  });

  it('deve atualizar o email do usuário', async () => {
    const createdUser = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
      email: 'new@example.com',
    });

    expect(user.email).toBe('new@example.com');
    expect(user.nome).toBe(createdUser.nome); // Nome não foi alterado
  });

  it('deve atualizar o telefone do usuário', async () => {
    const createdUser = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
      telefone: '11999999999',
    });

    expect(user.telefone).toBe('11999999999');
  });

  it('deve remover o telefone do usuário quando passado null', async () => {
    const createdUser = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
      telefone: '11999999999',
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
      telefone: null,
    });

    expect(user.telefone).toBeNull();
  });

  it('deve lançar erro quando o usuário não for encontrado', async () => {
    await expect(
      sut.execute({ userId: 'id-inexistente', nome: 'Test' }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('deve lançar erro quando o email já estiver em uso por outro usuário', async () => {
    await usersRepository.create({
      nome: 'Existing User',
      email: 'existing@example.com',
      senha: '123456',
    });

    const userToUpdate = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
    });

    await expect(
      sut.execute({
        userId: userToUpdate.id,
        email: 'existing@example.com', // Email já em uso
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });

  it('deve lançar erro quando o email fornecido for o mesmo do usuário', async () => {
    const createdUser = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
    });

    await expect(
      sut.execute({
        userId: createdUser.id,
        email: 'john@example.com', // Mesmo email atual
      }),
    ).rejects.toBeInstanceOf(InvalidDataError);
  });

  it('deve retornar o usuário sem a senha', async () => {
    const createdUser = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
      nome: 'Updated Name',
    });

    expect(user).not.toHaveProperty('senha');
  });

  it('deve atualizar múltiplos campos simultaneamente', async () => {
    const createdUser = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
      nome: 'John Updated',
      email: 'new@example.com',
      telefone: '11999999999',
    });

    expect(user.nome).toBe('John Updated');
    expect(user.email).toBe('new@example.com');
    expect(user.telefone).toBe('11999999999');
  });

  it('deve atualizar a data de atualização', async () => {
    const createdUser = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
      updatedAt: new Date('2023-01-01'),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
      nome: 'Updated Name',
    });

    expect(user.updatedAt).not.toEqual(createdUser.updatedAt);
    expect(user.updatedAt.getTime()).toBeGreaterThan(
      createdUser.updatedAt.getTime(),
    );
  });
});
