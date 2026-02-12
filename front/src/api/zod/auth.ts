import {
  z as zod
} from 'zod';



/**
 * Registro de novo usuário.
 */
export const zodregisterUserBodyNameMin = 3;
export const zodregisterUserBodyPasswordMin = 6;

export const zodregisterUserBodyPasswordMax = 100;
export const zodregisterUserBodyRoleDefault = "CLIENT";

export const zodregisterUserBody = zod.object({
  "name": zod.string().min(zodregisterUserBodyNameMin),
  "email": zod.string().email(),
  "password": zod.string().min(zodregisterUserBodyPasswordMin).max(zodregisterUserBodyPasswordMax),
  "role": zod.enum(['CLIENT', 'PROFESSIONAL', 'ADMIN']).default(zodregisterUserBodyRoleDefault),
  "phone": zod.string().min(1)
})

/**
 * Autenticação do usuário.
 */
export const zodloginUserBodyPasswordMin = 6;


export const zodloginUserBody = zod.object({
  "email": zod.string().email(),
  "password": zod.string().min(zodloginUserBodyPasswordMin)
})

export const zodloginUserResponse = zod.object({
  "token": zod.string(),
  "refreshToken": zod.string(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "name": zod.string(),
  "email": zod.string().email(),
  "phone": zod.string().nullish(),
  "role": zod.enum(['CLIENT', 'PROFESSIONAL', 'ADMIN']).optional(),
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
  "token": zod.string(),
  "refreshToken": zod.string()
}).describe('Novo token gerado com sucesso.')

