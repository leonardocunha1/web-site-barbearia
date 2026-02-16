import { z } from 'zod';

export const professionalSchema = z
  .object({
    id: z.string().uuid().describe('ID do profissional'),
    name: z
      .string()
      .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
      .max(100, { message: 'O nome não pode exceder 100 caracteres' })
      .describe('Nome do profissional'),
    email: z.string().email({ message: 'Email inválido' }).describe('Email do profissional'),
    phone: z.string().nullable().describe('Telefone do profissional'),
    specialty: z
      .string()
      .min(3, { message: 'A especialidade deve ter pelo menos 3 caracteres' })
      .max(50, { message: 'A especialidade não pode exceder 50 caracteres' })
      .describe('Especialidade do profissional'),
    bio: z.string().nullable().describe('Biografia do profissional'),
    avatarUrl: z
      .string()
      .url({ message: 'URL do avatar inválida' })
      .nullable()
      .describe('URL do avatar do profissional'),
    document: z.string().nullable().describe('Documento do profissional'),
    active: z.boolean().describe('Status ativo do profissional'),
  })
  .describe('Dados do profissional');

export const topServiceSchema = z
  .object({
    service: z.string().describe('Nome do serviço'),
    count: z.number().int().nonnegative().describe('Quantidade de agendamentos'),
    percentage: z.number().nonnegative().describe('Percentual do total'),
  })
  .describe('Serviço com estatísticas');

export const metricsSchema = z
  .object({
    appointments: z
      .number()
      .int({ message: 'O número de agendamentos deve ser inteiro' })
      .nonnegative({
        message: 'O número de agendamentos não pode ser negativo',
      })
      .describe('Quantidade total de agendamentos'),
    earnings: z
      .number()
      .nonnegative({ message: 'O valor de ganhos não pode ser negativo' })
      .describe('Total de ganhos'),
    canceled: z
      .number()
      .int({ message: 'O número de cancelamentos deve ser inteiro' })
      .nonnegative({
        message: 'O número de cancelamentos não pode ser negativo',
      })
      .describe('Quantidade de agendamentos cancelados'),
    completed: z
      .number()
      .int({ message: 'O número de concluídos deve ser inteiro' })
      .nonnegative({ message: 'O número de concluídos não pode ser negativo' })
      .describe('Quantidade de agendamentos concluídos'),
    pendingCount: z.number().int().nonnegative().describe('Quantidade de agendamentos pendentes'),
    cancellationRate: z.number().nonnegative().describe('Taxa de cancelamento em percentual'),
    completionRate: z.number().nonnegative().describe('Taxa de conclusão em percentual'),
    averageTicket: z.number().nonnegative().describe('Ganho médio por agendamento'),
    topServices: z.array(topServiceSchema).max(5).describe('Top 5 serviços mais agendados'),
  })
  .describe('Métricas do dashboard');

export const nextAppointmentSchema = z
  .object({
    id: z.string().uuid({ message: 'ID do agendamento inválido' }).describe('ID do agendamento'),
    date: z
      .string()
      .datetime({ message: 'Formato de data/hora inválido. Use ISO 8601' })
      .describe('Data e hora do agendamento no formato ISO'),
    clientName: z
      .string()
      .min(2, { message: 'Nome do cliente deve ter pelo menos 2 caracteres' })
      .describe('Nome do cliente'),
    service: z
      .string()
      .min(3, { message: 'Nome do serviço deve ter pelo menos 3 caracteres' })
      .describe('Serviço agendado'),
    status: z
      .enum(['PENDING', 'CONFIRMED'], {
        errorMap: () => ({ message: 'Status deve ser PENDENTE ou CONFIRMADO' }),
      })
      .describe('Status do agendamento'),
    totalAmount: z.number().nonnegative().optional().describe('Valor total do agendamento'),
  })
  .describe('Próximo agendamento');

export const dashboardSchema = z
  .object({
    professional: professionalSchema,
    metrics: metricsSchema,
    nextAppointments: z
      .array(nextAppointmentSchema)
      .max(10, {
        message: 'A lista de próximos agendamentos está limitada a 10 itens',
      })
      .describe('Lista dos próximos agendamentos'),
  })
  .describe('Dados completos do dashboard');

// Tipos TypeScript inferidos
export type Professional = z.infer<typeof professionalSchema>;
export type TopService = z.infer<typeof topServiceSchema>;
export type Metrics = z.infer<typeof metricsSchema>;
export type NextAppointment = z.infer<typeof nextAppointmentSchema>;
export type Dashboard = z.infer<typeof dashboardSchema>;
