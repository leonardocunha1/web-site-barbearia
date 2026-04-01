import { useCallback } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { AXIOS_INSTANCE } from "@/api/http/axios-instance";
import userGet from "@/app/api/actions/user";
import type { GetUserProfile200 } from "@/api";
import type { LoginSchema, RegisterSchema } from "../schemas/auth-schemas";

type UseAuthActionsParams = {
  setUser: (user: GetUserProfile200 | null | undefined) => void;
  onLoginSuccess?: () => void;
  onRegisterSuccess?: () => void;
};

const getAxiosErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) return error.message;

  return fallback;
};

export function useAuthActions({
  setUser,
  onLoginSuccess,
  onRegisterSuccess,
}: UseAuthActionsParams) {
  const login = useCallback(
    async (data: LoginSchema) => {
      try {
        const res = await AXIOS_INSTANCE.post(
          "/auth/login",
          { email: data.email, password: data.password },
          { skipAuthRefresh: true } as never,
        );

        if (res.status !== 200) {
          toast.error("Falha no login, tente novamente.");
          return;
        }

        const { ok, data: userData } = await userGet();
        if (ok && userData) {
          setUser(userData);
        }

        toast.success("Login realizado com sucesso!");
        onLoginSuccess?.();
      } catch (error: unknown) {
        toast.error(getAxiosErrorMessage(error, "Erro ao logar"));
      }
    },
    [onLoginSuccess, setUser],
  );

  const register = useCallback(
    async (data: RegisterSchema) => {
      try {
        const res = await AXIOS_INSTANCE.post(
          "/auth/register",
          {
            nome: data.name,
            email: data.email,
            senha: data.password,
            role: "CLIENT",
            telefone: data.phone,
          },
          { skipAuthRefresh: true } as never,
        );

        if (res.status === 201) {
          toast.success(
            "Registro realizado com sucesso! Faça login para continuar.",
          );
          onRegisterSuccess?.();
          return;
        }

        toast.error("Falha ao registrar. Tente novamente.");
      } catch (error: unknown) {
        toast.error(getAxiosErrorMessage(error, "Erro ao registrar"));
      }
    },
    [onRegisterSuccess],
  );

  return { login, register };
}
