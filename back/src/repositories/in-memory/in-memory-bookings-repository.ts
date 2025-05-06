// Implementação do repositório de agendamentos em memória

import { randomUUID } from 'node:crypto';
import { BookingDTO } from '@/dtos/booking-dto'; // Assumindo que este DTO existe e está acessível
import {
  BookingsRepository,
  FindManyByProfessionalIdParams,
  FindManyByUserIdParams,
} from '../bookings-repository'; // Ajuste o caminho conforme necessário
import { Prisma, Status } from '@prisma/client'; // Usando tipos Prisma para compatibilidade
import { setHours, setMinutes } from 'date-fns'; // Para manipulação de datas

// Helper para simular a estrutura aninhada do BookingDTO que o Prisma retorna
// Adaptar conforme a definição real do BookingDTO
function createBookingDTO(booking: Prisma.BookingCreateInput): BookingDTO {
  // Esta função precisa simular a estrutura retornada pelo Prisma,
  // incluindo os campos aninhados (items, profissional, user).
  // Por simplicidade, vamos retornar uma estrutura básica aqui,
  // mas em um cenário real, isso precisaria buscar ou simular os dados relacionados.
  const now = new Date();
  return {
    id: randomUUID(),
    usuarioId: booking.user?.connect?.id ?? '',
    profissionalId: booking.profissional?.connect?.id ?? '',
    dataHoraInicio: new Date(booking.dataHoraInicio),
    dataHoraFim: new Date(booking.dataHoraFim),
    status: booking.status ?? Status.PENDENTE,
    observacoes: booking.observacoes ?? null,
    valorFinal: booking.valorFinal ?? null,
    createdAt: now,
    updatedAt: now,
    canceledAt: null,
    confirmedAt: null,
    items: [], // Simular items - precisaria de lógica adicional
    profissional: {
      // Simular profissional - precisaria de lógica adicional
      id: booking.profissional?.connect?.id ?? '',
      user: { id: '', nome: 'Profissional Mock' }, // Simular user do profissional
    },
    user: {
      // Simular user - precisaria de lógica adicional
      id: booking.user?.connect?.id ?? '',
      nome: 'Cliente Mock',
    },
    // Adicionar outros campos conforme a definição de BookingDTO
  };
}

export class InMemoryBookingsRepository implements BookingsRepository {
  public items: BookingDTO[] = [];

  async create(data: Prisma.BookingCreateInput): Promise<void> {
    const bookingDTO = createBookingDTO(data);
    this.items.push(bookingDTO);
  }

  async findById(id: string): Promise<BookingDTO | null> {
    const booking = this.items.find((item) => item.id === id);
    return booking ?? null;
  }

