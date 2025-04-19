import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { addMinutes, format, parseISO, isSameDay } from 'date-fns';
import { HorariosFuncionamentoRepository } from '@/repositories/horarios-funcionamento-repository';
import { FeriadosRepository } from '@/repositories/feriados-repository';
import { TimeSlot } from '@/dtos/schedule-dto';

export class GetProfessionalScheduleUseCase {
  constructor(
    private professionalsRepository: ProfessionalsRepository,
    private bookingsRepository: BookingsRepository,
    private horariosFuncionamentoRepository: HorariosFuncionamentoRepository,
    private feriadosRepository: FeriadosRepository,
  ) {}

  async execute(params: { professionalId: string; date: string }) {
    const { professionalId, date } = params;
    const parsedDate = parseISO(date);
    const dayOfWeek = parsedDate.getDay(); // 0-6 (Domingo-Sábado)

    // Verificar se é feriado
    const isHoliday = await this.feriadosRepository.isProfessionalHoliday(
      professionalId,
      parsedDate,
    );

    if (isHoliday) {
      return {
        date,
        timeSlots: [],
        isHoliday: true,
        holidayReason: isHoliday.motivo,
      };
    }

    // Obter horário de funcionamento para o dia
    const businessHours =
      await this.horariosFuncionamentoRepository.findByProfessionalAndDay(
        professionalId,
        dayOfWeek,
      );

    if (!businessHours || !businessHours.ativo) {
      return {
        date,
        timeSlots: [],
        isClosed: true,
      };
    }

    // Obter agendamentos do dia
    const bookings = await this.bookingsRepository.findByProfessionalAndDate(
      professionalId,
      parsedDate,
    );

    // Gerar slots de tempo
    const timeSlots = this.generateTimeSlots(
      businessHours,
      parsedDate,
      bookings,
    );

    return {
      date,
      timeSlots,
      businessHours: {
        opensAt: businessHours.abreAs,
        closesAt: businessHours.fechaAs,
        breakStart: businessHours.pausaInicio,
        breakEnd: businessHours.pausaFim,
      },
    };
  }

  private generateTimeSlots(
    businessHours: {
      abreAs: string;
      fechaAs: string;
      pausaInicio: string | null;
      pausaFim: string | null;
    },
    date: Date,
    bookings: Array<{
      id: string;
      dataHoraInicio: Date;
      dataHoraFim: Date;
      status: string;
      user: { nome: string };
      items: Array<{ service: { nome: string } }>;
    }>,
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const slotDuration = 30; // 30 minutos por slot

    let currentTime = new Date(date);
    const [openHour, openMinute] = businessHours.abreAs.split(':').map(Number);
    currentTime.setHours(openHour, openMinute, 0, 0);

    const [closeHour, closeMinute] = businessHours.fechaAs
      .split(':')
      .map(Number);
    const closeTime = new Date(date);
    closeTime.setHours(closeHour, closeMinute, 0, 0);

    // Verificar se há pausa
    const hasBreak = !!(businessHours.pausaInicio && businessHours.pausaFim);
    let breakStart: Date | null = null;
    let breakEnd: Date | null = null;

    if (hasBreak) {
      const [breakStartHour, breakStartMinute] = businessHours
        .pausaInicio!.split(':')
        .map(Number);
      breakStart = new Date(date);
      breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

      const [breakEndHour, breakEndMinute] = businessHours
        .pausaFim!.split(':')
        .map(Number);
      breakEnd = new Date(date);
      breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);
    }

    while (currentTime < closeTime) {
      const slotEnd = addMinutes(currentTime, slotDuration);
      const timeStr = format(currentTime, 'HH:mm');

      // Verificar se está no horário de pausa
      const isDuringBreak =
        hasBreak &&
        breakStart &&
        breakEnd &&
        currentTime >= breakStart &&
        currentTime < breakEnd;

      if (!isDuringBreak) {
        // Verificar se há um agendamento neste horário
        const booking = bookings.find((b) => {
          return (
            isSameDay(b.dataHoraInicio, date) &&
            format(b.dataHoraInicio, 'HH:mm') === timeStr
          );
        });

        slots.push({
          time: timeStr,
          available: !booking,
          booking: booking
            ? {
                id: booking.id,
                clientName: booking.user.nome,
                services: booking.items.map((item) => item.service.nome),
              }
            : undefined,
        });
      }

      currentTime = slotEnd;
    }

    return slots;
  }
}
