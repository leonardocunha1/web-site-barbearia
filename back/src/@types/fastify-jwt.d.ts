import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string;
      role: 'ADMIN' | 'CLIENTE' | 'PROFISSIONAL';
    }; // user type is return type of `request.user` object
  }
}
