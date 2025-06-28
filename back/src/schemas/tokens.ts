import { z } from 'zod';

export const verifyEmailQuerySchema = z.object({
  token: z.string()
    .uuid({ message: 'O token de verificação deve ser um UUID válido' }),
});

export const sendVerificationEmailBodySchema = z.object({
  email: z.string()
    .email({ message: 'Por favor, forneça um endereço de e-mail válido' }),
});

export const forgotPasswordBodySchema = z.object({
  email: z.string()
    .email({ message: 'Por favor, insira um e-mail válido para recuperação' }),
});

export const resetPasswordBodySchema = z.object({
  token: z.string()
    .min(1, { message: 'O token de redefinição é obrigatório' }),
  newPassword: z.string()
    .min(6, { 
      message: 'A nova senha deve conter no mínimo 6 caracteres' 
    })
    .refine(
      password => /[A-Z]/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(password),
      {
        message: 'A senha deve conter pelo menos uma letra maiúscula ou caractere especial para maior segurança'
      }
    ),
});