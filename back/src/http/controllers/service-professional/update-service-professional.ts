import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import {
  updateProfessionalServicesBodySchema,
  updateProfessionalServicesParamsSchema,
} from "@/schemas/services";
import { formatZodError } from "@/utils/formatZodError";
import { makeUpdateProfessionalServicesUseCase } from "@/use-cases/factories/make-update-service-professional-use-case";

export async function updateProfessionalServices(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { professionalId } = updateProfessionalServicesParamsSchema.parse(
      request.params
    );

    const { services } = updateProfessionalServicesBodySchema.parse(
      request.body
    );

    const useCase = makeUpdateProfessionalServicesUseCase();

    await useCase.execute({ professionalId, services });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
