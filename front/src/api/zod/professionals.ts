import {
  z as zod
} from 'zod';



export const zodcreateProfessionalBodyEspecialidadeMin = 3;
export const zodcreateProfessionalBodyAvatarUrlRegExp = new RegExp('^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$');


export const zodcreateProfessionalBody = zod.object({
  "userId": zod.string().uuid().describe('Existing user ID to associate with professional'),
  "especialidade": zod.string().min(zodcreateProfessionalBodyEspecialidadeMin).describe('Professional specialty'),
  "bio": zod.string().optional().describe('Professional biography'),
  "documento": zod.string().optional().describe('Professional document number'),
  "registro": zod.string().optional().describe('Professional registration number'),
  "avatarUrl": zod.string().regex(zodcreateProfessionalBodyAvatarUrlRegExp).optional().describe('Professional avatar URL')
}).describe('Payload for creating new professional')

export const zodlistOrSearchProfessionalsQueryPageDefault = 1;
export const zodlistOrSearchProfessionalsQueryPageMin = 0;
export const zodlistOrSearchProfessionalsQueryLimitDefault = 10;
export const zodlistOrSearchProfessionalsQueryLimitMin = 0;

export const zodlistOrSearchProfessionalsQueryLimitMax = 100;
export const zodlistOrSearchProfessionalsQuerySortOrderDefault = "asc";export const zodlistOrSearchProfessionalsQueryQueryMin = 2;
export const zodlistOrSearchProfessionalsQueryAtivoDefault = true;

