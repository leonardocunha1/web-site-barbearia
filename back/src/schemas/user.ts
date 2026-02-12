import { z } from 'zod';
import { paginationSchema } from './pagination';
import { Role } from '@prisma/client';

export const registerUserSchema = z.object({ name: z.string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    .transform(nome => nome.trim()),
    
  email: z.string()
    .email({ message: 'Por favor, insira um e-mail válido' })
    .toLowerCase()
    .transform(email => email.trim()),
    
  senha: z.string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    .max(100, { message: 'Senha muito longa' }),
    
  role: z.enum(['CLIENT', 'PROFESSIONAL', 'ADMIN'], {
    message: 'O perfil deve ser CLIENTE, PROFISSIONAL ou ADMIN'
  }).default('CLIENT'),
    
  telefone: z.string()
    .min(1, { message: 'Telefone é obrigatório' })
    // Validação do formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
    .refine((val) => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(val), {
      message: 'Formato inválido. Use (DDD) XXXXX-XXXX'
    })
    // Validação do comprimento (10 ou 11 dígitos)
    .refine((val) => {
      const digits = val.replace(/\D/g, '');
      return digits.length === 10 || digits.length === 11;
    }, {
      message: 'Telefone deve ter 10 ou 11 dígitos (incluindo DDD)'
    })
    // Formatação consistente
    .transform(val => {
      const digits = val.replace(/\D/g, '');
      const ddd = digits.substring(0, 2);
      const numero = digits.substring(2);
      
      return numero.length === 8
        ? `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`
        : `(${ddd}) ${numero.substring(0, 5)}-${numero.substring(5)}`;
    })
});

export const loginUserSchema = z.object({
  email: z.string()
    .email({ message: 'Por favor, insira um e-mail válido' }),
  senha: z.string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

export const userSchema = z.object({
  id: z.string()
    .uuid({ message: 'ID deve ser um UUID válido' }), name: z.string(),
  email: z.string()
    .email({ message: 'E-mail inválido' }),
  telefone: z.string()
    .nullable()
    .optional(),
  role: z.enum(['CLIENT', 'PROFESSIONAL', 'ADMIN'], {
    message: 'Perfil inválido'
  }).optional(),
  emailVerified: z.boolean(),
  active: z.boolean(),
  createdAt: z.date(),
});

export const updateProfileBodySchema = z.object({ name: z.string()
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