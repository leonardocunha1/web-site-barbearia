import {
  z as zod
} from 'zod';



export const zodcreateServiceBodyNameMin = 3;

export const zodcreateServiceBodyNameMax = 100;
export const zodcreateServiceBodyDescriptionMax = 500;
export const zodcreateServiceBodyCategoryMax = 50;
export const zodcreateServiceBodyActiveDefault = true;

export const zodcreateServiceBody = zod.object({
  "name": zod.string().min(zodcreateServiceBodyNameMin).max(zodcreateServiceBodyNameMax),
  "description": zod.string().max(zodcreateServiceBodyDescriptionMax).optional(),
  "category": zod.string().max(zodcreateServiceBodyCategoryMax).optional(),
  "active": zod.boolean().default(zodcreateServiceBodyActiveDefault)
})

export const zodlistServicesQueryPageDefault = 1;
export const zodlistServicesQueryPageMin = 0;
export const zodlistServicesQueryLimitDefault = 10;
export const zodlistServicesQueryLimitMin = 0;

export const zodlistServicesQueryLimitMax = 100;
export const zodlistServicesQuerySortDirectionDefault = "asc";export const zodlistServicesQueryNameMax = 100;
export const zodlistServicesQueryCategoryMax = 50;


export const zodlistServicesQueryParams = zod.object({
  "page": zod.number().min(zodlistServicesQueryPageMin).default(zodlistServicesQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistServicesQueryLimitMin).max(zodlistServicesQueryLimitMax).default(zodlistServicesQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortDirection": zod.enum(['asc', 'desc']).default(zodlistServicesQuerySortDirectionDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "name": zod.string().max(zodlistServicesQueryNameMax).optional(),
  "category": zod.string().max(zodlistServicesQueryCategoryMax).optional(),
  "active": zod.boolean().optional(),
  "professionalId": zod.string().uuid().optional()
})

export const zodlistServicesResponse = zod.object({
  "services": zod.array(zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "description": zod.string().nullable(),
  "category": zod.string().nullable(),
  "active": zod.boolean()
})),
  "pagination": zod.object({
  "page": zod.number(),
  "limit": zod.number(),
  "total": zod.number(),
  "totalPages": zod.number()
})
})

export const zodgetServiceByIdParams = zod.object({
  "id": zod.string().uuid()
})

export const zodgetServiceByIdResponse = zod.object({
  "service": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "description": zod.string().optional(),
  "category": zod.string().optional(),
  "active": zod.boolean(),
  "createdAt": zod.string().datetime({}),
  "updatedAt": zod.string().datetime({}),
  "professionals": zod.array(zod.object({
  "id": zod.string().uuid(),
  "professional": zod.object({
  "id": zod.string().uuid(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string()
})
})
}))
})
})

export const zodupdateServiceByIdParams = zod.object({
  "id": zod.string().uuid()
})

export const zodupdateServiceByIdBodyNameMin = 3;

export const zodupdateServiceByIdBodyNameMax = 100;
export const zodupdateServiceByIdBodyDescriptionMax = 500;
export const zodupdateServiceByIdBodyDefaultPriceMin = 0;
export const zodupdateServiceByIdBodyDurationMin = 0;
export const zodupdateServiceByIdBodyCategoryMax = 50;


export const zodupdateServiceByIdBody = zod.object({
  "name": zod.string().min(zodupdateServiceByIdBodyNameMin).max(zodupdateServiceByIdBodyNameMax).optional(),
  "description": zod.string().max(zodupdateServiceByIdBodyDescriptionMax).optional(),
  "defaultPrice": zod.number().min(zodupdateServiceByIdBodyDefaultPriceMin).optional(),
  "duration": zod.number().min(zodupdateServiceByIdBodyDurationMin).optional(),
  "category": zod.string().max(zodupdateServiceByIdBodyCategoryMax).optional(),
  "active": zod.boolean().optional()
})

export const zodupdateServiceByIdResponse = zod.object({
  "service": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "description": zod.string().nullable(),
  "category": zod.string().nullable(),
  "active": zod.boolean()
})
})

export const zoddeleteServiceByIdParams = zod.object({
  "id": zod.string().uuid()
})

export const zoddeleteServiceByIdQueryPermanentDefault = false;

export const zoddeleteServiceByIdQueryParams = zod.object({
  "permanent": zod.boolean().optional()
})

export const zodtoggleServiceStatusByIdParams = zod.object({
  "id": zod.string().uuid()
})

export const zodtoggleServiceStatusByIdResponse = zod.enum(['null']).nullable().describe('Status do serviço atualizado com sucesso.')

