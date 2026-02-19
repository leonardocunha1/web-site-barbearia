"use server";

import { redirect } from "next/navigation";
import userGet from "./user";
import axiosInstance from "@/api/http/axios-instance";
import { AxiosResponse } from "axios";
import { z } from "zod";
import { zodloginUserResponse } from "@/api";

type LoginResponse = z.infer<typeof zodloginUserResponse>;

// NAO ESTA SENDO USADO
export async function loginUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    // Cookies foram setados no response pelo backend
    const loginResponse: AxiosResponse<LoginResponse> = await axiosInstance({
      url: `/auth/login`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: { email, password: password },
      withCredentials: true,
    });
    if (loginResponse.status >= 200 && loginResponse.status < 300) {
      const userResult = await userGet();
      if (userResult.ok && userResult.data) {
        redirect("/");
      } else {
        throw new Error("Falha ao carregar dados do usuário após login");
      }
    } else {
      throw new Error("Credenciais inválidas");
    }
  } catch (error: unknown) {
    // console.error("Erro no login:", error);
    if (error instanceof Error) {
      return { error: error.message || "Erro ao fazer login" };
    }
    return { error: "Erro desconhecido ao fazer login" };
  }
}
