import { FastifyRequest, FastifyReply } from 'fastify';
import { makeAddServiceToProfessionalUseCase } from '@/use-cases/factories/make-add-service-to-professional-use-case';
import { addServiceToProfessionalBodySchema } from '@/schemas/services';

const paramsSchema = z.object({
  professionalId: z.string().uuid(),
});

export async function addToProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { professionalId } = paramsSchema.parse(request.params);
  const { serviceId, preco, duracao } =
    addServiceToProfessionalBodySchema.parse(request.body);

  const addServiceToProfessionalUseCase = makeAddServiceToProfessionalUseCase();

  await addServiceToProfessionalUseCase.execute({
    serviceId,
    professionalId,
    preco,
    duracao,
  });

  return reply.status(201).send();
}
