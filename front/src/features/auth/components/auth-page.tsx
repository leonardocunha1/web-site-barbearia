"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { DynamicForm } from "@/shared/components/form/DynamicForm";
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
import { ScissorsIcon } from "@phosphor-icons/react";

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

  const isLogin = mode === "login";

  return (
    <section className="relative min-h-[calc(100vh-96px)] w-full px-4 pt-[124px] pb-20 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-5xl items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        {/* Coluna esquerda — identidade editorial */}
        <aside className="space-y-7 lg:sticky lg:top-32">
          <div className="flex items-center gap-3">
            <ScissorsIcon
              weight="duotone"
              className="text-cobre-700 size-5"
            />
            <span className="text-foreground/70 font-mono text-[10px] tracking-[0.3em] uppercase">
              {isLogin ? "Acesso · El Bigodón" : "Cadastro · El Bigodón"}
            </span>
          </div>

          <h1 className="font-display text-foreground text-5xl leading-[0.95] font-medium tracking-tight sm:text-6xl">
            {isLogin ? (
              <>
                Bem-vindo
                <br />
                de <span className="text-cobre-700 italic">volta</span>.
              </>
            ) : (
              <>
                Crie sua
                <br />
                <span className="text-cobre-700 italic">conta</span>.
              </>
            )}
          </h1>

          <p className="text-foreground/75 max-w-sm text-base leading-relaxed sm:text-lg">
            {isLogin
              ? "Entre para acompanhar reservas, pontos bônus e seu histórico no clube Bigodón."
              : "Cadastre-se em segundos. Suas reservas e pontos ficam atrelados à sua conta."}
          </p>

          {/* Toggle de modo */}
          <div className="border-foreground/15 flex flex-col gap-3 border-t pt-5">
            <span className="text-foreground/55 font-mono text-[10px] tracking-[0.3em] uppercase">
              {isLogin ? "Sem conta?" : "Já tem conta?"}
            </span>
            <button
              type="button"
              onClick={() => setMode(isLogin ? "register" : "login")}
              className="text-foreground hover:text-cobre-700 group flex items-center gap-2 text-left text-base font-medium underline-offset-[6px] transition-colors"
            >
              <span className="underline decoration-1">
                {isLogin ? "Criar uma agora" : "Fazer login"}
              </span>
              <span className="font-mono text-xs transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          {/* footer mark editorial */}
          <div className="text-foreground/40 hidden items-center gap-3 pt-8 font-mono text-[10px] tracking-[0.3em] uppercase lg:flex">
            <span className="bg-foreground/20 h-px w-8" aria-hidden />
            <span>Vol. 01 · Sessão de acesso</span>
          </div>
        </aside>

        {/* Coluna direita — formulário */}
        <div className="border-foreground/20 bg-card relative border p-6 sm:p-9">
          {/* corner ticks */}
          <CornerTick className="-top-px -left-px" />
          <CornerTick className="-top-px -right-px rotate-90" />
          <CornerTick className="-bottom-px -left-px -rotate-90" />
          <CornerTick className="-right-px -bottom-px rotate-180" />

          <div className="border-foreground/15 mb-7 flex items-baseline justify-between border-b pb-4">
            <span className="text-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
              {isLogin ? "Login" : "Cadastro"}
            </span>
            <span className="text-foreground/45 font-mono text-[10px] tracking-[0.3em] uppercase">
              N° 01
            </span>
          </div>

          <DynamicForm
            schema={isLogin ? loginSchema : registerSchema}
            onSubmit={handleSubmit}
            resetAfterSubmit={!isLogin}
            fields={isLogin ? loginFields : registerFields}
            className="space-y-5"
            buttonClassName="!rounded-none !uppercase !tracking-[0.2em] !text-xs !font-bold !h-12 !border-2 hover:!shadow-editorial hover:!-translate-y-0.5 active:!translate-y-0 active:!shadow-none transition-all"
            defaultButton
            buttonText={isLogin ? "Entrar" : "Registrar"}
            submittingText={isLogin ? "Entrando..." : "Registrando..."}
          />

          {isLogin && (
            <div className="border-foreground/15 mt-2 flex justify-end border-t pt-4">
              <Button
                variant="link"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                className="text-foreground/65 hover:text-foreground px-0 font-mono text-[10px] tracking-[0.25em] uppercase"
              >
                Esqueceu sua senha?
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CornerTick({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{ width: 12, height: 12 }}
    >
      <span className="bg-cobre-600 absolute top-0 left-0 h-px w-full" />
      <span className="bg-cobre-600 absolute top-0 left-0 h-full w-px" />
    </span>
  );
}
