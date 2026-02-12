import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = loginSchema
  .extend({
    name: z
      .string()
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .transform((name) => name.trim()),
    phone: z
      .string()
      .min(1, "Telefone é obrigatório")
      .refine((val) => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(val), {
        message: "Formato inválido. Use (DDD) XXXXX-XXXX",
      })
      .refine(
        (val) => {
          const digits = val.replace(/\D/g, "");
          return digits.length === 10 || digits.length === 11;
        },
        {
          message: "Telefone deve ter 10 ou 11 dígitos (incluindo DDD)",
        },
      )
      .transform((val) => {
        const digits = val.replace(/\D/g, "");
        const ddd = digits.substring(0, 2);
        const number = digits.substring(2);

        return number.length === 8
          ? `(${ddd}) ${number.substring(0, 4)}-${number.substring(4)}`
          : `(${ddd}) ${number.substring(0, 5)}-${number.substring(5)}`;
      }),
    confirmPassword: z.string().min(6, "Confirmação de senha inválida"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
