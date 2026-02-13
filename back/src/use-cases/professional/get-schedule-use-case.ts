import { BookingDTO } from '@/dtos/booking-dto';
import { TimeSlot } from '@/dtos/schedule-dto';
import { IBookingsRepository } from '@/repositories/bookings-repository';
import { IHolidaysRepository } from '@/repositories/holidays-repository';
import { IBusinessHoursRepository } from '@/repositories/business-hours-repository';
import { IServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { parseISO, isSameDay, startOfDay, addMinutes, format } from 'date-fns';
import { SCHEDULE_SLOT_MINUTES } from '@/consts/const';

export class GetProfessionalScheduleUseCase {
  constructor(
    private bookingsRepository: IBookingsRepository,
    private businessHoursRepository: IBusinessHoursRepository,
    private holidaysRepository: IHolidaysRepository,
    private serviceProfessionalRepository: IServiceProfessionalRepository,
  ) {}

  async execute(params: { professionalId: string; date: string; serviceIds?: string[] }) {
    const { professionalId, date, serviceIds = [] } = params;
    const parsedDate = parseISO(date); // Parse ISO string to Date object
    const startOfParsedDate = startOfDay(parsedDate); // Zera hora/minuto/segundo para comparação precisa

    // Calcular duração total dos serviços selecionados
    let totalServiceDuration = SCHEDULE_SLOT_MINUTES; // Padrão é um slot de tempo
    if (serviceIds.length > 0) {
      totalServiceDuration = await this.calculateTotalServiceDuration(professionalId, serviceIds);
    }

    // Verificar se é feriado
    const isHoliday = await this.holidaysRepository.isProfessionalHoliday(
      professionalId,
      startOfParsedDate, // Passar a data zerada
    );

    if (isHoliday) {
      return {
        date,
        timeSlots: [],
        isHoliday: true,
        holidayReason: isHoliday.reason,
      };
    }

    // Obter horário de funcionamento para o dia
    const businessHours = await this.businessHoursRepository.findByProfessionalAndDay(
      professionalId,
      startOfParsedDate.getDay(), // Pega o dia da semana (0-6)
    );

    if (!businessHours || !businessHours.active) {
      return {
        date,
        timeSlots: [],
        isClosed: true,
      };
    }

    // Obter agendamentos do dia
    const bookings = await this.bookingsRepository.findByProfessionalAndDate(
      professionalId,
      startOfParsedDate, // Passar a data zerada
    );

    // Gerar slots de tempo
    const timeSlots = this.generateTimeSlots(
      businessHours,
      startOfParsedDate, // Passar a data zerada
      bookings,
      totalServiceDuration, // Passar duração total
    );

    return {
      date,
      timeSlots,
      businessHours: {
        opensAt: businessHours.opensAt,
        closesAt: businessHours.closesAt,
        breakStart: businessHours.breakStart,
        breakEnd: businessHours.breakEnd,
      },
    };
  }

  private generateTimeSlots(
    businessHours: {
      opensAt: string;
      closesAt: string;
      breakStart: string | null;
      breakEnd: string | null;
    },
    date: Date,
    bookings: BookingDTO[],
    totalServiceDuration: number,
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const slotDuration = SCHEDULE_SLOT_MINUTES;
    const now = new Date();

    let currentTime = startOfDay(date);
    const [openHour, openMinute] = businessHours.opensAt.split(':').map(Number);
    currentTime.setHours(openHour, openMinute, 0, 0);

    const [closeHour, closeMinute] = businessHours.closesAt.split(':').map(Number);
    const closeTime = new Date(date);
    closeTime.setHours(closeHour, closeMinute, 0, 0);

    // Verificar se há pausa
    const hasBreak = !!(businessHours.breakStart && businessHours.breakEnd);
    let breakStart: Date | null = null;
    let breakEnd: Date | null = null;

    if (hasBreak) {
      const [breakStartHour, breakStartMinute] = businessHours.breakStart!.split(':').map(Number);
      breakStart = new Date(date);
      breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

      const [breakEndHour, breakEndMinute] = businessHours.breakEnd!.split(':').map(Number);
      breakEnd = new Date(date);
      breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);
    }

    while (currentTime < closeTime) {
      const slotEnd = addMinutes(currentTime, slotDuration);
      const serviceEnd = addMinutes(currentTime, totalServiceDuration);
      const timeStr = format(currentTime, 'HH:mm');

      // Verificar se está no horário de pausa
      const isDuringBreak =
        hasBreak && breakStart && breakEnd && currentTime >= breakStart && currentTime < breakEnd;

      const isPastSlot = isSameDay(date, now) && currentTime <= now;

      if (!isDuringBreak && !isPastSlot) {
        // Verificar se há um agendamento que se sobrepõe durante todo o tempo do serviço
        const isBooked = bookings.some((booking) => {
          const bookingStart = booking.startDateTime;
          const bookingEnd = booking.endDateTime;
          return (
            isSameDay(bookingStart, date) && currentTime < bookingEnd && serviceEnd > bookingStart
          );
        });

        const booking = bookings.find(
          (b) => isSameDay(b.startDateTime, date) && format(b.startDateTime, 'HH:mm') === timeStr,
        );

        slots.push({
          time: timeStr,
          available: !isBooked,
          booking: booking
            ? {
                id: booking.id,
                clientName: booking.user.name,
                services: booking.items.map((item) => item.serviceProfessional.service.name),
              }
            : undefined,
        });
      }

      currentTime = slotEnd;
    }

    return slots;
  }

  /**
   * Calcula a duração total dos serviços selecionados para um profissional
   */
  private async calculateTotalServiceDuration(
    professionalId: string,
    serviceIds: string[],
  ): Promise<number> {
    if (serviceIds.length === 0) {
      return SCHEDULE_SLOT_MINUTES;
    }

    let totalDuration = 0;

    for (const serviceId of serviceIds) {
      const serviceProfessional =
        await this.serviceProfessionalRepository.findByServiceAndProfessional(
          serviceId,
          professionalId,
        );

      if (serviceProfessional) {
        totalDuration += serviceProfessional.duration;
      }
    }

    // Se nenhum serviço foi encontrado, retorna duração padrão
    return totalDuration > 0 ? totalDuration : SCHEDULE_SLOT_MINUTES;
  }
}
