import { FastifyRequest, FastifyReply } from "fastify";
import {
  updateProfessionalServicesBodySchema,
  updateProfessionalServicesParamsSchema,
} from "@/schemas/services";
import { makeUpdateProfessionalServicesUseCase } from "@/use-cases/factories/make-update-service-professional-use-case";

export async function updateProfessionalServices(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { professionalId } = updateProfessionalServicesParamsSchema.parse(
    request.params
  );

  const { services } = updateProfessionalServicesBodySchema.parse(
    request.body
  );

  const useCase = makeUpdateProfessionalServicesUseCase();

  await useCase.execute({ professionalId, services });

  return reply.status(204).send();
}
