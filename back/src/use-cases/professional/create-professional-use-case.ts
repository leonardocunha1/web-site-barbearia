import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserAlreadyProfessionalError } from '../errors/user-already-professional-error';

interface CreateProfessionalUseCaseRequest {
  userId: string;
  especialidade: string;
  bio?: string;
  documento?: string;
  registro?: string;
  avatarUrl?: string;
}

export class CreateProfessionalUseCase {
  constructor(
    private professionalsRepository: ProfessionalsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(data: CreateProfessionalUseCaseRequest) {
    const user = await this.usersRepository.findById(data.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const existingProfessional =
      await this.professionalsRepository.findByUserId(data.userId);
    if (existingProfessional) {
      throw new UserAlreadyProfessionalError();
    }

    await this.usersRepository.update(data.userId, { role: 'PROFISSIONAL' });

    return this.professionalsRepository.create({
      especialidade: data.especialidade,
      bio: data.bio,
      documento: data.documento,
      ativo: true,
      avatarUrl: data.avatarUrl,
      user: { connect: { id: data.userId } },
    });
  }
}
