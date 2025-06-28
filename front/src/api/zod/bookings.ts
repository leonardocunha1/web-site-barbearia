import {
  z as zod
} from 'zod';



/**
 * Criação de um novo agendamento.
 */
export const zodcreateBookingBodyNotesMax = 500;
export const zodcreateBookingBodyUseBonusPointsDefault = false;export const zodcreateBookingBodyCouponCodeMax = 50;


export const zodcreateBookingBody = zod.object({
  "professionalId": zod.string().uuid(),
  "services": zod.array(zod.object({
  "serviceId": zod.string().uuid()
})).min(1),
  "startDateTime": zod.string().datetime({}),
  "notes": zod.string().max(zodcreateBookingBodyNotesMax).optional(),
  "useBonusPoints": zod.boolean().optional(),
  "couponCode": zod.string().max(zodcreateBookingBodyCouponCodeMax).optional()
}).describe('Dados para criação de agendamento')

/**
 * Atualiza o status de um agendamento (apenas para profissionais)
 */
export const zodupdateBookingStatusParams = zod.object({
  "bookingId": zod.string().uuid()
})

export const zodupdateBookingStatusBodyReasonMax = 255;


export const zodupdateBookingStatusBody = zod.object({
  "status": zod.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']),
  "reason": zod.string().max(zodupdateBookingStatusBodyReasonMax).optional()
}).describe('Dados para atualização de status de agendamento')

export const zodupdateBookingStatusResponse = zod.object({
  "message": zod.string()
})

/**
 * Lista os agendamentos do usuário autenticado
 */
export const zodlistUserBookingsQueryPageDefault = 1;
export const zodlistUserBookingsQueryPageMin = 0;
export const zodlistUserBookingsQueryLimitDefault = 10;
export const zodlistUserBookingsQueryLimitMin = 0;

export const zodlistUserBookingsQueryLimitMax = 100;
export const zodlistUserBookingsQuerySortOrderDefault = "asc";

export const zodlistUserBookingsQueryParams = zod.object({
  "page": zod.number().min(zodlistUserBookingsQueryPageMin).default(zodlistUserBookingsQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistUserBookingsQueryLimitMin).max(zodlistUserBookingsQueryLimitMax).default(zodlistUserBookingsQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortOrder": zod.enum(['asc', 'desc']).default(zodlistUserBookingsQuerySortOrderDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "startDate": zod.string().datetime({}).optional(),
  "endDate": zod.string().datetime({}).optional(),
  "status": zod.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']).optional(),
  "sort": zod.array(zod.object({
  "field": zod.enum(['dataHoraInicio', 'profissional', 'status', 'valorFinal']).describe('SortField'),
  "order": zod.enum(['asc', 'desc']).describe('SortOrder')
}).describe('SortSchema')).optional()
})

export const zodlistUserBookingsResponseBookingsItemObservacoesMax = 500;
export const zodlistUserBookingsResponseBookingsItemValorFinalMin = 0;
export const zodlistUserBookingsResponseBookingsItemProfissionalUserNomeMin = 2;
export const zodlistUserBookingsResponseBookingsItemUserNomeMin = 2;
export const zodlistUserBookingsResponseBookingsItemItemsItemDuracaoMin = 0;
export const zodlistUserBookingsResponseBookingsItemItemsItemPrecoMin = 0;
export const zodlistUserBookingsResponseBookingsItemItemsItemServiceProfessionalServiceNomeMin = 2;
export const zodlistUserBookingsResponseTotalMin = 0;
export const zodlistUserBookingsResponsePageMin = 0;
export const zodlistUserBookingsResponseLimitMin = 0;
export const zodlistUserBookingsResponseTotalPagesMin = 0;


export const zodlistUserBookingsResponse = zod.object({
  "bookings": zod.array(zod.object({
  "id": zod.string().uuid(),
  "usuarioId": zod.string().uuid(),
  "dataHoraInicio": zod.string().datetime({}),
  "dataHoraFim": zod.string().datetime({}),
  "status": zod.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']),
  "observacoes": zod.string().max(zodlistUserBookingsResponseBookingsItemObservacoesMax).nullish(),
  "valorFinal": zod.number().min(zodlistUserBookingsResponseBookingsItemValorFinalMin).nullish(),
  "canceledAt": zod.string().datetime({}).nullish(),
  "confirmedAt": zod.string().datetime({}).nullish(),
  "updatedAt": zod.string().datetime({}),
  "createdAt": zod.string().datetime({}),
  "profissional": zod.object({
  "id": zod.string().uuid(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string().min(zodlistUserBookingsResponseBookingsItemProfissionalUserNomeMin)
})
}),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string().min(zodlistUserBookingsResponseBookingsItemUserNomeMin)
}),
  "items": zod.array(zod.object({
  "id": zod.string().uuid(),
  "duracao": zod.number().min(zodlistUserBookingsResponseBookingsItemItemsItemDuracaoMin),
  "preco": zod.number().min(zodlistUserBookingsResponseBookingsItemItemsItemPrecoMin),
  "serviceProfessional": zod.object({
  "id": zod.string().uuid(),
  "service": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string().min(zodlistUserBookingsResponseBookingsItemItemsItemServiceProfessionalServiceNomeMin)
})
})
}).describe('Item de agendamento')).min(1)
}).describe('Agendamento completo')),
  "total": zod.number().min(zodlistUserBookingsResponseTotalMin),
  "page": zod.number().min(zodlistUserBookingsResponsePageMin),
  "limit": zod.number().min(zodlistUserBookingsResponseLimitMin),
  "totalPages": zod.number().min(zodlistUserBookingsResponseTotalPagesMin)
}).describe('Resposta paginada de agendamentos')

