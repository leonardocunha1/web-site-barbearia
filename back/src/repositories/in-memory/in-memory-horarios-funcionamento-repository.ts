import {
  BusinessHours,
  HorariosFuncionamentoRepository,
} from '../horarios-funcionamento-repository';

export class InMemoryHorariosFuncionamentoRepository
  implements HorariosFuncionamentoRepository
{
  public items: BusinessHours[] = [];

  async findByProfessionalAndDay(
    professionalId: string,
    dayOfWeek: number,
  ): Promise<BusinessHours | null> {
    return (
      this.items.find(
        (item) =>
          item.profissionalId === professionalId &&
          item.diaSemana === dayOfWeek,
      ) || null
    );
  }

  async create(data: {
    profissional: { connect: { id: string } };
    diaSemana: number;
    abreAs: string;
    fechaAs: string;
    pausaInicio?: string | null;
    pausaFim?: string | null;
    ativo?: boolean;
  }): Promise<BusinessHours> {
    const newBusinessHours: BusinessHours = {
      id: `business-hours-${this.items.length + 1}`,
      profissionalId: data.profissional.connect.id,
      diaSemana: data.diaSemana,
      abreAs: data.abreAs,
      fechaAs: data.fechaAs,
      pausaInicio: data.pausaInicio || null,
      pausaFim: data.pausaFim || null,
      ativo: data.ativo ?? true,
    };

    this.items.push(newBusinessHours);
    return newBusinessHours;
  }

  async update(
    id: string,
    data: {
      abreAs: string;
      fechaAs: string;
      pausaInicio: string | null;
      pausaFim: string | null;
    },
  ): Promise<BusinessHours> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Horário não encontrado');
    }

    this.items[index] = {
      ...this.items[index],
      abreAs: data.abreAs,
      fechaAs: data.fechaAs,
      pausaInicio: data.pausaInicio,
      pausaFim: data.pausaFim,
    };

    return this.items[index];
  }

  async listByProfessional(professionalId: string) {
    return this.items
      .filter(
        (item) => item.profissionalId === professionalId && item.ativo === true,
      )
      .sort((a, b) => a.diaSemana - b.diaSemana);
  }
}
