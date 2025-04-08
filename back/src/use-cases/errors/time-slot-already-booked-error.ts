export class TimeSlotAlreadyBookedError extends Error {
  constructor() {
    super('Este horário já está ocupado pelo profissional.');
  }
}
