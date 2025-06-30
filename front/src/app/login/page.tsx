"use client";

import { z } from "zod";
import { DynamicForm } from "@/components/form/DynamicForm";
import { DynamicFormProps } from "@/components/form/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLoginUser, useRegisterUser } from "@/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthMode = "login" | "register";

const classNames = {
  input:
    "bg-stone-800 text-stone-100 border-stone-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  label: "text-stone-300 font-medium",
};

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const { mutateAsync: login } = useLoginUser();
  const { mutateAsync: register } = useRegisterUser();

  const commonFields: DynamicFormProps<typeof loginSchema>["fields"] = [
    {
      name: "email",
      label: "Email",
      placeholder: "Digite seu email",
      type: "email",
      className: classNames.input,
      labelProps: {
        className: classNames.label,
      },
    },
    {
      name: "password",
      label: "Senha",
      placeholder: "Digite sua senha",
      type: "password",
      className: classNames.input,
      labelProps: {
        className: classNames.label,
      },
    },
  ];

  const registerFields: DynamicFormProps<typeof registerSchema>["fields"] = [
    {
      name: "name",
      label: "Nome",
      placeholder: "Digite seu nome completo",
      type: "text",
      className: classNames.input,
      labelProps: {
        className: classNames.label,
      },
    },
    ...commonFields,
    {
      name: "confirmPassword",
      label: "Confirmar Senha",
      placeholder: "Confirme sua senha",
      type: "password",
      className: classNames.input,
      labelProps: {
        className: classNames.label,
      },
    },
    {
      name: "phone",
      label: "Telefone",
      placeholder: "Digite seu telefone",
      type: "phone",
      className: classNames.input,
      labelProps: {
        className: classNames.label,
      },
    },
  ];

  const handleSubmit = async (
    data: z.infer<typeof loginSchema> | z.infer<typeof registerSchema>,
  ) => {
    if (mode === "login") {
      await loginHandler(data as z.infer<typeof loginSchema>);
    } else {
      await registerHandler(data as z.infer<typeof registerSchema>);
    }
  };

  const loginHandler = async (data: z.infer<typeof loginSchema>) => {
    await login(
      {
        data: {
          email: data.email,
          senha: data.password,
        },
      },
      {
        onSuccess: () => {
          toast.success("Login realizado com sucesso!");
          router.push("/dashboard");
        },
        onError: (error) => {
          console.error("Erro ao fazer login:", error);
          const errorMessage = error.message || "Erro ao fazer login";
          toast.error(errorMessage);
        },
      },
    );
  };

  const registerHandler = async (data: z.infer<typeof registerSchema>) => {
    await register(
      {
        data: {
          nome: data.name,
          email: data.email,
          senha: data.password,
          role: "CLIENTE",
          telefone: data.phone,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            "Registro realizado com sucesso! Faça login para continuar.",
          );
          setMode("login");
        },
        onError: (error) => {
          console.error("Erro ao registrar:", error);
          const errorMessage = error.message || "Erro ao registrar";
          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-96px)] w-full items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-4 pt-[124px] pb-12">
      <Card className="w-full max-w-md overflow-hidden rounded-lg border border-stone-700 bg-stone-800/90 shadow-xl backdrop-blur-sm">
        <div className="from-principal-600 to-principal-500 h-2 w-full bg-gradient-to-r"></div>
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-3xl font-bold text-white">
            {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </CardTitle>
          <p className="mt-1 text-stone-400">
            {mode === "login"
              ? "Faça login para continuar"
              : "Preencha os dados para se registrar"}
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <DynamicForm
            schema={mode === "login" ? loginSchema : registerSchema}
            onSubmit={handleSubmit}
            resetAfterSubmit={mode === "register"}
            fields={mode === "login" ? commonFields : registerFields}
            className="space-y-6"
            buttonClassName="w-full bg-principal-600 hover:bg-principal-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 shadow-md"
            defaultButton
            buttonText={mode === "login" ? "Entrar" : "Registrar"}
            submittingText={mode === "login" ? "Entrando..." : "Registrando..."}
          />

          <div className="mt-6 flex flex-col items-center space-y-3">
            <Button
              variant="link"
              className="text-principal-400 hover:text-principal-300 cursor-pointer text-sm font-medium"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login"
                ? "Não tem uma conta? Registre-se"
                : "Já tem uma conta? Faça login"}
            </Button>

            {mode === "login" && (
              <Button
                variant="link"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                className="text-principal-400 hover:text-principal-300 cursor-pointer text-sm font-medium hover:underline"
              >
                Esqueceu sua senha?
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
      // Validação do formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
      .refine((val) => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(val), {
        message: "Formato inválido. Use (DDD) XXXXX-XXXX",
      })
      // Validação do comprimento (10 ou 11 dígitos)
      .refine(
        (val) => {
          const digits = val.replace(/\D/g, "");
          return digits.length === 10 || digits.length === 11;
        },
        {
          message: "Telefone deve ter 10 ou 11 dígitos (incluindo DDD)",
        },
      )
      // Formatação consistente
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
