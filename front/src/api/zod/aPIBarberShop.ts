import { z as zod } from "zod";

/**
 * Atualiza o perfil do usuário logado.
 */
export const zodundefinedBodyNomeMin = 3;

export const zodundefinedBody = zod.object({
  nome: zod.string().min(zodundefinedBodyNomeMin).optional(),
  email: zod.string().email().optional(),
  telefone: zod.string().nullish(),
});

/**
 * Atualiza a senha do usuário logado.
 */
export const zodundefinedBodyCurrentPasswordMin = 6;
export const zodundefinedBodyNewPasswordMin = 6;

export const zodundefinedBody = zod.object({
  currentPassword: zod.string().min(zodundefinedBodyCurrentPasswordMin),
  newPassword: zod.string().min(zodundefinedBodyNewPasswordMin),
});

export const zodundefinedBodyEspecialidadeMin = 3;

export const zodundefinedBody = zod.object({
  userId: zod.string().uuid(),
  especialidade: zod.string().min(zodundefinedBodyEspecialidadeMin),
  bio: zod.string().optional(),
  documento: zod.string().optional(),
  registro: zod.string().optional(),
  avatarUrl: zod.string().url().optional(),
});

export const zodundefinedBodyEspecialidadeMinOne = 3;

export const zodundefinedBody = zod.object({
  especialidade: zod
    .string()
    .min(zodundefinedBodyEspecialidadeMinOne)
    .optional(),
  bio: zod.string().nullish(),
  documento: zod.string().nullish(),
  registro: zod.string().nullish(),
  ativo: zod.boolean().optional(),
  avatarUrl: zod.string().url().nullish(),
});

export const zodundefinedBody = zod.object({
  nome: zod.string(),
  descricao: zod.string().optional(),
  categoria: zod.string().optional(),
});

export const zodundefinedBodyNomeMinTwo = 3;
export const zodundefinedBodyPrecoPadraoMin = 0;
export const zodundefinedBodyDuracaoMin = 0;

export const zodundefinedBody = zod.object({
  nome: zod.string().min(zodundefinedBodyNomeMinTwo).optional(),
  descricao: zod.string().optional(),
  precoPadrao: zod.number().min(zodundefinedBodyPrecoPadraoMin).optional(),
  duracao: zod.number().min(zodundefinedBodyDuracaoMin).optional(),
  categoria: zod.string().optional(),
  ativo: zod.boolean().optional(),
});

/**
 * Criação de um novo agendamento.
 */
export const zodundefinedBodyNotesMax = 500;
export const zodundefinedBodyUseBonusPointsDefault = false;
export const zodundefinedBodyCouponCodeMax = 50;

export const zodundefinedBody = zod.object({
  professionalId: zod.string().uuid(),
  services: zod.array(
    zod.object({
      serviceId: zod.string().uuid(),
    }),
  ),
  startDateTime: zod.string().datetime({}),
  notes: zod.string().max(zodundefinedBodyNotesMax).optional(),
  useBonusPoints: zod.boolean().optional(),
  couponCode: zod.string().max(zodundefinedBodyCouponCodeMax).optional(),
});

/**
 * Atualiza o status de um agendamento (apenas para profissionais)
 */
export const zodundefinedBodyReasonMax = 255;

export const zodundefinedBody = zod.object({
  status: zod.enum(["PENDENTE", "CONFIRMADO", "CANCELADO", "CONCLUIDO"]),
  reason: zod.string().max(zodundefinedBodyReasonMax).optional(),
});

/**
 * Envia um e-mail de verificação.
 */
export const zodundefinedBody = zod.object({
  email: zod.string().email(),
});

/**
 * Envia um e-mail para redefinição de senha.
 */
export const zodundefinedBody = zod.object({
  email: zod.string().email(),
});

/**
 * Redefine a senha do usuário.
 */
export const zodundefinedBodyNewPasswordMinOne = 6;

export const zodundefinedBody = zod.object({
  token: zod.string(),
  newPassword: zod.string().min(zodundefinedBodyNewPasswordMinOne),
});

/**
 * Registro de novo usuário.
 */
export const zodundefinedBodyNomeMinThree = 3;
export const zodundefinedBodySenhaMin = 6;

export const zodundefinedBody = zod.object({
  nome: zod.string().min(zodundefinedBodyNomeMinThree),
  email: zod.string().email(),
  senha: zod.string().min(zodundefinedBodySenhaMin),
  role: zod.enum(["CLIENTE", "PROFISSIONAL", "ADMIN"]).optional(),
});

/**
 * Autenticação do usuário.
 */
export const zodundefinedBodySenhaMinOne = 6;

export const zodundefinedBody = zod.object({
  email: zod.string().email(),
  senha: zod.string().min(zodundefinedBodySenhaMinOne),
});

/**
 * Criação de um novo horário de funcionamento.
 */
export const zodundefinedBodyDiaSemanaMin = 0;

export const zodundefinedBodyDiaSemanaMax = 6;
export const zodundefinedBodyAbreAsRegExp = new RegExp(
  "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
);
export const zodundefinedBodyFechaAsRegExp = new RegExp(
  "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
);
export const zodundefinedBodyPausaInicioRegExp = new RegExp(
  "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
);
export const zodundefinedBodyPausaFimRegExp = new RegExp(
  "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
);

