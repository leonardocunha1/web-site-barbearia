import { ListUsersResponse } from '@/dtos/user-dto';
import { IUsersRepository } from '@/repositories/users-repository';
import { validatePagination } from '@/utils/validate-pagination';
import { Role } from '@prisma/client';

interface ListUsersUseCaseRequest {
  page?: number;
  limit?: number;
  role?: Role;
  name?: string;
}

export class ListUsersUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    page = 1,
    limit = 10,
    role,
    name,
  }: ListUsersUseCaseRequest): Promise<ListUsersResponse> {
    validatePagination(page, limit);

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

