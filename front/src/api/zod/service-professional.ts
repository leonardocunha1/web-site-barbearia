import {
  z as zod
} from 'zod';



export const zodundefinedBodyPrecoMin = 0;
export const zodundefinedBodyDuracaoMinOne = 0;


export const zodundefinedBody = zod.object({
  "serviceId": zod.string().uuid(),
  "preco": zod.number().min(zodundefinedBodyPrecoMin),
  "duracao": zod.number().min(zodundefinedBodyDuracaoMinOne)
})

export const zodundefinedBodyPrecoMinOne = 0;
export const zodundefinedBodyDuracaoMinTwo = 0;


export const zodundefinedBody = zod.object({
  "preco": zod.number().min(zodundefinedBodyPrecoMinOne),
  "duracao": zod.number().min(zodundefinedBodyDuracaoMinTwo)
})

