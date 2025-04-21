import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile-use-case';
import { UserNotFoundError } from '../errors/user-not-found-error';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Caso de Uso: Obter Perfil do Usuário', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('deve retornar o perfil de um usuário existente', async () => {
    // Cria um usuário de teste
    const createdUser = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
      role: 'CLIENTE',
      telefone: '11999999999',
    });

    // Executa o caso de uso
    const { user } = await sut.execute({ userId: createdUser.id });

    // Verificações
    expect(user.id).toBe(createdUser.id);
    expect(user.nome).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.role).toBe('CLIENTE');
    expect(user.telefone).toBe('11999999999');
  });

  it('não deve retornar a senha do usuário', async () => {
    const createdUser = await usersRepository.create({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: '123456',
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    // Verifica que a senha não está no objeto retornado
    expect(user).not.toHaveProperty('senha');
  });

  it('deve lançar erro quando o usuário não for encontrado', async () => {
    await expect(
      sut.execute({ userId: 'id-inexistente' }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('deve retornar todos os campos do usuário', async () => {
    const createdUser = await usersRepository.create({
      nome: 'Complete User',
      email: 'complete@example.com',
      senha: '123456',
      role: 'ADMIN',
      telefone: '11999999999',
      emailVerified: true,
      active: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user).toEqual({
      id: createdUser.id,
      nome: 'Complete User',
      email: 'complete@example.com',
      role: 'ADMIN',
      telefone: '11999999999',
      emailVerified: expect.any(Boolean),
      active: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('deve diferenciar usuários pelo ID', async () => {
    const user1 = await usersRepository.create({
      nome: 'User 1',
      email: 'user1@example.com',
      senha: '123456',
    });

    const user2 = await usersRepository.create({
      nome: 'User 2',
      email: 'user2@example.com',
      senha: '123456',
    });

    const result1 = await sut.execute({ userId: user1.id });
    const result2 = await sut.execute({ userId: user2.id });

    expect(result1.user.id).toBe(user1.id);
    expect(result2.user.id).toBe(user2.id);
    expect(result1.user.email).not.toBe(result2.user.email);
  });

  it('deve lidar com campos opcionais não preenchidos', async () => {
    const minimalUser = await usersRepository.create({
      nome: 'Minimal',
      email: 'minimal@example.com',
      senha: '123456',
    });

    const { user } = await sut.execute({ userId: minimalUser.id });

    expect(user.telefone).toBeNull();
    expect(user.emailVerified).toBeFalsy();
  });
});