export const zodlistOrSearchProfessionalsQueryParams = zod.object({
  "page": zod.number().min(zodlistOrSearchProfessionalsQueryPageMin).default(zodlistOrSearchProfessionalsQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistOrSearchProfessionalsQueryLimitMin).max(zodlistOrSearchProfessionalsQueryLimitMax).default(zodlistOrSearchProfessionalsQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortOrder": zod.enum(['asc', 'desc']).default(zodlistOrSearchProfessionalsQuerySortOrderDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "query": zod.string().min(zodlistOrSearchProfessionalsQueryQueryMin).describe('Search term for professionals'),
  "ativo": zod.boolean().default(zodlistOrSearchProfessionalsQueryAtivoDefault).describe('Filter by active status (default: true)')
})

export const zodlistOrSearchProfessionalsResponseProfessionalsItemEspecialidadeMin = 3;
export const zodlistOrSearchProfessionalsResponseProfessionalsItemBioMax = 500;
export const zodlistOrSearchProfessionalsResponseProfessionalsItemAvatarUrlRegExp = new RegExp('^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$');
export const zodlistOrSearchProfessionalsResponseProfessionalsItemUserNomeMin = 2;
export const zodlistOrSearchProfessionalsResponseProfessionalsItemUserTelefoneRegExp = new RegExp('^\\+?[0-9]{10,15}$');
export const zodlistOrSearchProfessionalsResponseProfessionalsItemServicesItemNomeMin = 2;
export const zodlistOrSearchProfessionalsResponseProfessionalsItemServicesItemDescricaoMax = 200;


export const zodlistOrSearchProfessionalsResponse = zod.object({
  "professionals": zod.array(zod.object({
  "id": zod.string().uuid().describe('Unique identifier for the professional'),
  "especialidade": zod.string().min(zodlistOrSearchProfessionalsResponseProfessionalsItemEspecialidadeMin).describe('Professional specialty'),
  "bio": zod.string().max(zodlistOrSearchProfessionalsResponseProfessionalsItemBioMax).optional().describe('Professional biography'),
  "avatarUrl": zod.string().regex(zodlistOrSearchProfessionalsResponseProfessionalsItemAvatarUrlRegExp).optional().describe('URL to professional avatar image'),
  "ativo": zod.boolean().optional().describe('Whether the professional is active'),
  "user": zod.object({
  "id": zod.string().uuid().describe('User ID'),
  "nome": zod.string().min(zodlistOrSearchProfessionalsResponseProfessionalsItemUserNomeMin).describe('User full name'),
  "email": zod.string().email().describe('User email address'),
  "telefone": zod.string().regex(zodlistOrSearchProfessionalsResponseProfessionalsItemUserTelefoneRegExp).nullish().describe('User phone number')
}).describe('User account details'),
  "services": zod.array(zod.object({
  "id": zod.string().uuid().describe('Service ID'),
  "nome": zod.string().min(zodlistOrSearchProfessionalsResponseProfessionalsItemServicesItemNomeMin).describe('Service name'),
  "descricao": zod.string().max(zodlistOrSearchProfessionalsResponseProfessionalsItemServicesItemDescricaoMax).optional().describe('Service description')
})).describe('List of services offered by the professional')
}).describe('Complete professional profile with user details and services')),
  "total": zod.number(),
  "page": zod.number(),
  "limit": zod.number(),
  "totalPages": zod.number()
})

export const zodupdateProfessionalParams = zod.object({
  "id": zod.string().uuid().describe('Professional ID to update')
})

export const zodupdateProfessionalBodyEspecialidadeMin = 3;
export const zodupdateProfessionalBodyAvatarUrlRegExp = new RegExp('^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$');


export const zodupdateProfessionalBody = zod.object({
  "especialidade": zod.string().min(zodupdateProfessionalBodyEspecialidadeMin).optional().describe('Updated professional specialty'),
  "bio": zod.string().nullish().describe('Updated professional biography'),
  "documento": zod.string().nullish().describe('Professional document number'),
  "registro": zod.string().nullish().describe('Professional registration number'),
  "ativo": zod.boolean().optional().describe('Set professional active status'),
  "avatarUrl": zod.string().regex(zodupdateProfessionalBodyAvatarUrlRegExp).nullish().describe('Updated avatar URL')
}).describe('Professional profile update payload')

export const zodupdateProfessionalResponse = zod.object({
  "message": zod.string()
})

export const zodtoggleProfessionalStatusParams = zod.object({
  "id": zod.string().uuid().describe('Professional ID to toggle status')
})

export const zodtoggleProfessionalStatusResponse = zod.object({
  "message": zod.string()
})

export const zodgetProfessionalDashboardQueryParams = zod.object({
  "range": zod.enum(['today', 'week', 'month', 'custom']).describe('Time range for analytics'),
  "startDate": zod.string().datetime({}).optional().describe('Custom start date (required for custom range)'),
  "endDate": zod.string().datetime({}).optional().describe('Custom end date (required for custom range)')
})

export const zodgetProfessionalDashboardResponse = zod.object({
  "professional": zod.object({
  "name": zod.string().describe('Nome do profissional'),
  "specialty": zod.string().describe('Especialidade do profissional'),
  "avatarUrl": zod.string().nullable().describe('URL do avatar do profissional, pode ser nulo')
}).describe('Professional'),
  "metrics": zod.object({
  "appointments": zod.number().describe('Quantidade total de agendamentos'),
  "earnings": zod.number().describe('Total de ganhos'),
  "canceled": zod.number().describe('Quantidade de agendamentos cancelados'),
  "completed": zod.number().describe('Quantidade de agendamentos concluídos')
}).describe('Metrics'),
  "nextAppointments": zod.array(zod.object({
  "id": zod.string().uuid().describe('ID do agendamento'),
  "date": zod.string().datetime({}).describe('Data e hora do agendamento no formato ISO'),
  "clientName": zod.string().describe('Nome do cliente'),
  "service": zod.string().describe('Serviço agendado'),
  "status": zod.enum(['PENDENTE', 'CONFIRMADO']).describe('Status do agendamento')
}).describe('NextAppointment')).describe('Lista dos próximos agendamentos')
}).describe('Dashboard')

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

