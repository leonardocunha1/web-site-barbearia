import {
  z as zod
} from 'zod';



/**
 * Registro de novo usuário.
 */
export const zodundefinedBodyNomeMinThree = 3;
export const zodundefinedBodySenhaMin = 6;


export const zodundefinedBody = zod.object({
  "nome": zod.string().min(zodundefinedBodyNomeMinThree),
  "email": zod.string().email(),
  "senha": zod.string().min(zodundefinedBodySenhaMin),
  "role": zod.enum(['CLIENTE', 'PROFISSIONAL', 'ADMIN']).optional()
})

/**
 * Autenticação do usuário.
 */
export const zodundefinedBodySenhaMinOne = 6;


export const zodundefinedBody = zod.object({
  "email": zod.string().email(),
  "senha": zod.string().min(zodundefinedBodySenhaMinOne)
})

