import { ListUsersResponse } from '@/dtos/user-dto';
import { UsersRepository } from '@/repositories/users-repository';
import { Role } from '@prisma/client';

interface ListUsersUseCaseRequest {
  page?: number;
  limit?: number;
  role?: Role;
  name?: string;
}

export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page = 1,
    limit = 10,
    role,
    name,
  }: ListUsersUseCaseRequest): Promise<ListUsersResponse> {
    const [users, total] = await Promise.all([
      this.usersRepository.listUsers({ page, limit, role, name }),
      this.usersRepository.countUsers({ role, name }),
    ]);

    return {
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
