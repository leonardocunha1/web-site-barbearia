"use client";

import { z } from "zod";
import { DynamicForm } from "@/components/form/DynamicForm";
import { DynamicFormProps } from "@/components/form/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLoginUser } from "@/api";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export default function LoginPage() {
  const router = useRouter();
  const { mutateAsync: login } = useLoginUser();

  const fields: DynamicFormProps<typeof loginSchema>["fields"] = [
    {
      name: "email",
      label: "Email",
      placeholder: "Digite seu email",
      type: "email",
      className:
        "bg-stone-800 text-stone-100 border-stone-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      labelProps: {
        className: "text-stone-300 font-medium",
      },
    },
    {
      name: "password",
      label: "Senha",
      placeholder: "Digite sua senha",
      type: "password",
      className:
        "bg-stone-800 text-stone-100 border-stone-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      labelProps: {
        className: "text-stone-300 font-medium",
      },
    },
  ];

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
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

  return (
    <div className="mt-[-104px] flex flex-1 items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-4 pt-[-104px]">
      <Card className="w-full max-w-md overflow-hidden rounded-lg border border-stone-700 bg-stone-800/90 shadow-xl backdrop-blur-sm">
        <div className="from-princpal-600 to-principal-500 h-2 w-full bg-gradient-to-r"></div>
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-3xl font-bold text-white">
            Bem-vindo de volta
          </CardTitle>
          <p className="mt-1 text-stone-400">Faça login para continuar</p>
        </CardHeader>
        <CardContent className="pt-4">
          <DynamicForm
            schema={loginSchema}
            onSubmit={handleLogin}
            fields={fields}
            className="space-y-6"
            buttonClassName="w-full bg-principal-600 hover:bg-principal-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 shadow-md"
            defaultButton
            buttonText="Entrar"
            submittingText="Entrando..."
          />
          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-principal-400 hover:text-principal-300 text-sm font-medium"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
