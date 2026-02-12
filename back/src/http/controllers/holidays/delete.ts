import { FastifyRequest, FastifyReply } from 'fastify';
import { makeDeleteHolidayUseCase } from '@/use-cases/factories/make-delete-holiday-use-case';

export async function deleteHoliday(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteHolidayParamsSchema = z.object({
    holidayId: z.string(),
  });

  const { holidayId } = deleteHolidayParamsSchema.parse(request.params);

  const deleteHolidayUseCase = makeDeleteHolidayUseCase();

  await deleteHolidayUseCase.execute({
    holidayId,
    professionalId: request.user.professionalId!,
  });

  return reply.status(204).send();
}
