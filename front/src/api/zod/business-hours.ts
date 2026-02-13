import {
  z as zod
} from 'zod';



/**
 * Criação de um novo horário de funcionamento.
 */
export const zodcreateBusinessHourBodyDayOfWeekMin = 0;

export const zodcreateBusinessHourBodyDayOfWeekMax = 6;
export const zodcreateBusinessHourBodyOpensAtRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodcreateBusinessHourBodyClosesAtRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodcreateBusinessHourBodyBreakStartRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodcreateBusinessHourBodyBreakEndRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');


export const zodcreateBusinessHourBody = zod.object({
  "dayOfWeek": zod.number().min(zodcreateBusinessHourBodyDayOfWeekMin).max(zodcreateBusinessHourBodyDayOfWeekMax).describe('Dia da semana (0=domingo a 6=sábado)'),
  "opensAt": zod.string().regex(zodcreateBusinessHourBodyOpensAtRegExp).describe('Horário de abertura no formato HH:MM'),
  "closesAt": zod.string().regex(zodcreateBusinessHourBodyClosesAtRegExp).describe('Horário de fechamento no formato HH:MM (deve ser após a abertura)'),
  "breakStart": zod.string().regex(zodcreateBusinessHourBodyBreakStartRegExp).nullish().describe('Início da pausa (opcional) no formato HH:MM'),
  "breakEnd": zod.string().regex(zodcreateBusinessHourBodyBreakEndRegExp).nullish().describe('Fim da pausa (opcional) no formato HH:MM (deve ser após o início)')
}).describe('Schema para criação de horário comercial')

/**
 * Atualização de um horário de funcionamento.
 */
export const zodupdateBusinessHourParams = zod.object({
  "professionalId": zod.string()
})

export const zodupdateBusinessHourBodyDayOfWeekMin = 0;

export const zodupdateBusinessHourBodyDayOfWeekMax = 6;
export const zodupdateBusinessHourBodyOpensAtRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodupdateBusinessHourBodyClosesAtRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodupdateBusinessHourBodyBreakStartRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodupdateBusinessHourBodyBreakEndRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');


export const zodupdateBusinessHourBody = zod.object({
  "dayOfWeek": zod.number().min(zodupdateBusinessHourBodyDayOfWeekMin).max(zodupdateBusinessHourBodyDayOfWeekMax).optional().describe('Dia da semana (0=domingo a 6=sábado)'),
  "opensAt": zod.string().regex(zodupdateBusinessHourBodyOpensAtRegExp).optional().describe('Novo horário de abertura (opcional)'),
  "closesAt": zod.string().regex(zodupdateBusinessHourBodyClosesAtRegExp).optional().describe('Novo horário de fechamento (opcional)'),
  "breakStart": zod.string().regex(zodupdateBusinessHourBodyBreakStartRegExp).nullish().describe('Novo início de pausa (opcional)'),
  "breakEnd": zod.string().regex(zodupdateBusinessHourBodyBreakEndRegExp).nullish().describe('Novo fim de pausa (opcional)')
}).describe('Schema para atualização de horário comercial')

export const zodupdateBusinessHourResponse = zod.enum(['null']).nullable().describe('Horário de funcionamento atualizado com sucesso.')

/**
 * Listar horários de funcionamento.
 */
export const zodlistBusinessHoursParams = zod.object({
  "professionalId": zod.string().uuid().describe('ID do profissional no formato UUID')
})

export const zodlistBusinessHoursResponseBusinessHoursItemDayOfWeekMin = 0;

export const zodlistBusinessHoursResponseBusinessHoursItemDayOfWeekMax = 6;


export const zodlistBusinessHoursResponse = zod.object({
  "businessHours": zod.array(zod.object({
  "id": zod.string().uuid().describe('ID do registro'),
  "active": zod.boolean().describe('Indica se o horário está ativo'),
  "dayOfWeek": zod.number().min(zodlistBusinessHoursResponseBusinessHoursItemDayOfWeekMin).max(zodlistBusinessHoursResponseBusinessHoursItemDayOfWeekMax).describe('Dia da semana (0=domingo a 6=sábado)'),
  "opensAt": zod.string().describe('Horário de abertura'),
  "closesAt": zod.string().describe('Horário de fechamento'),
  "breakStart": zod.string().nullable().describe('Início da pausa'),
  "breakEnd": zod.string().nullable().describe('Fim da pausa'),
  "professionalId": zod.string().uuid().describe('ID do profissional associado')
}).describe('Schema completo de horário comercial'))
}).describe('Horários de funcionamento encontrados.')

/**
 * Deletar um horário de funcionamento.
 */
export const zoddeleteBusinessHourParams = zod.object({
  "businessHoursId": zod.string().uuid().describe('ID do horário comercial no formato UUID')
})

