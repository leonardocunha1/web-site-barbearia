import { Booking } from '@prisma/client';

export type BookingDTO = Booking & {
  user: {
    id: string;
    nome: string;
  };
  items: {
    id: string;
    duracao: number;
    preco: number;
    serviceProfessional: {
      id: string;
      service: {
        id: string;
        nome: string;
      };
    };
  }[];
  profissional: {
    id: string;
    user: {
      id: string;
      nome: string;
    };
  };
};

export function toBookingDTO(booking: BookingDTO): BookingDTO {
  return {
    id: booking.id,
    dataHoraInicio: booking.dataHoraInicio,
    dataHoraFim: booking.dataHoraFim,
    status: booking.status,
    canceledAt: booking.canceledAt,
    confirmedAt: booking.confirmedAt,
    profissionalId: booking.profissionalId,
    updatedAt: booking.updatedAt,
    usuarioId: booking.usuarioId,
    observacoes: booking.observacoes ?? null,
    valorFinal: booking.valorFinal ?? null,
    createdAt: booking.createdAt,
    profissional: {
      id: booking.profissional.id,
      user: {
        id: booking.profissional.user.id,
        nome: booking.profissional.user.nome,
      },
    },
    user: {
      id: booking.user.id,
      nome: booking.user.nome,
    },
    items: booking.items.map((item) => ({
      id: item.id,
      preco: item.preco,
      duracao: item.duracao,
      serviceProfessional: {
        id: item.serviceProfessional.id,
        service: {
          id: item.serviceProfessional.service.id,
          nome: item.serviceProfessional.service.nome,
        },
      },
    })),
  };
}
