import {
  z as zod
} from 'zod';



export const zodcreateProfessionalBodyEspecialidadeMin = 3;
export const zodcreateProfessionalBodyAvatarUrlRegExp = new RegExp('^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$');
export const zodcreateProfessionalBodyAtivoDefault = true;

export const zodcreateProfessionalBody = zod.object({
  "email": zod.string().describe('Email do profissional'),
  "especialidade": zod.string().min(zodcreateProfessionalBodyEspecialidadeMin).describe('Especialidade do profissional'),
  "bio": zod.string().optional().describe('Biografia do profissional'),
  "documento": zod.string().optional().describe('Número do documento profissional'),
  "registro": zod.string().optional().describe('Número de registro profissional'),
  "avatarUrl": zod.string().regex(zodcreateProfessionalBodyAvatarUrlRegExp).optional().describe('URL do avatar do profissional'),
  "ativo": zod.boolean().default(zodcreateProfessionalBodyAtivoDefault).describe('Status ativo do profissional')
}).describe('Dados para criação de novo profissional')

export const zodlistOrSearchProfessionalsQueryPageDefault = 1;
export const zodlistOrSearchProfessionalsQueryPageMin = 0;
export const zodlistOrSearchProfessionalsQueryLimitDefault = 10;
export const zodlistOrSearchProfessionalsQueryLimitMin = 0;

export const zodlistOrSearchProfessionalsQueryLimitMax = 100;
export const zodlistOrSearchProfessionalsQuerySortDirectionDefault = "asc";export const zodlistOrSearchProfessionalsQuerySearchMin = 2;


