import {
  z as zod
} from 'zod';



export const zodcreateServiceBodyNomeMin = 3;

export const zodcreateServiceBodyNomeMax = 100;
export const zodcreateServiceBodyDescricaoMax = 500;
export const zodcreateServiceBodyCategoriaMax = 50;


export const zodcreateServiceBody = zod.object({
  "nome": zod.string().min(zodcreateServiceBodyNomeMin).max(zodcreateServiceBodyNomeMax),
  "descricao": zod.string().max(zodcreateServiceBodyDescricaoMax).optional(),
  "categoria": zod.string().max(zodcreateServiceBodyCategoriaMax).optional()
})

export const zodlistServicesQueryPageDefault = 1;
export const zodlistServicesQueryPageMin = 0;
export const zodlistServicesQueryLimitDefault = 10;
export const zodlistServicesQueryLimitMin = 0;

export const zodlistServicesQueryLimitMax = 100;
export const zodlistServicesQuerySortOrderDefault = "asc";export const zodlistServicesQueryNomeMax = 100;
export const zodlistServicesQueryCategoriaMax = 50;


export const zodlistServicesQueryParams = zod.object({
  "page": zod.number().min(zodlistServicesQueryPageMin).default(zodlistServicesQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistServicesQueryLimitMin).max(zodlistServicesQueryLimitMax).default(zodlistServicesQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortOrder": zod.enum(['asc', 'desc']).default(zodlistServicesQuerySortOrderDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "nome": zod.string().max(zodlistServicesQueryNomeMax).optional(),
  "categoria": zod.string().max(zodlistServicesQueryCategoriaMax).optional(),
  "ativo": zod.boolean().optional(),
  "professionalId": zod.string().uuid().optional()
})

export const zodlistServicesResponse = zod.object({
  "services": zod.array(zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string(),
  "descricao": zod.string().optional(),
  "categoria": zod.string().optional(),
  "ativo": zod.boolean(),
  "createdAt": zod.string().datetime({}),
  "updatedAt": zod.string().datetime({})
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
  "nome": zod.string(),
  "descricao": zod.string().optional(),
  "categoria": zod.string().optional(),
  "ativo": zod.boolean(),
  "createdAt": zod.string().datetime({}),
  "updatedAt": zod.string().datetime({}),
  "profissionais": zod.array(zod.object({
  "id": zod.string().uuid(),
  "professional": zod.object({
  "id": zod.string().uuid(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string()
})
})
}))
})
})

export const zodupdateServiceByIdParams = zod.object({
  "id": zod.string().uuid()
})

export const zodupdateServiceByIdBodyNomeMin = 3;

export const zodupdateServiceByIdBodyNomeMax = 100;
export const zodupdateServiceByIdBodyDescricaoMax = 500;
export const zodupdateServiceByIdBodyPrecoPadraoMin = 0;
export const zodupdateServiceByIdBodyDuracaoMin = 0;
export const zodupdateServiceByIdBodyCategoriaMax = 50;


export const zodupdateServiceByIdBody = zod.object({
  "nome": zod.string().min(zodupdateServiceByIdBodyNomeMin).max(zodupdateServiceByIdBodyNomeMax).optional(),
  "descricao": zod.string().max(zodupdateServiceByIdBodyDescricaoMax).optional(),
  "precoPadrao": zod.number().min(zodupdateServiceByIdBodyPrecoPadraoMin).optional(),
  "duracao": zod.number().min(zodupdateServiceByIdBodyDuracaoMin).optional(),
  "categoria": zod.string().max(zodupdateServiceByIdBodyCategoriaMax).optional(),
  "ativo": zod.boolean().optional()
})

export const zodupdateServiceByIdResponse = zod.object({
  "service": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string(),
  "descricao": zod.string().optional(),
  "categoria": zod.string().optional(),
  "ativo": zod.boolean(),
  "createdAt": zod.string().datetime({}),
  "updatedAt": zod.string().datetime({})
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

