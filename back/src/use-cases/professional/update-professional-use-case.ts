import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidUpdateError } from '../errors/invalid-update-error';

interface UpdateProfessionalUseCaseRequest {
  id: string;
  especialidade?: string;
  bio?: string | null;
  documento?: string | null;
  registro?: string | null;
  ativo?: boolean;
  intervalosAgendamento?: number;
  avatarUrl?: string | null;
}

export class UpdateProfessionalUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute(data: UpdateProfessionalUseCaseRequest) {
    const professional = await this.professionalsRepository.findById(data.id);

    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    if (
      data.intervalosAgendamento &&
      (data.intervalosAgendamento < 15 || data.intervalosAgendamento > 120)
    ) {
      throw new InvalidUpdateError(
        'Intervalo de agendamento deve estar entre 15 e 120 minutos',
      );
    }

    return this.professionalsRepository.update(data.id, {
      especialidade: data.especialidade,
      bio: data.bio,
      documento: data.documento,
      registro: data.registro,
      ativo: data.ativo,
      intervalosAgendamento: data.intervalosAgendamento,
      updatedAt: new Date(),
      avatarUrl: data.avatarUrl,
    });
  }
}
