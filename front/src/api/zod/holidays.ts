import {
  z as zod
} from 'zod';



/**
 * Criação de um novo feriado.
 */
export const zodcreateHolidayBodyReasonMin = 3;

export const zodcreateHolidayBodyReasonMax = 100;


export const zodcreateHolidayBody = zod.object({
  "date": zod.string().datetime({}).describe('Data do feriado no formato ISO 8601 com timezone'),
  "reason": zod.string().min(zodcreateHolidayBodyReasonMin).max(zodcreateHolidayBodyReasonMax).describe('Motivo do feriado (3-100 caracteres)')
}).describe('Schema para criação de feriados')

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
  "date": zod.string().datetime({}).describe('Data no formato ISO 8601'),
  "reason": zod.string().describe('Motivo do feriado'),
  "professionalId": zod.string().uuid().describe('ID do profissional')
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

