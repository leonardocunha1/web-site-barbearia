import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { usersRoutes } from './http/controllers/users/routes';
import fastifyCors from '@fastify/cors';
import { professionalsRoutes } from './http/controllers/professionals/routes';
import { servicesRoutes } from './http/controllers/services/routes';
import { bookingsRoutes } from './http/controllers/bookings/routes';
import { authRoutes } from './http/controllers/auth/routes';
import { tokenRoutes } from './http/controllers/tokens/routes';
import { holidayRoutes } from './http/controllers/feriados/routes';
import { businessHoursRoutes } from './http/controllers/horarios-funcionamento/routes';
import { serviceProfessionalRoutes } from './http/controllers/service-professional/routes';
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { bonusRoutes } from './http/controllers/bonus/routes';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

// https://www.youtube.com/watch?v=mULWHLquYP0&list=LL&index=3&t=943s&ab_channel=Rocketseat -> video para entender como que funciona a configuração do swagger
// essas duas linhas abaixo são para o fastify usar o zod como provider de validação e serialização
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API Barber Shop',
      description: 'API para agendamento de serviços de barbearia',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '50m',
  },
});
app.register(fastifyCors, {
  origin: '*',
  credentials: true,
});

app.register(usersRoutes);
app.register(professionalsRoutes);
app.register(servicesRoutes);
app.register(bookingsRoutes);
app.register(tokenRoutes);
app.register(authRoutes);
app.register(businessHoursRoutes);
app.register(holidayRoutes);
app.register(serviceProfessionalRoutes);
app.register(bonusRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'prod') {
    console.error(error);
  } else {
    // TODO. Aqui poderia ser enviado um email para o time de desenvolvimento.
  }

  reply.status(500).send({ message: 'Erro genérico' });
});
