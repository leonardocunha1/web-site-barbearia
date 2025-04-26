import { FeriadosRepository } from '../feriados-repository';

interface Holiday {
  id: string;
  profissionalId: string;
  data: Date;
  motivo: string;
  createdAt: Date;
}

export class InMemoryFeriadosRepository implements FeriadosRepository {
  public items: Holiday[] = [];

  async isProfessionalHoliday(professionalId: string, date: Date) {
    const holiday = this.items.find(
      (item) =>
        item.profissionalId === professionalId &&
        item.data.getDate() === date.getDate() &&
        item.data.getMonth() === date.getMonth() &&
        item.data.getFullYear() === date.getFullYear(),
    );

    return holiday ? { motivo: holiday.motivo } : null;
  }

  async findByProfessionalAndDate(professionalId: string, date: Date) {
    const holiday = this.items.find(
      (item) =>
        item.profissionalId === professionalId &&
        item.data.getDate() === date.getDate() &&
        item.data.getMonth() === date.getMonth() &&
        item.data.getFullYear() === date.getFullYear(),
    );

    return holiday ? { id: holiday.id, motivo: holiday.motivo } : null;
  }

  async addHoliday(professionalId: string, date: Date, motivo: string) {
    this.items.push({
      id: 'holiday-' + (this.items.length + 1),
      profissionalId: professionalId,
      data: date,
      motivo,
      createdAt: new Date(),
    });
  }

  async findById(id: string) {
    const holiday = this.items.find((item) => item.id === id);
    if (!holiday) return null;

    return {
      id: holiday.id,
      profissionalId: holiday.profissionalId,
      data: holiday.data,
      motivo: holiday.motivo,
    };
  }

  async delete(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
