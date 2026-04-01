import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string;
      role: 'ADMIN' | 'CLIENT' | 'PROFESSIONAL';
      professionalId?: string;
      tokenType: 'access' | 'refresh';
    }; // user type is return type of `request.user` object
  }
}
