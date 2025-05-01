import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { InvalidBusinessHoursError } from '@/use-cases/errors/invalid-business-hours-error';
import { InvalidTimeFormatError } from '@/use-cases/errors/invalid-time-format-error';
import { makeUpdateBusinessHoursUseCase } from '@/use-cases/factories/make-update-business-hours-use-case';
import { formatZodError } from '@/utils/formatZodError';

export async function updateBusinessHours(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateBusinessHoursParamsSchema = z.object({
    professionalId: z.string().uuid(),
  });

  const updateBusinessHoursBodySchema = z.object({
    diaSemana: z.number().int().min(0).max(6),
    abreAs: z.string().optional(),
    fechaAs: z.string().optional(),
    pausaInicio: z.string().nullable().optional(),
    pausaFim: z.string().nullable().optional(),
  });

  const { professionalId } = updateBusinessHoursParamsSchema.parse(
    request.params,
  );
  const body = updateBusinessHoursBodySchema.parse(request.body);

  try {
    const updateBusinessHoursUseCase = makeUpdateBusinessHoursUseCase();

    const businessHours = await updateBusinessHoursUseCase.execute({
      professionalId,
      ...body,
    });

    return reply.status(200).send({ businessHours });
  } catch (err) {
    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (
      err instanceof InvalidBusinessHoursError ||
      err instanceof InvalidTimeFormatError
    ) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