/**
 * Lista os agendamentos do profissional autenticado
 */
export const zodlistProfessionalBookingsQueryPageDefault = 1;
export const zodlistProfessionalBookingsQueryPageMin = 0;
export const zodlistProfessionalBookingsQueryLimitDefault = 10;
export const zodlistProfessionalBookingsQueryLimitMin = 0;

export const zodlistProfessionalBookingsQueryLimitMax = 100;
export const zodlistProfessionalBookingsQuerySortOrderDefault = "asc";

export const zodlistProfessionalBookingsQueryParams = zod.object({
  "page": zod.number().min(zodlistProfessionalBookingsQueryPageMin).default(zodlistProfessionalBookingsQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistProfessionalBookingsQueryLimitMin).max(zodlistProfessionalBookingsQueryLimitMax).default(zodlistProfessionalBookingsQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortOrder": zod.enum(['asc', 'desc']).default(zodlistProfessionalBookingsQuerySortOrderDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "startDate": zod.string().datetime({}).optional(),
  "endDate": zod.string().datetime({}).optional(),
  "status": zod.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']).optional(),
  "sort": zod.array(zod.object({
  "field": zod.enum(['dataHoraInicio', 'profissional', 'status', 'valorFinal']).describe('SortField'),
  "order": zod.enum(['asc', 'desc']).describe('SortOrder')
}).describe('SortSchema')).optional()
})

export const zodlistProfessionalBookingsResponseBookingsItemObservacoesMax = 500;
export const zodlistProfessionalBookingsResponseBookingsItemValorFinalMin = 0;
export const zodlistProfessionalBookingsResponseBookingsItemProfissionalUserNomeMin = 2;
export const zodlistProfessionalBookingsResponseBookingsItemUserNomeMin = 2;
export const zodlistProfessionalBookingsResponseBookingsItemItemsItemDuracaoMin = 0;
export const zodlistProfessionalBookingsResponseBookingsItemItemsItemPrecoMin = 0;
export const zodlistProfessionalBookingsResponseBookingsItemItemsItemServiceProfessionalServiceNomeMin = 2;
export const zodlistProfessionalBookingsResponseTotalMin = 0;
export const zodlistProfessionalBookingsResponsePageMin = 0;
export const zodlistProfessionalBookingsResponseLimitMin = 0;
export const zodlistProfessionalBookingsResponseTotalPagesMin = 0;


export const zodlistProfessionalBookingsResponse = zod.object({
  "bookings": zod.array(zod.object({
  "id": zod.string().uuid(),
  "usuarioId": zod.string().uuid(),
  "dataHoraInicio": zod.string().datetime({}),
  "dataHoraFim": zod.string().datetime({}),
  "status": zod.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']),
  "observacoes": zod.string().max(zodlistProfessionalBookingsResponseBookingsItemObservacoesMax).nullish(),
  "valorFinal": zod.number().min(zodlistProfessionalBookingsResponseBookingsItemValorFinalMin).nullish(),
  "canceledAt": zod.string().datetime({}).nullish(),
  "confirmedAt": zod.string().datetime({}).nullish(),
  "updatedAt": zod.string().datetime({}),
  "createdAt": zod.string().datetime({}),
  "profissional": zod.object({
  "id": zod.string().uuid(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string().min(zodlistProfessionalBookingsResponseBookingsItemProfissionalUserNomeMin)
})
}),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string().min(zodlistProfessionalBookingsResponseBookingsItemUserNomeMin)
}),
  "items": zod.array(zod.object({
  "id": zod.string().uuid(),
  "duracao": zod.number().min(zodlistProfessionalBookingsResponseBookingsItemItemsItemDuracaoMin),
  "preco": zod.number().min(zodlistProfessionalBookingsResponseBookingsItemItemsItemPrecoMin),
  "serviceProfessional": zod.object({
  "id": zod.string().uuid(),
  "service": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string().min(zodlistProfessionalBookingsResponseBookingsItemItemsItemServiceProfessionalServiceNomeMin)
})
})
}).describe('Item de agendamento')).min(1)
}).describe('Agendamento completo')),
  "total": zod.number().min(zodlistProfessionalBookingsResponseTotalMin),
  "page": zod.number().min(zodlistProfessionalBookingsResponsePageMin),
  "limit": zod.number().min(zodlistProfessionalBookingsResponseLimitMin),
  "totalPages": zod.number().min(zodlistProfessionalBookingsResponseTotalPagesMin)
}).describe('Resposta paginada de agendamentos')

