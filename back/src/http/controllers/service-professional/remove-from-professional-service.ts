import { removeServiceFromProfessionalParamsSchema } from '@/schemas/services';
import { makeRemoveServiceFromProfessionalUseCase } from '@/use-cases/factories/make-remove-service-from-professional-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function removeFromProfessional(request: FastifyRequest, reply: FastifyReply) {
  const { professionalId, serviceId } = removeServiceFromProfessionalParamsSchema.parse(
    request.params,
  );

  const removeServiceFromProfessionalUseCase = makeRemoveServiceFromProfessionalUseCase();

  await removeServiceFromProfessionalUseCase.execute({
    serviceId,
    professionalId,
  });

  return reply.status(204).send();
}