export const zodlistOrSearchProfessionalsQueryParams = zod.object({
  "page": zod.number().min(zodlistOrSearchProfessionalsQueryPageMin).default(zodlistOrSearchProfessionalsQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistOrSearchProfessionalsQueryLimitMin).max(zodlistOrSearchProfessionalsQueryLimitMax).default(zodlistOrSearchProfessionalsQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortDirection": zod.enum(['asc', 'desc']).default(zodlistOrSearchProfessionalsQuerySortDirectionDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "search": zod.string().min(zodlistOrSearchProfessionalsQuerySearchMin).optional().describe('Termo de busca para profissionais'),
  "status": zod.enum(['ativo', 'inativo']).optional().describe('Filtrar por status ativo ou inativo')
})

export const zodlistOrSearchProfessionalsResponseProfessionalsItemEspecialidadeMin = 3;

export const zodlistOrSearchProfessionalsResponseProfessionalsItemEspecialidadeMax = 100;
export const zodlistOrSearchProfessionalsResponseProfessionalsItemBioMax = 500;
export const zodlistOrSearchProfessionalsResponseProfessionalsItemAvatarUrlRegExp = new RegExp('^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$');
export const zodlistOrSearchProfessionalsResponseProfessionalsItemUserNomeMin = 2;
export const zodlistOrSearchProfessionalsResponseProfessionalsItemUserTelefoneRegExp = new RegExp('^\\+?[\\d\\s()-]{10,20}$');
export const zodlistOrSearchProfessionalsResponseProfessionalsItemServicesItemNomeMin = 2;
export const zodlistOrSearchProfessionalsResponseProfessionalsItemServicesItemDescricaoMax = 200;


export const zodlistOrSearchProfessionalsResponse = zod.object({
  "professionals": zod.array(zod.object({
  "id": zod.string().uuid().describe('Identificador único do profissional'),
  "especialidade": zod.string().min(zodlistOrSearchProfessionalsResponseProfessionalsItemEspecialidadeMin).max(zodlistOrSearchProfessionalsResponseProfessionalsItemEspecialidadeMax).describe('Especialidade do profissional'),
  "bio": zod.string().max(zodlistOrSearchProfessionalsResponseProfessionalsItemBioMax).optional().describe('Biografia do profissional'),
  "avatarUrl": zod.string().regex(zodlistOrSearchProfessionalsResponseProfessionalsItemAvatarUrlRegExp).optional().describe('URL da imagem de avatar do profissional'),
  "ativo": zod.boolean().optional().describe('Indica se o profissional está ativo'),
  "user": zod.object({
  "id": zod.string().uuid().describe('ID do usuário'),
  "nome": zod.string().min(zodlistOrSearchProfessionalsResponseProfessionalsItemUserNomeMin).describe('Nome completo do usuário'),
  "email": zod.string().email().describe('Endereço de e-mail do usuário'),
  "telefone": zod.string().regex(zodlistOrSearchProfessionalsResponseProfessionalsItemUserTelefoneRegExp).nullish().describe('Número de telefone do usuário')
}).describe('Detalhes da conta do usuário'),
  "services": zod.array(zod.object({
  "id": zod.string().uuid().describe('ID do serviço'),
  "nome": zod.string().min(zodlistOrSearchProfessionalsResponseProfessionalsItemServicesItemNomeMin).describe('Nome do serviço'),
  "descricao": zod.string().max(zodlistOrSearchProfessionalsResponseProfessionalsItemServicesItemDescricaoMax).optional().describe('Descrição do serviço'),
  "linked": zod.boolean().describe('Indica se o serviço está vinculado ao profissional')
})).describe('Lista de serviços oferecidos pelo profissional')
}).describe('Perfil completo do profissional com detalhes do usuário e serviços')),
  "total": zod.number(),
  "page": zod.number(),
  "limit": zod.number(),
  "totalPages": zod.number()
})

export const zodupdateProfessionalParams = zod.object({
  "id": zod.string().uuid().describe('ID do profissional para atualização')
})

export const zodupdateProfessionalBodyEspecialidadeMin = 3;
export const zodupdateProfessionalBodyAvatarUrlRegExp = new RegExp('^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$');


export const zodupdateProfessionalBody = zod.object({
  "especialidade": zod.string().min(zodupdateProfessionalBodyEspecialidadeMin).optional().describe('Especialidade atualizada do profissional'),
  "bio": zod.string().nullish().describe('Biografia atualizada do profissional'),
  "documento": zod.string().nullish().describe('Número do documento profissional'),
  "registro": zod.string().nullish().describe('Número de registro profissional'),
  "ativo": zod.boolean().optional().describe('Definir status ativo do profissional'),
  "avatarUrl": zod.string().regex(zodupdateProfessionalBodyAvatarUrlRegExp).nullish().describe('URL do avatar atualizado')
}).describe('Dados para atualização do perfil profissional')

export const zodupdateProfessionalResponse = zod.object({
  "message": zod.string()
})

export const zodtoggleProfessionalStatusParams = zod.object({
  "id": zod.string().uuid().describe('ID do profissional para alternar status')
})

export const zodtoggleProfessionalStatusResponse = zod.object({
  "message": zod.string()
})

export const zodgetProfessionalDashboardQueryParams = zod.object({
  "range": zod.enum(['today', 'week', 'month', 'custom']).describe('Período de tempo para análise'),
  "startDate": zod.string().datetime({}).optional().describe('Data de início personalizada (obrigatória para período custom)'),
  "endDate": zod.string().datetime({}).optional().describe('Data de término personalizada (obrigatória para período custom)')
})

export const zodgetProfessionalDashboardResponseProfessionalNameMin = 2;

export const zodgetProfessionalDashboardResponseProfessionalNameMax = 100;
export const zodgetProfessionalDashboardResponseProfessionalSpecialtyMin = 3;

export const zodgetProfessionalDashboardResponseProfessionalSpecialtyMax = 50;
export const zodgetProfessionalDashboardResponseMetricsAppointmentsMin = 0;
export const zodgetProfessionalDashboardResponseMetricsEarningsMin = 0;
export const zodgetProfessionalDashboardResponseMetricsCanceledMin = 0;
export const zodgetProfessionalDashboardResponseMetricsCompletedMin = 0;
export const zodgetProfessionalDashboardResponseNextAppointmentsItemClientNameMin = 2;
export const zodgetProfessionalDashboardResponseNextAppointmentsItemServiceMin = 3;
export const zodgetProfessionalDashboardResponseNextAppointmentsMax = 10;


export const zodgetProfessionalDashboardResponse = zod.object({
  "professional": zod.object({
  "name": zod.string().min(zodgetProfessionalDashboardResponseProfessionalNameMin).max(zodgetProfessionalDashboardResponseProfessionalNameMax).describe('Nome do profissional'),
  "specialty": zod.string().min(zodgetProfessionalDashboardResponseProfessionalSpecialtyMin).max(zodgetProfessionalDashboardResponseProfessionalSpecialtyMax).describe('Especialidade do profissional'),
  "avatarUrl": zod.string().url().nullable().describe('URL do avatar do profissional, pode ser nulo')
}).describe('Dados do profissional'),
  "metrics": zod.object({
  "appointments": zod.number().min(zodgetProfessionalDashboardResponseMetricsAppointmentsMin).describe('Quantidade total de agendamentos'),
  "earnings": zod.number().min(zodgetProfessionalDashboardResponseMetricsEarningsMin).describe('Total de ganhos'),
  "canceled": zod.number().min(zodgetProfessionalDashboardResponseMetricsCanceledMin).describe('Quantidade de agendamentos cancelados'),
  "completed": zod.number().min(zodgetProfessionalDashboardResponseMetricsCompletedMin).describe('Quantidade de agendamentos concluídos')
}).describe('Métricas do dashboard'),
  "nextAppointments": zod.array(zod.object({
  "id": zod.string().uuid().describe('ID do agendamento'),
  "date": zod.string().datetime({}).describe('Data e hora do agendamento no formato ISO'),
  "clientName": zod.string().min(zodgetProfessionalDashboardResponseNextAppointmentsItemClientNameMin).describe('Nome do cliente'),
  "service": zod.string().min(zodgetProfessionalDashboardResponseNextAppointmentsItemServiceMin).describe('Serviço agendado'),
  "status": zod.enum(['PENDENTE', 'CONFIRMADO']).describe('Status do agendamento')
}).describe('Próximo agendamento')).max(zodgetProfessionalDashboardResponseNextAppointmentsMax).describe('Lista dos próximos agendamentos')
}).describe('Dados completos do dashboard')

export const zodgetProfessionalScheduleQueryDateRegExp = new RegExp('^\\d{4}-\\d{2}-\\d{2}$');


export const zodgetProfessionalScheduleQueryParams = zod.object({
  "professionalId": zod.string().uuid(),
  "date": zod.string().regex(zodgetProfessionalScheduleQueryDateRegExp)
})

export const zodgetProfessionalScheduleResponse = zod.object({
  "date": zod.string(),
  "timeSlots": zod.array(zod.object({
  "time": zod.string(),
  "available": zod.boolean(),
  "booking": zod.object({
  "id": zod.string(),
  "clientName": zod.string(),
  "services": zod.array(zod.string())
}).optional()
})),
  "businessHours": zod.object({
  "openAt": zod.string(),
  "closeAt": zod.string(),
  "breakStart": zod.string().optional(),
  "breakEnd": zod.string().optional()
})
})

