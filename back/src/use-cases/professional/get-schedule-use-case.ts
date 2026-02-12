import { BookingDTO } from '@/dtos/booking-dto';
import { TimeSlot } from '@/dtos/schedule-dto';
import { IBookingsRepository } from '@/repositories/bookings-repository';
import { IHolidaysRepository } from '@/repositories/holidays-repository';
import { IBusinessHoursRepository } from '@/repositories/business-hours-repository';
import { parseISO, isSameDay, startOfDay, addMinutes, format } from 'date-fns';
import { SCHEDULE_SLOT_MINUTES } from '@/consts/const';

export class GetProfessionalScheduleUseCase {
  constructor(
    private bookingsRepository: IBookingsRepository,
    private businessHoursRepository: IBusinessHoursRepository,
    private holidaysRepository: IHolidaysRepository,
  ) {}

  async execute(params: { professionalId: string; date: string }) {
    const { professionalId, date } = params;
    const parsedDate = parseISO(date); // Parse ISO string to Date object
    const startOfParsedDate = startOfDay(parsedDate); // Zera hora/minuto/segundo para comparação precisa

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
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const slotDuration = SCHEDULE_SLOT_MINUTES;

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
      const timeStr = format(currentTime, 'HH:mm');

      // Verificar se está no horário de pausa
      const isDuringBreak =
        hasBreak && breakStart && breakEnd && currentTime >= breakStart && currentTime < breakEnd;

      if (!isDuringBreak) {
        // Verificar se há um agendamento que se sobrepõe a este slot
        const isBooked = bookings.some((booking) => {
          const bookingStart = booking.startDateTime;
          const bookingEnd = booking.endDateTime;
          return (
            isSameDay(bookingStart, date) && currentTime < bookingEnd && slotEnd > bookingStart
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
}
