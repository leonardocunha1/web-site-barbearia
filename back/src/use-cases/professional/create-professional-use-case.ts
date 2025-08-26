import { ProfessionalsRepository } from "@/repositories/professionals-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "../errors/user-not-found-error";
import { UserAlreadyProfessionalError } from "../errors/user-already-professional-error";
import { UserCannotBeProfessionalError } from "../errors/user-cannot-be-professional-error";

interface CreateProfessionalUseCaseRequest {
  email: string;
  especialidade: string;
  bio?: string;
  documento?: string;
  avatarUrl?: string;
}

export class CreateProfessionalUseCase {
  constructor(
    private professionalsRepository: ProfessionalsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute(data: CreateProfessionalUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(data.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.role === "ADMIN") {
      throw new UserCannotBeProfessionalError();
    }

    const existingProfessional =
      await this.professionalsRepository.findByUserId(user.id);

    if (existingProfessional) {
      throw new UserAlreadyProfessionalError();
    }

    await this.usersRepository.update(user.id, { role: "PROFISSIONAL" });

    return this.professionalsRepository.create({
      especialidade: data.especialidade,
      bio: data.bio,
      documento: data.documento,
      ativo: true,
      avatarUrl: data.avatarUrl,
      user: { connect: { id: user.id } },
    });
  }
}
