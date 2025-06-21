import {
  z as zod
} from 'zod';



/**
 * Atualiza o perfil do usuário logado.
 */
export const zodundefinedBodyNomeMin = 3;


export const zodundefinedBody = zod.object({
  "nome": zod.string().min(zodundefinedBodyNomeMin).optional(),
  "email": zod.string().email().optional(),
  "telefone": zod.string().nullish()
})

/**
 * Atualiza a senha do usuário logado.
 */
export const zodundefinedBodyCurrentPasswordMin = 6;
export const zodundefinedBodyNewPasswordMin = 6;


export const zodundefinedBody = zod.object({
  "currentPassword": zod.string().min(zodundefinedBodyCurrentPasswordMin),
  "newPassword": zod.string().min(zodundefinedBodyNewPasswordMin)
})

/**
 * Envia um e-mail de verificação.
 */
export const zodundefinedBody = zod.object({
  "email": zod.string().email()
})

/**
 * Envia um e-mail para redefinição de senha.
 */
export const zodundefinedBody = zod.object({
  "email": zod.string().email()
})

/**
 * Redefine a senha do usuário.
 */
export const zodundefinedBodyNewPasswordMinOne = 6;


export const zodundefinedBody = zod.object({
  "token": zod.string(),
  "newPassword": zod.string().min(zodundefinedBodyNewPasswordMinOne)
})

