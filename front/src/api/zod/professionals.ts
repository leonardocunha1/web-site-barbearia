import {
  z as zod
} from 'zod';



export const zodundefinedBodyEspecialidadeMin = 3;


export const zodundefinedBody = zod.object({
  "userId": zod.string().uuid(),
  "especialidade": zod.string().min(zodundefinedBodyEspecialidadeMin),
  "bio": zod.string().optional(),
  "documento": zod.string().optional(),
  "registro": zod.string().optional(),
  "avatarUrl": zod.string().url().optional()
})

export const zodundefinedBodyEspecialidadeMinOne = 3;


export const zodundefinedBody = zod.object({
  "especialidade": zod.string().min(zodundefinedBodyEspecialidadeMinOne).optional(),
  "bio": zod.string().nullish(),
  "documento": zod.string().nullish(),
  "registro": zod.string().nullish(),
  "ativo": zod.boolean().optional(),
  "avatarUrl": zod.string().url().nullish()
})

