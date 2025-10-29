import {
  z as zod
} from 'zod';



/**
 * Criação de um novo feriado.
 */
export const zodcreateHolidayBodyNotesMax = 500;
export const zodcreateHolidayBodyUseBonusPointsDefault = false;export const zodcreateHolidayBodyCouponCodeMax = 50;


export const zodcreateHolidayBody = zod.object({
  "professionalId": zod.string().uuid(),
  "services": zod.array(zod.object({
  "serviceId": zod.string().uuid()
})).min(1),
  "startDateTime": zod.string().datetime({}),
  "notes": zod.string().max(zodcreateHolidayBodyNotesMax).optional(),
  "useBonusPoints": zod.boolean().optional(),
  "couponCode": zod.string().max(zodcreateHolidayBodyCouponCodeMax).optional()
}).describe('Dados para criação de agendamento')

/**
 * Listar feriados.
 */
export const zodlistHolidaysQueryPageDefault = 1;
export const zodlistHolidaysQueryPageMin = 0;
export const zodlistHolidaysQueryLimitDefault = 10;
export const zodlistHolidaysQueryLimitMin = 0;

export const zodlistHolidaysQueryLimitMax = 100;
export const zodlistHolidaysQuerySortDirectionDefault = "asc";

export const zodlistHolidaysQueryParams = zod.object({
  "page": zod.number().min(zodlistHolidaysQueryPageMin).default(zodlistHolidaysQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistHolidaysQueryLimitMin).max(zodlistHolidaysQueryLimitMax).default(zodlistHolidaysQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortDirection": zod.enum(['asc', 'desc']).default(zodlistHolidaysQuerySortDirectionDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)')
})

export const zodlistHolidaysResponseTotalMin = 0;
export const zodlistHolidaysResponsePageMin = 0;
export const zodlistHolidaysResponseLimitMin = 0;

export const zodlistHolidaysResponseLimitMax = 100;
export const zodlistHolidaysResponseTotalPagesMin = 0;


export const zodlistHolidaysResponse = zod.object({
  "holidays": zod.array(zod.object({
  "id": zod.string().uuid().describe('ID do feriado'),
  "data": zod.string().datetime({}).describe('Data no formato ISO 8601'),
  "motivo": zod.string().describe('Motivo do feriado'),
  "profissionalId": zod.string().uuid().describe('ID do profissional')
})).describe('Lista de feriados'),
  "total": zod.number().min(zodlistHolidaysResponseTotalMin).describe('Total de registros'),
  "page": zod.number().min(zodlistHolidaysResponsePageMin).describe('Página atual'),
  "limit": zod.number().min(zodlistHolidaysResponseLimitMin).max(zodlistHolidaysResponseLimitMax).describe('Itens por página'),
  "totalPages": zod.number().min(zodlistHolidaysResponseTotalPagesMin).describe('Total de páginas')
}).describe('Lista de feriados com paginação.')

/**
 * Deletar um feriado.
 */
export const zoddeleteHolidayParams = zod.object({
  "holidayId": zod.string().uuid().describe('ID do feriado no formato UUID')
})

