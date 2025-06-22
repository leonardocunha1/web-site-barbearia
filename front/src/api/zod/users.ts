import {
  z as zod
} from 'zod';



/**
 * Retorna o perfil do usuário logado.
 */
export const zodgetUserProfileResponse = zod.object({
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string(),
  "email": zod.string().email().optional(),
  "telefone": zod.string().nullish(),
  "role": zod.enum(['CLIENTE', 'PROFISSIONAL', 'ADMIN']).optional(),
  "emailVerified": zod.boolean(),
  "active": zod.boolean(),
  "createdAt": zod.string().datetime({})
})
})

/**
 * Atualiza o perfil do usuário logado.
 */
export const zodupdateUserProfileBodyNomeMin = 3;


export const zodupdateUserProfileBody = zod.object({
  "nome": zod.string().min(zodupdateUserProfileBodyNomeMin).optional(),
  "email": zod.string().email().optional(),
  "telefone": zod.string().nullish()
})

export const zodupdateUserProfileResponse = zod.enum(['null']).nullable().describe('Usuário atualizado com sucesso.')

/**
 * Listar usuários
 */
export const zodlistUsersQueryPageDefault = 1;
export const zodlistUsersQueryPageMin = 0;
export const zodlistUsersQueryLimitDefault = 10;
export const zodlistUsersQueryLimitMin = 0;

export const zodlistUsersQueryLimitMax = 100;
export const zodlistUsersQuerySortOrderDefault = "asc";

export const zodlistUsersQueryParams = zod.object({
  "page": zod.number().min(zodlistUsersQueryPageMin).default(zodlistUsersQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistUsersQueryLimitMin).max(zodlistUsersQueryLimitMax).default(zodlistUsersQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortOrder": zod.enum(['asc', 'desc']).default(zodlistUsersQuerySortOrderDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "role": zod.enum(['ADMIN', 'CLIENTE', 'PROFISSIONAL']).optional(),
  "name": zod.string().optional()
})

export const zodlistUsersResponse = zod.object({
  "users": zod.array(zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string(),
  "email": zod.string().email().optional(),
  "telefone": zod.string().nullish(),
  "role": zod.enum(['CLIENTE', 'PROFISSIONAL', 'ADMIN']).optional(),
  "emailVerified": zod.boolean(),
  "active": zod.boolean(),
  "createdAt": zod.string().datetime({})
})),
  "page": zod.number(),
  "limit": zod.number(),
  "total": zod.number(),
  "totalPages": zod.number()
})

/**
 * Anonimiza um usuário.
 */
export const zodanonymizeUserParams = zod.object({
  "userId": zod.string().uuid()
})

/**
 * Atualiza a senha do usuário logado.
 */
export const zodupdateUserPasswordBodyCurrentPasswordMin = 6;
export const zodupdateUserPasswordBodyNewPasswordMin = 6;


export const zodupdateUserPasswordBody = zod.object({
  "currentPassword": zod.string().min(zodupdateUserPasswordBodyCurrentPasswordMin),
  "newPassword": zod.string().min(zodupdateUserPasswordBodyNewPasswordMin)
})

export const zodupdateUserPasswordResponse = zod.enum(['null']).nullable().describe('Senha atualizada com sucesso.')

/**
 * Verifica o e-mail do usuário.
 */
export const zodverifyUserEmailQueryParams = zod.object({
  "token": zod.string().uuid()
})

export const zodverifyUserEmailResponse = zod.object({
  "message": zod.string()
})

/**
 * Envia um e-mail de verificação.
 */
export const zodsendUserVerificationEmailBody = zod.object({
  "email": zod.string().email()
})

export const zodsendUserVerificationEmailResponse = zod.object({
  "message": zod.string()
})

/**
 * Envia um e-mail para redefinição de senha.
 */
export const zodsendForgotPasswordEmailBody = zod.object({
  "email": zod.string().email()
})

export const zodsendForgotPasswordEmailResponse = zod.object({
  "message": zod.string()
})

/**
 * Redefine a senha do usuário.
 */
export const zodresetUserPasswordBodyNewPasswordMin = 6;


export const zodresetUserPasswordBody = zod.object({
  "token": zod.string(),
  "newPassword": zod.string().min(zodresetUserPasswordBodyNewPasswordMin)
})

export const zodresetUserPasswordResponse = zod.object({
  "message": zod.string()
})

