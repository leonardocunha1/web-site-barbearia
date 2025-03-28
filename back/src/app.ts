import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { usersRoutes } from './http/controllers/users/routes';
import fastifyCors from '@fastify/cors';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});

app.register(fastifyCookie);
app.register(fastifyCors, {
  origin: 'http://localhost:3000',
  credentials: true,
});

app.register(usersRoutes);

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

  reply.status(500).send({ message: 'Internal server error.' });
});
