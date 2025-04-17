import { ListUsersResponse, toUserDTO } from '@/dtos/user-dto';
import { UsersRepository } from '@/repositories/users-repository';
import { Role } from '@prisma/client';

interface ListUsersUseCaseRequest {
  page?: number;
  limit?: number;
  role?: Role;
}

export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page = 1,
    limit = 10,
    role,
  }: ListUsersUseCaseRequest): Promise<ListUsersResponse> {
    const [users, total] = await Promise.all([
      this.usersRepository.listUsers(page, limit, role),
      this.usersRepository.countUsers(role),
    ]);

    return {
      users: users.map(toUserDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
