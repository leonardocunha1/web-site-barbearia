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
    pontosUtilizados: booking.pontosUtilizados ?? null,
    couponId: booking.couponId ?? null,
    couponDiscount: booking.couponDiscount ?? null,
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

export const mockBooking: BookingDTO = {
  id: 'booking-123',
  usuarioId: 'user-123',
  profissionalId: 'pro-123',
  canceledAt: null,
  confirmedAt: null,
  createdAt: new Date('2023-01-01T09:00:00'),
  updatedAt: new Date('2023-01-01T09:00:00'),
  dataHoraInicio: new Date('2023-01-01T10:00:00'),
  dataHoraFim: new Date('2023-01-01T11:00:00'),
  observacoes: 'Test booking',
  status: 'CONFIRMADO',
  valorFinal: 100,
  pontosUtilizados: 0,
  couponId: null,
  couponDiscount: null,
  user: {
    id: 'user-123',
    nome: 'John Doe',
  },
  profissional: {
    id: 'pro-123',
    user: {
      id: 'pro-user-123',
      nome: 'Professional User',
    },
  },
  items: [
    {
      id: 'item-123',
      serviceProfessional: {
        id: 'sp-123',
        service: {
          id: 'service-123',
          nome: 'Service Name',
        },
      },
      preco: 100,
      duracao: 60,
    },
  ],
};
