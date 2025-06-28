import { z } from 'zod';
import { paginationSchema } from './pagination';
import { Role } from '@prisma/client';

export const registerUserSchema = z.object({
  nome: z.string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string()
    .email({ message: 'Por favor, insira um e-mail válido' }),
  senha: z.string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  role: z.enum(['CLIENTE', 'PROFISSIONAL', 'ADMIN'], {
    message: 'O perfil deve ser CLIENTE, PROFISSIONAL ou ADMIN'
  }).optional(),
});

export const loginUserSchema = z.object({
  email: z.string()
    .email({ message: 'Por favor, insira um e-mail válido' }),
  senha: z.string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

export const userSchema = z.object({
  id: z.string()
    .uuid({ message: 'ID deve ser um UUID válido' }),
  nome: z.string(),
  email: z.string()
    .email({ message: 'E-mail inválido' }),
  telefone: z.string()
    .nullable()
    .optional(),
  role: z.enum(['CLIENTE', 'PROFISSIONAL', 'ADMIN'], {
    message: 'Perfil inválido'
  }).optional(),
  emailVerified: z.boolean(),
  active: z.boolean(),
  createdAt: z.date(),
});

export const updateProfileBodySchema = z.object({
  nome: z.string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    .optional(),
  email: z.string()
    .email({ message: 'Por favor, insira um e-mail válido' })
    .optional(),
  telefone: z.string()
    .optional()
    .nullable(),
});

export const listUsersQuerySchema = paginationSchema.extend({
  role: z.nativeEnum(Role, {
    message: 'Perfil de usuário inválido'
  }).optional(),
  name: z.string().optional(),
});

export const anonymizeUserParamsSchema = z.object({
  userId: z.string()
    .uuid({ message: 'ID do usuário deve ser um UUID válido' }), 
});

export const updatePasswordBodySchema = z.object({
  currentPassword: z.string()
    .min(6, { message: 'A senha atual deve ter pelo menos 6 caracteres' }),
  newPassword: z.string()
    .min(6, { message: 'A nova senha deve ter pelo menos 6 caracteres' }),
});