import {
  z as zod
} from 'zod';



export const zodaddServiceToProfessionalParams = zod.object({
  "professionalId": zod.string().uuid()
})

export const zodaddServiceToProfessionalBodyPriceMin = 0;
export const zodaddServiceToProfessionalBodyDurationMin = 0;


export const zodaddServiceToProfessionalBody = zod.object({
  "serviceId": zod.string().uuid(),
  "price": zod.number().min(zodaddServiceToProfessionalBodyPriceMin),
  "duration": zod.number().min(zodaddServiceToProfessionalBodyDurationMin)
})

export const zodlistProfessionalServicesParams = zod.object({
  "professionalId": zod.string().uuid()
})

export const zodlistProfessionalServicesQueryPageDefault = 1;
export const zodlistProfessionalServicesQueryPageMin = 0;
export const zodlistProfessionalServicesQueryLimitDefault = 10;
export const zodlistProfessionalServicesQueryLimitMin = 0;

export const zodlistProfessionalServicesQueryLimitMax = 100;
export const zodlistProfessionalServicesQuerySortDirectionDefault = "asc";export const zodlistProfessionalServicesQueryActiveOnlyDefault = true;

export const zodlistProfessionalServicesQueryParams = zod.object({
  "page": zod.number().min(zodlistProfessionalServicesQueryPageMin).default(zodlistProfessionalServicesQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistProfessionalServicesQueryLimitMin).max(zodlistProfessionalServicesQueryLimitMax).default(zodlistProfessionalServicesQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortDirection": zod.enum(['asc', 'desc']).default(zodlistProfessionalServicesQuerySortDirectionDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "activeOnly": zod.boolean().default(zodlistProfessionalServicesQueryActiveOnlyDefault)
})

export const zodlistProfessionalServicesResponse = zod.object({
  "services": zod.array(zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "description": zod.string().nullable(),
  "category": zod.string().nullable(),
  "active": zod.boolean(),
  "price": zod.number().nullable(),
  "duration": zod.number().nullable()
})),
  "pagination": zod.object({
  "page": zod.number(),
  "limit": zod.number(),
  "totalPages": zod.number(),
  "total": zod.number()
})
})

export const zodupdateServiceProfessionalParams = zod.object({
  "professionalId": zod.string().uuid()
})

export const zodupdateServiceProfessionalBodyServicesItemPriceMin = 0;
export const zodupdateServiceProfessionalBodyServicesItemDurationMin = 0;


export const zodupdateServiceProfessionalBody = zod.object({
  "services": zod.array(zod.object({
  "serviceId": zod.string().uuid(),
  "price": zod.number().min(zodupdateServiceProfessionalBodyServicesItemPriceMin),
  "duration": zod.number().min(zodupdateServiceProfessionalBodyServicesItemDurationMin),
  "linked": zod.boolean()
}))
})

export const zodremoveServiceFromProfessionalParams = zod.object({
  "serviceId": zod.string().uuid(),
  "professionalId": zod.string().uuid()
})

