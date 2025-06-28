import {
  z as zod
} from 'zod';



/**
 * Registro de novo usuário.
 */
export const zodregisterUserBodyNomeMin = 3;
export const zodregisterUserBodySenhaMin = 6;


export const zodregisterUserBody = zod.object({
  "nome": zod.string().min(zodregisterUserBodyNomeMin),
  "email": zod.string().email(),
  "senha": zod.string().min(zodregisterUserBodySenhaMin),
  "role": zod.enum(['CLIENTE', 'PROFISSIONAL', 'ADMIN']).optional()
})

/**
 * Autenticação do usuário.
 */
export const zodloginUserBodySenhaMin = 6;


export const zodloginUserBody = zod.object({
  "email": zod.string().email(),
  "senha": zod.string().min(zodloginUserBodySenhaMin)
})

export const zodloginUserResponse = zod.object({
  "token": zod.string(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string(),
  "email": zod.string().email(),
  "telefone": zod.string().nullish(),
  "role": zod.enum(['CLIENTE', 'PROFISSIONAL', 'ADMIN']).optional(),
  "emailVerified": zod.boolean(),
  "active": zod.boolean(),
  "createdAt": zod.string().datetime({})
})
}).describe('Login bem-sucedido')

/**
 * Logout do usuário, removendo cookies de autenticação.
 */
export const zodlogoutUserResponse = zod.object({
  "message": zod.string()
}).describe('Logout realizado com sucesso.')

/**
 * Geração de um novo token de acesso com base no refresh token válido presente nos cookies.
 */
export const zodrefreshTokenResponse = zod.object({
  "token": zod.string()
}).describe('Novo token gerado com sucesso.')

