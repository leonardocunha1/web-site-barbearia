"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { DynamicForm } from "@/shared/components/form/DynamicForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@/contexts/user";
import {
  loginSchema,
  registerSchema,
} from "@/features/auth/schemas/auth-schemas";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import {
  loginFields,
  registerFields,
} from "@/features/auth/config/auth-form-config";

export type AuthMode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const { setUser } = useUser();

  const returnUrl = searchParams.get("returnUrl") || "/";

  const { login, register } = useAuthActions({
    setUser,
    onLoginSuccess: () => router.push(returnUrl),
    onRegisterSuccess: () => setMode("login"),
  });

  const handleSubmit = async (
    data: z.infer<typeof loginSchema> | z.infer<typeof registerSchema>,
  ) => {
    if (mode === "login") {
      await login(data as z.infer<typeof loginSchema>);
    } else {
      await register(data as z.infer<typeof registerSchema>);
    }
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
            fields={mode === "login" ? loginFields : registerFields}
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
