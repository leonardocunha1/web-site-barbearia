import { BookingWithRelations } from '@/repositories/bookings-repository';

export type BookingDTO = {
  id: string;
  usuarioId: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: string;
  observacoes?: string;
  valorFinal?: number;
  createdAt: string;
  profissional: {
    id: string;
    nome: string;
    email: string;
  };
  user: {
    id: string;
    nome: string;
    email: string;
  };
  items: {
    id: string;
    preco: number;
    duracao: number;
    serviceProfessional: {
      id: string;
      service: {
        id: string;
        nome: string;
      };
    };
  }[];
};

export function toBookingDTO(booking: BookingWithRelations): BookingDTO {
  return {
    id: booking.id,
    usuarioId: booking.usuarioId,
    dataHoraInicio: booking.dataHoraInicio.toISOString(),
    dataHoraFim: booking.dataHoraFim.toISOString(),
    status: booking.status,
    observacoes: booking.observacoes ?? undefined,
    valorFinal: booking.valorFinal ?? undefined,
    createdAt: booking.createdAt.toISOString(),
    profissional: {
      id: booking.profissional.id,
      nome: booking.profissional.user.nome,
      email: booking.profissional.user.email,
    },
    user: {
      id: booking.user.id,
      nome: booking.user.nome,
      email: booking.user.email,
    },
    items: booking.items.map((item) => ({
      id: item.id,
      preco: item.preco,
      duracao: item.duracao,
      serviceProfessional: {
        id: item.serviceProfessionalId,
        service: {
          id: item.serviceProfessional.service.id,
          nome: item.serviceProfessional.service.nome,
        },
      },
    })),
  };
}
