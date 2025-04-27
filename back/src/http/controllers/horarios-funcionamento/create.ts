import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { InvalidTimeFormatError } from '@/use-cases/errors/invalid-time-format-error';
import { InvalidBusinessHoursError } from '@/use-cases/errors/invalid-business-hours-error';
import { DuplicateBusinessHoursError } from '@/use-cases/errors/duplicate-business-hours-error';
import { makeCreateBusinessHoursUseCase } from '@/use-cases/factories/make-create-business-hours-use-case';

export async function createBusinessHours(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBusinessHoursBodySchema = z.object({
    professionalId: z.string(),
    diaSemana: z.number().int().min(0).max(6),
    abreAs: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Formato de hora inválido. Use "HH:MM".',
    }),
    fechaAs: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Formato de hora inválido. Use "HH:MM".',
    }),
    pausaInicio: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .nullable()
      .optional(),
    pausaFim: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .nullable()
      .optional(),
  });

  const { professionalId, diaSemana, abreAs, fechaAs, pausaInicio, pausaFim } =
    createBusinessHoursBodySchema.parse(request.body);

  try {
    const createBusinessHoursUseCase = makeCreateBusinessHoursUseCase();

    const businessHours = await createBusinessHoursUseCase.execute({
      professionalId,
      diaSemana,
      abreAs,
      fechaAs,
      pausaInicio,
      pausaFim,
    });

    return reply.status(201).send(businessHours);
  } catch (err) {
    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof InvalidTimeFormatError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof InvalidBusinessHoursError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof DuplicateBusinessHoursError) {
      return reply.status(409).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: err.format(),
      });
    }

    throw err;
  }
}
