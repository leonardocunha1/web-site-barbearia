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
  "status": zod.enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED']),
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
export const zodlistUserBookingsQuerySortDirectionDefault = "asc";

export const zodlistUserBookingsQueryParams = zod.object({
  "page": zod.number().min(zodlistUserBookingsQueryPageMin).default(zodlistUserBookingsQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistUserBookingsQueryLimitMin).max(zodlistUserBookingsQueryLimitMax).default(zodlistUserBookingsQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortDirection": zod.enum(['asc', 'desc']).default(zodlistUserBookingsQuerySortDirectionDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "startDate": zod.string().datetime({}).optional(),
  "endDate": zod.string().datetime({}).optional(),
  "status": zod.enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED']).optional(),
  "sort": zod.array(zod.object({
  "field": zod.enum(['startDateTime', 'PROFESSIONAL', 'status', 'totalAmount']).describe('SortField'),
  "order": zod.enum(['asc', 'desc']).describe('SortOrder')
}).describe('SortSchema')).optional()
})

export const zodlistUserBookingsResponseBookingsItemNotesMax = 500;
export const zodlistUserBookingsResponseBookingsItemTotalAmountMin = 0;
export const zodlistUserBookingsResponseBookingsItemProfessionalUserNameMin = 2;
export const zodlistUserBookingsResponseBookingsItemUserNameMin = 2;
export const zodlistUserBookingsResponseBookingsItemItemsItemDurationMin = 0;
export const zodlistUserBookingsResponseBookingsItemItemsItemPriceMin = 0;
export const zodlistUserBookingsResponseBookingsItemItemsItemServiceProfessionalServiceNameMin = 2;
export const zodlistUserBookingsResponseTotalMin = 0;
export const zodlistUserBookingsResponsePageMin = 0;
export const zodlistUserBookingsResponseLimitMin = 0;
export const zodlistUserBookingsResponseTotalPagesMin = 0;


export const zodlistUserBookingsResponse = zod.object({
  "bookings": zod.array(zod.object({
  "id": zod.string().uuid(),
  "userId": zod.string().uuid(),
  "startDateTime": zod.string().datetime({}),
  "endDateTime": zod.string().datetime({}),
  "status": zod.enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED']),
  "notes": zod.string().max(zodlistUserBookingsResponseBookingsItemNotesMax).nullish(),
  "totalAmount": zod.number().min(zodlistUserBookingsResponseBookingsItemTotalAmountMin).nullish(),
  "canceledAt": zod.string().datetime({}).nullish(),
  "confirmedAt": zod.string().datetime({}).nullish(),
  "updatedAt": zod.string().datetime({}),
  "createdAt": zod.string().datetime({}),
  "professional": zod.object({
  "id": zod.string().uuid(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string().min(zodlistUserBookingsResponseBookingsItemProfessionalUserNameMin)
})
}),
  "user": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string().min(zodlistUserBookingsResponseBookingsItemUserNameMin)
}),
  "items": zod.array(zod.object({
  "id": zod.string().uuid(),
  "duration": zod.number().min(zodlistUserBookingsResponseBookingsItemItemsItemDurationMin),
  "price": zod.number().min(zodlistUserBookingsResponseBookingsItemItemsItemPriceMin),
  "serviceProfessional": zod.object({
  "id": zod.string().uuid(),
  "service": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string().min(zodlistUserBookingsResponseBookingsItemItemsItemServiceProfessionalServiceNameMin)
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
export const zodlistProfessionalBookingsQuerySortDirectionDefault = "asc";

export const zodlistProfessionalBookingsQueryParams = zod.object({
  "page": zod.number().min(zodlistProfessionalBookingsQueryPageMin).default(zodlistProfessionalBookingsQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistProfessionalBookingsQueryLimitMin).max(zodlistProfessionalBookingsQueryLimitMax).default(zodlistProfessionalBookingsQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortDirection": zod.enum(['asc', 'desc']).default(zodlistProfessionalBookingsQuerySortDirectionDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "startDate": zod.string().datetime({}).optional(),
  "endDate": zod.string().datetime({}).optional(),
  "status": zod.enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED']).optional(),
  "sort": zod.array(zod.object({
  "field": zod.enum(['startDateTime', 'PROFESSIONAL', 'status', 'totalAmount']).describe('SortField'),
  "order": zod.enum(['asc', 'desc']).describe('SortOrder')
}).describe('SortSchema')).optional()
})

export const zodlistProfessionalBookingsResponseBookingsItemNotesMax = 500;
export const zodlistProfessionalBookingsResponseBookingsItemTotalAmountMin = 0;
export const zodlistProfessionalBookingsResponseBookingsItemProfessionalUserNameMin = 2;
export const zodlistProfessionalBookingsResponseBookingsItemUserNameMin = 2;
export const zodlistProfessionalBookingsResponseBookingsItemItemsItemDurationMin = 0;
export const zodlistProfessionalBookingsResponseBookingsItemItemsItemPriceMin = 0;
export const zodlistProfessionalBookingsResponseBookingsItemItemsItemServiceProfessionalServiceNameMin = 2;
export const zodlistProfessionalBookingsResponseTotalMin = 0;
export const zodlistProfessionalBookingsResponsePageMin = 0;
export const zodlistProfessionalBookingsResponseLimitMin = 0;
export const zodlistProfessionalBookingsResponseTotalPagesMin = 0;


export const zodlistProfessionalBookingsResponse = zod.object({
  "bookings": zod.array(zod.object({
  "id": zod.string().uuid(),
  "userId": zod.string().uuid(),
  "startDateTime": zod.string().datetime({}),
  "endDateTime": zod.string().datetime({}),
  "status": zod.enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED']),
  "notes": zod.string().max(zodlistProfessionalBookingsResponseBookingsItemNotesMax).nullish(),
  "totalAmount": zod.number().min(zodlistProfessionalBookingsResponseBookingsItemTotalAmountMin).nullish(),
  "canceledAt": zod.string().datetime({}).nullish(),
  "confirmedAt": zod.string().datetime({}).nullish(),
  "updatedAt": zod.string().datetime({}),
  "createdAt": zod.string().datetime({}),
  "professional": zod.object({
  "id": zod.string().uuid(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string().min(zodlistProfessionalBookingsResponseBookingsItemProfessionalUserNameMin)
})
}),
  "user": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string().min(zodlistProfessionalBookingsResponseBookingsItemUserNameMin)
}),
  "items": zod.array(zod.object({
  "id": zod.string().uuid(),
  "duration": zod.number().min(zodlistProfessionalBookingsResponseBookingsItemItemsItemDurationMin),
  "price": zod.number().min(zodlistProfessionalBookingsResponseBookingsItemItemsItemPriceMin),
  "serviceProfessional": zod.object({
  "id": zod.string().uuid(),
  "service": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string().min(zodlistProfessionalBookingsResponseBookingsItemItemsItemServiceProfessionalServiceNameMin)
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

export const zodgetBookingByIdResponseBookingNotesMax = 500;
export const zodgetBookingByIdResponseBookingTotalAmountMin = 0;
export const zodgetBookingByIdResponseBookingProfessionalUserNameMin = 2;
export const zodgetBookingByIdResponseBookingUserNameMin = 2;
export const zodgetBookingByIdResponseBookingItemsItemDurationMin = 0;
export const zodgetBookingByIdResponseBookingItemsItemPriceMin = 0;
export const zodgetBookingByIdResponseBookingItemsItemServiceProfessionalServiceNameMin = 2;


export const zodgetBookingByIdResponse = zod.object({
  "booking": zod.object({
  "id": zod.string().uuid(),
  "userId": zod.string().uuid(),
  "startDateTime": zod.string().datetime({}),
  "endDateTime": zod.string().datetime({}),
  "status": zod.enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED']),
  "notes": zod.string().max(zodgetBookingByIdResponseBookingNotesMax).nullish(),
  "totalAmount": zod.number().min(zodgetBookingByIdResponseBookingTotalAmountMin).nullish(),
  "canceledAt": zod.string().datetime({}).nullish(),
  "confirmedAt": zod.string().datetime({}).nullish(),
  "updatedAt": zod.string().datetime({}),
  "createdAt": zod.string().datetime({}),
  "professional": zod.object({
  "id": zod.string().uuid(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string().min(zodgetBookingByIdResponseBookingProfessionalUserNameMin)
})
}),
  "user": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string().min(zodgetBookingByIdResponseBookingUserNameMin)
}),
  "items": zod.array(zod.object({
  "id": zod.string().uuid(),
  "duration": zod.number().min(zodgetBookingByIdResponseBookingItemsItemDurationMin),
  "price": zod.number().min(zodgetBookingByIdResponseBookingItemsItemPriceMin),
  "serviceProfessional": zod.object({
  "id": zod.string().uuid(),
  "service": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string().min(zodgetBookingByIdResponseBookingItemsItemServiceProfessionalServiceNameMin)
})
})
}).describe('Item de agendamento')).min(1)
}).describe('Agendamento completo')
})

