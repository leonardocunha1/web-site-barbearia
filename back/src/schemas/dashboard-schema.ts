import { z } from 'zod';

export const professionalSchema = z.object({
  name: z.string().describe('Nome do profissional'),
  specialty: z.string().describe('Especialidade do profissional'),
  avatarUrl: z.string().nullable().describe('URL do avatar do profissional, pode ser nulo'),
}).describe('Professional');

export const metricsSchema = z.object({
  appointments: z.number().describe('Quantidade total de agendamentos'),
  earnings: z.number().describe('Total de ganhos'),
  canceled: z.number().describe('Quantidade de agendamentos cancelados'),
  completed: z.number().describe('Quantidade de agendamentos concluídos'),
}).describe('Metrics');

export const nextAppointmentSchema = z.object({
  id: z.string().uuid().describe('ID do agendamento'),
  date: z.string().datetime().describe('Data e hora do agendamento no formato ISO'),
  clientName: z.string().describe('Nome do cliente'),
  service: z.string().describe('Serviço agendado'),
  status: z.enum(['PENDENTE', 'CONFIRMADO']).describe('Status do agendamento'),
}).describe('NextAppointment');

export const dashboardSchema = z.object({
  professional: professionalSchema,
  metrics: metricsSchema,
  nextAppointments: z.array(nextAppointmentSchema).describe('Lista dos próximos agendamentos'),
}).describe('Dashboard');