  async findOverlappingBooking(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<BookingDTO | null> {
    const overlappingBooking = this.items.find((booking) => {
      return (
        booking.profissionalId === professionalId &&
        booking.status !== Status.CANCELADO &&
        booking.canceledAt === null &&
        new Date(booking.dataHoraInicio) < end &&
        new Date(booking.dataHoraFim) > start
      );
    });

    return overlappingBooking ?? null;
  }

  // Métodos de contagem e busca (implementações simplificadas iniciais)
  async countByProfessionalId(
    professionalId: string,
    filters?: { status?: Status; startDate?: Date; endDate?: Date },
  ): Promise<number> {
    return this.items.filter((booking) => {
      let match = booking.profissionalId === professionalId;
      if (filters?.status) {
        match = match && booking.status === filters.status;
      }
      if (filters?.startDate) {
        match = match && new Date(booking.dataHoraInicio) >= filters.startDate;
      }
      if (filters?.endDate) {
        // Ajuste: Prisma lte significa <=, então comparamos com o fim do dia
        const endOfDay = new Date(filters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        match = match && new Date(booking.dataHoraFim) <= endOfDay;
      }
      return match;
    }).length;
  }

  async findManyByProfessionalId(
    professionalId: string,
    { page, limit, sort = [], filters = {} }: FindManyByProfessionalIdParams,
  ): Promise<BookingDTO[]> {
    const filteredItems = this.items.filter((booking) => {
      let match = booking.profissionalId === professionalId;
      if (filters.status) {
        match = match && booking.status === filters.status;
      }
      if (filters.startDate) {
        match = match && new Date(booking.dataHoraInicio) >= filters.startDate;
      }
      if (filters.endDate) {
        const endOfDay = new Date(filters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        match = match && new Date(booking.dataHoraFim) <= endOfDay;
      }
      return match;
    });

    // Aplicar ordenação
    if (sort.length > 0) {
      filteredItems.sort((a, b) => {
        for (const s of sort) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let valA: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let valB: any;

          if (s.field === 'profissional') {
            // Simulação - buscar nome real se necessário
            valA = a.profissional.user.nome;
            valB = b.profissional.user.nome;
          } else {
            valA = a[s.field as keyof BookingDTO];
            valB = b[s.field as keyof BookingDTO];
          }

          // Lógica de comparação
          if (valA < valB) return s.order === 'asc' ? -1 : 1;
          if (valA > valB) return s.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Aplicar paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredItems.slice(startIndex, endIndex);
  }

  async countByUserId(
    userId: string,
    filters?: { status?: Status; startDate?: Date; endDate?: Date },
  ): Promise<number> {
    return this.items.filter((booking) => {
      let match = booking.usuarioId === userId;
      if (filters?.status) {
        match = match && booking.status === filters.status;
      }
      if (filters?.startDate) {
        match = match && new Date(booking.dataHoraInicio) >= filters.startDate;
      }
      if (filters?.endDate) {
        const endOfDay = new Date(filters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        match = match && new Date(booking.dataHoraFim) <= endOfDay;
      }
      return match;
    }).length;
  }

  async findManyByUserId(
    userId: string,
    { page, limit, sort = [], filters = {} }: FindManyByUserIdParams,
  ): Promise<BookingDTO[]> {
    const filteredItems = this.items.filter((booking) => {
      let match = booking.usuarioId === userId;
      if (filters.status) {
        match = match && booking.status === filters.status;
      }
      if (filters.startDate) {
        match = match && new Date(booking.dataHoraInicio) >= filters.startDate;
      }
      if (filters.endDate) {
        const endOfDay = new Date(filters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        match = match && new Date(booking.dataHoraFim) <= endOfDay;
      }
      return match;
    });

    // Aplicar ordenação (similar a findManyByProfessionalId)
    if (sort.length > 0) {
      filteredItems.sort((a, b) => {
        for (const s of sort) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let valA: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let valB: any;

          if (s.field === 'profissional') {
            valA = a.profissional.user.nome;
            valB = b.profissional.user.nome;
          } else {
            valA = a[s.field as keyof BookingDTO];
            valB = b[s.field as keyof BookingDTO];
          }

          if (valA < valB) return s.order === 'asc' ? -1 : 1;
          if (valA > valB) return s.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Aplicar paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredItems.slice(startIndex, endIndex);
  }

  async update(
    id: string,
    data: Prisma.BookingUpdateInput,
  ): Promise<BookingDTO> {
    const bookingIndex = this.items.findIndex((item) => item.id === id);
    if (bookingIndex === -1) {
      throw new Error('Booking not found'); // Ou outra forma de erro
    }

    const existingBooking = this.items[bookingIndex];

    // Aplica atualizações - simplificado
    const updatedBooking: BookingDTO = {
      ...existingBooking,
      ...(data.dataHoraInicio && {
        dataHoraInicio: new Date(data.dataHoraInicio as string),
      }),
      ...(data.dataHoraFim && {
        dataHoraFim: new Date(data.dataHoraFim as string),
      }),
      ...(data.status && { status: data.status as Status }),
      ...(data.observacoes && { observacoes: data.observacoes as string }),
      ...(data.valorFinal && { valorFinal: data.valorFinal as number }),
      ...(data.canceledAt && {
        canceledAt: new Date(data.canceledAt as string),
      }),
      ...(data.confirmedAt && {
        confirmedAt: new Date(data.confirmedAt as string),
      }),
      updatedAt: new Date(),
      // Atualizar outros campos se necessário
    };

    this.items[bookingIndex] = updatedBooking;
    return updatedBooking;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  async countActiveByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ): Promise<number> {
    // Esta implementação é simplificada. Precisaria iterar sobre booking.items
    // e verificar se algum item.serviceProfessional.service.id === serviceId.
    // A estrutura simulada de items em createBookingDTO está vazia.
    console.warn(
      'countActiveByServiceAndProfessional: Implementação simplificada.',
    );
    return this.items.filter(
      (booking) =>
        booking.profissionalId === professionalId &&
        booking.status !== Status.CANCELADO &&
        new Date(booking.dataHoraFim) > new Date() &&
        booking.items.some(
          (item) => item.serviceProfessional?.service?.id === serviceId,
        ), // Assumindo estrutura completa
    ).length;
  }

  async countByProfessionalAndDate(
    professionalId: string,
    start: Date,
    end: Date,
    status?: Status,
  ): Promise<number> {
    return this.items.filter((booking) => {
      let match =
        booking.profissionalId === professionalId &&
        new Date(booking.dataHoraInicio) >= start &&
        new Date(booking.dataHoraInicio) <= end; // Prisma compara gte e lte
      if (status) {
        match = match && booking.status === status;
      }
      return match;
    }).length;
  }

  async getEarningsByProfessionalAndDate(
    professionalId: string,
    start: Date,
    end: Date,
    status?: Status,
  ): Promise<number> {
    return this.items
      .filter((booking) => {
        let match =
          booking.profissionalId === professionalId &&
          new Date(booking.dataHoraInicio) >= start &&
          new Date(booking.dataHoraInicio) <= end;
        if (status) {
          match = match && booking.status === status;
        }
        return match;
      })
      .reduce((sum, booking) => sum + (booking.valorFinal ?? 0), 0);
  }

  async countByProfessionalAndStatus(
    professionalId: string,
    status: Status,
    start?: Date,
    end?: Date,
  ): Promise<number> {
    return this.items.filter((booking) => {
      let match =
        booking.profissionalId === professionalId && booking.status === status;
      if (start && end) {
        match =
          match &&
          new Date(booking.dataHoraInicio) >= start &&
          new Date(booking.dataHoraInicio) <= end;
      }
      return match;
    }).length;
  }

  async findNextAppointments(
    professionalId: string,
    limit: number,
    filters?: { startDate?: Date; endDate?: Date },
  ): Promise<BookingDTO[]> {
    const now = new Date();
    const startDate = filters?.startDate || now;

    const filteredItems = this.items.filter((booking) => {
      let match =
        booking.profissionalId === professionalId &&
        new Date(booking.dataHoraInicio) >= startDate &&
        (booking.status === Status.PENDENTE ||
          booking.status === Status.CONFIRMADO) &&
        booking.canceledAt === null;
      if (filters?.endDate) {
        match = match && new Date(booking.dataHoraInicio) <= filters.endDate;
      }
      return match;
    });

    // Ordenar por data de início ascendente
    filteredItems.sort(
      (a, b) =>
        new Date(a.dataHoraInicio).getTime() -
        new Date(b.dataHoraInicio).getTime(),
    );

    return filteredItems.slice(0, limit);
  }

  async findByProfessionalAndDate(
    professionalId: string,
    date: Date,
  ): Promise<BookingDTO[]> {
    const startOfDay = setHours(setMinutes(new Date(date), 0), 0);
    startOfDay.setSeconds(0, 0);
    const endOfDay = setHours(setMinutes(new Date(date), 59), 23);
    endOfDay.setSeconds(59, 999);

    const filteredItems = this.items.filter((booking) => {
      const bookingStart = new Date(booking.dataHoraInicio);
      return (
        booking.profissionalId === professionalId &&
        bookingStart >= startOfDay &&
        bookingStart <= endOfDay &&
        booking.status !== Status.CANCELADO &&
        booking.canceledAt === null
      );
    });

    // Ordenar por data de início ascendente
    filteredItems.sort(
      (a, b) =>
        new Date(a.dataHoraInicio).getTime() -
        new Date(b.dataHoraInicio).getTime(),
    );

    return filteredItems;
  }
}