/**
 * Busca os detalhes de um agendamento pelo ID.
 */
export const zodgetBookingByIdParams = zod.object({
  "bookingId": zod.string().uuid()
})

export const zodgetBookingByIdResponseBookingObservacoesMax = 500;
export const zodgetBookingByIdResponseBookingValorFinalMin = 0;
export const zodgetBookingByIdResponseBookingProfissionalUserNomeMin = 2;
export const zodgetBookingByIdResponseBookingUserNomeMin = 2;
export const zodgetBookingByIdResponseBookingItemsItemDuracaoMin = 0;
export const zodgetBookingByIdResponseBookingItemsItemPrecoMin = 0;
export const zodgetBookingByIdResponseBookingItemsItemServiceProfessionalServiceNomeMin = 2;


export const zodgetBookingByIdResponse = zod.object({
  "booking": zod.object({
  "id": zod.string().uuid(),
  "usuarioId": zod.string().uuid(),
  "dataHoraInicio": zod.string().datetime({}),
  "dataHoraFim": zod.string().datetime({}),
  "status": zod.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']),
  "observacoes": zod.string().max(zodgetBookingByIdResponseBookingObservacoesMax).nullish(),
  "valorFinal": zod.number().min(zodgetBookingByIdResponseBookingValorFinalMin).nullish(),
  "canceledAt": zod.string().datetime({}).nullish(),
  "confirmedAt": zod.string().datetime({}).nullish(),
  "updatedAt": zod.string().datetime({}),
  "createdAt": zod.string().datetime({}),
  "profissional": zod.object({
  "id": zod.string().uuid(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string().min(zodgetBookingByIdResponseBookingProfissionalUserNomeMin)
})
}),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string().min(zodgetBookingByIdResponseBookingUserNomeMin)
}),
  "items": zod.array(zod.object({
  "id": zod.string().uuid(),
  "duracao": zod.number().min(zodgetBookingByIdResponseBookingItemsItemDuracaoMin),
  "preco": zod.number().min(zodgetBookingByIdResponseBookingItemsItemPrecoMin),
  "serviceProfessional": zod.object({
  "id": zod.string().uuid(),
  "service": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string().min(zodgetBookingByIdResponseBookingItemsItemServiceProfessionalServiceNomeMin)
})
})
}).describe('Item de agendamento')).min(1)
}).describe('Agendamento completo')
})

