import { FastifyRequest, FastifyReply } from 'fastify';
import {
  CouponSortField,
  CouponSortOrder,
  listCouponsQuerySchema,
} from '@/schemas/coupon';
import { makeListCouponsUseCase } from '@/use-cases/factories/make-list-coupons-use-case';

export async function listCoupons(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const {
    page,
    limit,
    sort,
    code,
    type,
    scope,
    active,
    startDate,
    endDate,
    professionalId,
    serviceId,
  } = listCouponsQuerySchema.parse(request.query);

  const sortCriteria: { field: CouponSortField; order: CouponSortOrder }[] =
    sort?.length ? sort : [{ field: 'createdAt', order: 'desc' }];

  const filters = {
    ...(code && { code }),
    ...(type && { type }),
    ...(scope && { scope }),
    ...(active !== undefined && { active }),
    ...(startDate && { startDate: new Date(startDate) }),
    ...(endDate && { endDate: new Date(endDate) }),
    ...(professionalId && { professionalId }),
    ...(serviceId && { serviceId }),
  };

  const listCouponsUseCase = makeListCouponsUseCase();

  const result = await listCouponsUseCase.execute({
    page,
    limit,
    sort: sortCriteria,
    filters,
  });

  return reply.status(200).send(result);
}
