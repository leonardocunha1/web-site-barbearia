import {
  z as zod
} from 'zod';



/**
 * Criação de um novo horário de funcionamento.
 */
export const zodcreateBusinessHourBodyDiaSemanaMin = 0;

export const zodcreateBusinessHourBodyDiaSemanaMax = 6;
export const zodcreateBusinessHourBodyAbreAsRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodcreateBusinessHourBodyFechaAsRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodcreateBusinessHourBodyPausaInicioRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodcreateBusinessHourBodyPausaFimRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');


export const zodcreateBusinessHourBody = zod.object({
  "professionalId": zod.string().uuid().describe('ID do profissional no formato UUID'),
  "diaSemana": zod.number().min(zodcreateBusinessHourBodyDiaSemanaMin).max(zodcreateBusinessHourBodyDiaSemanaMax).describe('Dia da semana (0=domingo a 6=sábado)'),
  "abreAs": zod.string().regex(zodcreateBusinessHourBodyAbreAsRegExp).describe('Horário de abertura no formato HH:MM'),
  "fechaAs": zod.string().regex(zodcreateBusinessHourBodyFechaAsRegExp).describe('Horário de fechamento no formato HH:MM (deve ser após a abertura)'),
  "pausaInicio": zod.string().regex(zodcreateBusinessHourBodyPausaInicioRegExp).nullish().describe('Início da pausa (opcional) no formato HH:MM'),
  "pausaFim": zod.string().regex(zodcreateBusinessHourBodyPausaFimRegExp).nullish().describe('Fim da pausa (opcional) no formato HH:MM (deve ser após o início)')
}).describe('Schema para criação de horário comercial')

/**
 * Atualização de um horário de funcionamento.
 */
export const zodupdateBusinessHourParams = zod.object({
  "professionalId": zod.string()
})

export const zodupdateBusinessHourBodyDiaSemanaMin = 0;

export const zodupdateBusinessHourBodyDiaSemanaMax = 6;
export const zodupdateBusinessHourBodyAbreAsRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodupdateBusinessHourBodyFechaAsRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodupdateBusinessHourBodyPausaInicioRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodupdateBusinessHourBodyPausaFimRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');


export const zodupdateBusinessHourBody = zod.object({
  "diaSemana": zod.number().min(zodupdateBusinessHourBodyDiaSemanaMin).max(zodupdateBusinessHourBodyDiaSemanaMax).optional().describe('Dia da semana (0=domingo a 6=sábado)'),
  "abreAs": zod.string().regex(zodupdateBusinessHourBodyAbreAsRegExp).optional().describe('Novo horário de abertura (opcional)'),
  "fechaAs": zod.string().regex(zodupdateBusinessHourBodyFechaAsRegExp).optional().describe('Novo horário de fechamento (opcional)'),
  "pausaInicio": zod.string().regex(zodupdateBusinessHourBodyPausaInicioRegExp).nullish().describe('Novo início de pausa (opcional)'),
  "pausaFim": zod.string().regex(zodupdateBusinessHourBodyPausaFimRegExp).nullish().describe('Novo fim de pausa (opcional)')
}).describe('Schema para atualização de horário comercial')

export const zodupdateBusinessHourResponse = zod.enum(['null']).nullable().describe('Horário de funcionamento atualizado com sucesso.')

/**
 * Listar horários de funcionamento.
 */
export const zodlistBusinessHoursParams = zod.object({
  "professionalId": zod.string().uuid().describe('ID do profissional no formato UUID')
})

export const zodlistBusinessHoursResponseBusinessHoursItemDiaSemanaMin = 0;

export const zodlistBusinessHoursResponseBusinessHoursItemDiaSemanaMax = 6;


export const zodlistBusinessHoursResponse = zod.object({
  "businessHours": zod.array(zod.object({
  "id": zod.string().uuid().describe('ID do registro'),
  "ativo": zod.boolean().describe('Indica se o horário está ativo'),
  "diaSemana": zod.number().min(zodlistBusinessHoursResponseBusinessHoursItemDiaSemanaMin).max(zodlistBusinessHoursResponseBusinessHoursItemDiaSemanaMax).describe('Dia da semana (0=domingo a 6=sábado)'),
  "abreAs": zod.string().describe('Horário de abertura'),
  "fechaAs": zod.string().describe('Horário de fechamento'),
  "pausaInicio": zod.string().nullable().describe('Início da pausa'),
  "pausaFim": zod.string().nullable().describe('Fim da pausa'),
  "profissionalId": zod.string().uuid().describe('ID do profissional associado')
}).describe('Schema completo de horário comercial'))
}).describe('Horários de funcionamento encontrados.')

/**
 * Deletar um horário de funcionamento.
 */
export const zoddeleteBusinessHourParams = zod.object({
  "businessHoursId": zod.string().uuid().describe('ID do horário comercial no formato UUID')
})

