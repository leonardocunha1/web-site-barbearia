import {
  z as zod
} from 'zod';



export const zodundefinedBody = zod.object({
  "nome": zod.string(),
  "descricao": zod.string().optional(),
  "categoria": zod.string().optional()
})

export const zodundefinedBodyNomeMinTwo = 3;
export const zodundefinedBodyPrecoPadraoMin = 0;
export const zodundefinedBodyDuracaoMin = 0;


export const zodundefinedBody = zod.object({
  "nome": zod.string().min(zodundefinedBodyNomeMinTwo).optional(),
  "descricao": zod.string().optional(),
  "precoPadrao": zod.number().min(zodundefinedBodyPrecoPadraoMin).optional(),
  "duracao": zod.number().min(zodundefinedBodyDuracaoMin).optional(),
  "categoria": zod.string().optional(),
  "ativo": zod.boolean().optional()
})

