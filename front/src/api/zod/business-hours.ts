import {
  z as zod
} from 'zod';



/**
 * Criação de um novo horário de funcionamento.
 */
export const zodundefinedBodyDiaSemanaMin = 0;

export const zodundefinedBodyDiaSemanaMax = 6;
export const zodundefinedBodyAbreAsRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodundefinedBodyFechaAsRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodundefinedBodyPausaInicioRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');
export const zodundefinedBodyPausaFimRegExp = new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$');


export const zodundefinedBody = zod.object({
  "professionalId": zod.string(),
  "diaSemana": zod.number().min(zodundefinedBodyDiaSemanaMin).max(zodundefinedBodyDiaSemanaMax),
  "abreAs": zod.string().regex(zodundefinedBodyAbreAsRegExp),
  "fechaAs": zod.string().regex(zodundefinedBodyFechaAsRegExp),
  "pausaInicio": zod.string().regex(zodundefinedBodyPausaInicioRegExp).nullish(),
  "pausaFim": zod.string().regex(zodundefinedBodyPausaFimRegExp).nullish()
})

/**
 * Atualização de um horário de funcionamento.
 */
export const zodundefinedBodyDiaSemanaMinOne = 0;

export const zodundefinedBodyDiaSemanaMaxOne = 6;


export const zodundefinedBody = zod.object({
  "diaSemana": zod.number().min(zodundefinedBodyDiaSemanaMinOne).max(zodundefinedBodyDiaSemanaMaxOne),
  "abreAs": zod.string().optional(),
  "fechaAs": zod.string().optional(),
  "pausaInicio": zod.string().nullish(),
  "pausaFim": zod.string().nullish()
})

