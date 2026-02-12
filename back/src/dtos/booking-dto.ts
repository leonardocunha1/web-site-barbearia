import { Booking } from '@prisma/client';

export type BookingDTO = Booking & {
  user: {
    id: string; name: string;
  };
  items: {
    id: string; duration: number; price: number;
    serviceProfessional: {
      id: string;
      service: {
        id: string; name: string;
      };
    };
  }[]; professional: {
    id: string;
    user: {
      id: string; name: string;
    };
  };
};

/**
 * Converts Booking entity to safe DTO
 * Includes only public user fields (id, nome) for user and professional
 * Excludes sensitive information like passwords, email, etc.
 * 
 * @param booking - Booking entity with relations from database
 * @returns Safe booking DTO without sensitive data
 * 
 * @example
 * ```typescript
 * const booking = await bookingsRepository.findById(id);
 * return reply.send({ booking: toBookingDTO(booking) });
 * ```
 */
export function toBookingDTO(booking: BookingDTO): BookingDTO {
  return {
    id: booking.id,
    startDateTime: booking.dateHoraInicio,
    endDateTime: booking.endDateTime,
    status: booking.status,
    canceledAt: booking.canceledAt,
    confirmedAt: booking.confirmedAt,
    professionalId: booking.professionalId,
    updatedAt: booking.updatedAt,
    userId: booking.userId,
    notes: booking.notes ?? null,
    totalAmount: booking.totalAmount ?? null,
    pointsUsed: booking.pointsUsed ?? null,
    couponId: booking.couponId ?? null,
    couponDiscount: booking.couponDiscount ?? null,
    createdAt: booking.createdAt, professional: {
      id: booking.profissional.id,
      user: {
        id: booking.profissional.user.id, name: booking.profissional.user.name,
      },
    },
    user: {
      id: booking.user.id, name: booking.user.name,
    },
    items: booking.items.map((item) => ({
      id: item.id, price: item.price, duration: item.duration,
      serviceProfessional: {
        id: item.serviceProfessional.id,
        service: {
          id: item.serviceProfessional.service.id, name: item.serviceProfessional.service.name,
        },
      },
    })),
  };
}

export const mockBooking: BookingDTO = {
  id: 'booking-123',
  userId: 'user-123',
  professionalId: 'pro-123',
  canceledAt: null,
  confirmedAt: null,
  createdAt: new Date('2023-01-01T09:00:00'),
  updatedAt: new Date('2023-01-01T09:00:00'),
  startDateTime: new Date('2023-01-01T10:00:00'),
  endDateTime: new Date('2023-01-01T11:00:00'),
  notes: 'Test booking',
  status: 'CONFIRMED',
  totalAmount: 100,
  pointsUsed: 0,
  couponId: null,
  couponDiscount: null,
  user: {
    id: 'user-123', name: 'John Doe',
  }, professional: {
    id: 'pro-123',
    user: {
      id: 'pro-user-123', name: 'Professional User',
    },
  },
  items: [
    {
      id: 'item-123',
      serviceProfessional: {
        id: 'sp-123',
        service: {
          id: 'service-123', name: 'Service Name',
        },
      }, price: 100, duration: 60,
    },
  ],
};