export const zodundefinedBody = zod.object({
  professionalId: zod.string(),
  diaSemana: zod
    .number()
    .min(zodundefinedBodyDiaSemanaMin)
    .max(zodundefinedBodyDiaSemanaMax),
  abreAs: zod.string().regex(zodundefinedBodyAbreAsRegExp),
  fechaAs: zod.string().regex(zodundefinedBodyFechaAsRegExp),
  pausaInicio: zod.string().regex(zodundefinedBodyPausaInicioRegExp).nullish(),
  pausaFim: zod.string().regex(zodundefinedBodyPausaFimRegExp).nullish(),
});

/**
 * Atualização de um horário de funcionamento.
 */
export const zodundefinedBodyDiaSemanaMinOne = 0;

export const zodundefinedBodyDiaSemanaMaxOne = 6;

export const zodundefinedBody = zod.object({
  diaSemana: zod
    .number()
    .min(zodundefinedBodyDiaSemanaMinOne)
    .max(zodundefinedBodyDiaSemanaMaxOne),
  abreAs: zod.string().optional(),
  fechaAs: zod.string().optional(),
  pausaInicio: zod.string().nullish(),
  pausaFim: zod.string().nullish(),
});

/**
 * Criação de um novo feriado.
 */
export const zodundefinedBodyNotesMaxOne = 500;
export const zodundefinedBodyUseBonusPointsDefaultOne = false;
export const zodundefinedBodyCouponCodeMaxOne = 50;

export const zodundefinedBody = zod.object({
  professionalId: zod.string().uuid(),
  services: zod.array(
    zod.object({
      serviceId: zod.string().uuid(),
    }),
  ),
  startDateTime: zod.string().datetime({}),
  notes: zod.string().max(zodundefinedBodyNotesMaxOne).optional(),
  useBonusPoints: zod.boolean().optional(),
  couponCode: zod.string().max(zodundefinedBodyCouponCodeMaxOne).optional(),
});

export const zodundefinedBodyPrecoMin = 0;
export const zodundefinedBodyDuracaoMinOne = 0;

export const zodundefinedBody = zod.object({
  serviceId: zod.string().uuid(),
  preco: zod.number().min(zodundefinedBodyPrecoMin),
  duracao: zod.number().min(zodundefinedBodyDuracaoMinOne),
});

export const zodundefinedBodyPrecoMinOne = 0;
export const zodundefinedBodyDuracaoMinTwo = 0;

export const zodundefinedBody = zod.object({
  preco: zod.number().min(zodundefinedBodyPrecoMinOne),
  duracao: zod.number().min(zodundefinedBodyDuracaoMinTwo),
});

/**
 * Atribuir bônus a um usuário.
 */
export const zodundefinedBody = zod.object({
  userId: zod.string(),
  bookingId: zod.string().optional(),
  type: zod.enum(["BOOKING_POINTS", "LOYALTY"]),
  description: zod.string().optional(),
});

/**
 * Criação de um novo cupom.
 */
export const zodundefinedBodyCodeMin = 3;

export const zodundefinedBodyCodeMax = 50;
export const zodundefinedBodyValueMin = 0;
export const zodundefinedBodyDescriptionMaxOne = 255;
export const zodundefinedBodyMaxUsesMin = 0;
export const zodundefinedBodyMinBookingValueMin = 0;

export const zodundefinedBody = zod.object({
  code: zod.string().min(zodundefinedBodyCodeMin).max(zodundefinedBodyCodeMax),
  type: zod.enum(["PERCENTAGE", "FIXED", "FREE"]),
  value: zod.number().min(zodundefinedBodyValueMin),
  scope: zod.enum(["GLOBAL", "SERVICE", "PROFESSIONAL"]),
  description: zod.string().max(zodundefinedBodyDescriptionMaxOne).optional(),
  maxUses: zod.number().min(zodundefinedBodyMaxUsesMin).optional(),
  startDate: zod.string().datetime({}).optional(),
  endDate: zod.string().datetime({}).optional(),
  minBookingValue: zod
    .number()
    .min(zodundefinedBodyMinBookingValueMin)
    .optional(),
  serviceId: zod.string().uuid().optional(),
  professionalId: zod.string().uuid().optional(),
});

/**
 * Atualiza um cupom existente.
 */
export const zodundefinedBodyCodeMinOne = 3;

export const zodundefinedBodyCodeMaxOne = 20;
export const zodundefinedBodyValueMinOne = 0;
export const zodundefinedBodyMinBookingValueMinOne = 0;

export const zodundefinedBody = zod.object({
  code: zod
    .string()
    .min(zodundefinedBodyCodeMinOne)
    .max(zodundefinedBodyCodeMaxOne)
    .optional(),
  type: zod.enum(["PERCENTAGE", "FIXED", "FREE"]).optional(),
  value: zod.number().min(zodundefinedBodyValueMinOne).optional(),
  scope: zod.enum(["GLOBAL", "SERVICE", "PROFESSIONAL"]).optional(),
  description: zod.string().optional(),
  maxUses: zod.number().min(1).optional(),
  startDate: zod.string().datetime({}).optional(),
  endDate: zod.string().datetime({}).nullish(),
  minBookingValue: zod
    .number()
    .min(zodundefinedBodyMinBookingValueMinOne)
    .nullish(),
  serviceId: zod.string().uuid().nullish(),
  professionalId: zod.string().uuid().nullish(),
  active: zod.boolean().optional(),
});
