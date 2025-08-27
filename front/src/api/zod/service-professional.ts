import {
  z as zod
} from 'zod';



export const zodaddServiceToProfessionalParams = zod.object({
  "professionalId": zod.string().uuid()
})

export const zodaddServiceToProfessionalBodyPrecoMin = 0;
export const zodaddServiceToProfessionalBodyDuracaoMin = 0;


export const zodaddServiceToProfessionalBody = zod.object({
  "serviceId": zod.string().uuid(),
  "preco": zod.number().min(zodaddServiceToProfessionalBodyPrecoMin),
  "duracao": zod.number().min(zodaddServiceToProfessionalBodyDuracaoMin)
})

export const zodlistProfessionalServicesParams = zod.object({
  "professionalId": zod.string().uuid()
})

export const zodlistProfessionalServicesQueryPageDefault = 1;
export const zodlistProfessionalServicesQueryPageMin = 0;
export const zodlistProfessionalServicesQueryLimitDefault = 10;
export const zodlistProfessionalServicesQueryLimitMin = 0;

export const zodlistProfessionalServicesQueryLimitMax = 100;
export const zodlistProfessionalServicesQuerySortOrderDefault = "asc";export const zodlistProfessionalServicesQueryActiveOnlyDefault = true;

export const zodlistProfessionalServicesQueryParams = zod.object({
  "page": zod.number().min(zodlistProfessionalServicesQueryPageMin).default(zodlistProfessionalServicesQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistProfessionalServicesQueryLimitMin).max(zodlistProfessionalServicesQueryLimitMax).default(zodlistProfessionalServicesQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortOrder": zod.enum(['asc', 'desc']).default(zodlistProfessionalServicesQuerySortOrderDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "activeOnly": zod.boolean().default(zodlistProfessionalServicesQueryActiveOnlyDefault)
})

export const zodlistProfessionalServicesResponse = zod.object({
  "services": zod.array(zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string(),
  "descricao": zod.string().nullable(),
  "categoria": zod.string().nullable(),
  "ativo": zod.boolean(),
  "createdAt": zod.string().datetime({}),
  "updatedAt": zod.string().datetime({})
})),
  "pagination": zod.object({
  "page": zod.number(),
  "limit": zod.number(),
  "totalPages": zod.number(),
  "total": zod.number()
})
})

export const zodremoveServiceFromProfessionalParams = zod.object({
  "serviceId": zod.string().uuid(),
  "professionalId": zod.string().uuid()
})

export const zodupdateServiceProfessionalParams = zod.object({
  "serviceId": zod.string().uuid(),
  "professionalId": zod.string().uuid()
})

export const zodupdateServiceProfessionalBodyPrecoMin = 0;
export const zodupdateServiceProfessionalBodyDuracaoMin = 0;


export const zodupdateServiceProfessionalBody = zod.object({
  "preco": zod.number().min(zodupdateServiceProfessionalBodyPrecoMin),
  "duracao": zod.number().min(zodupdateServiceProfessionalBodyDuracaoMin)
})

