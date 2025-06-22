import { useMutation } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import type {
  LoginUser200,
  LoginUser400,
  LoginUser401,
  LoginUser403,
  LoginUserBody,
  LogoutUser200,
  RefreshToken200,
  RefreshToken401,
  RegisterUser201,
  RegisterUser400,
  RegisterUser403,
  RegisterUser409,
  RegisterUserBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Registro de novo usuário.
 */
export const registerUser = (
  registerUserBody: RegisterUserBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<RegisterUser201>({
    url: `/auth/register`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: registerUserBody,
    signal,
  });
};

export const getRegisterUserMutationOptions = <
  TError = RegisterUser400 | RegisterUser403 | RegisterUser409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof registerUser>>,
    TError,
    { data: RegisterUserBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof registerUser>>,
  TError,
  { data: RegisterUserBody },
  TContext
> => {
  const mutationKey = ["registerUser"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof registerUser>>,
    { data: RegisterUserBody }
  > = (props) => {
    const { data } = props ?? {};

    return registerUser(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type RegisterUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof registerUser>>
>;
export type RegisterUserMutationBody = RegisterUserBody;
export type RegisterUserMutationError =
  | RegisterUser400
  | RegisterUser403
  | RegisterUser409;

export const useRegisterUser = <
  TError = RegisterUser400 | RegisterUser403 | RegisterUser409,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof registerUser>>,
      TError,
      { data: RegisterUserBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof registerUser>>,
  TError,
  { data: RegisterUserBody },
  TContext
> => {
  const mutationOptions = getRegisterUserMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Autenticação do usuário.
 */
export const loginUser = (
  loginUserBody: LoginUserBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<LoginUser200>({
    url: `/auth/login`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: loginUserBody,
    signal,
  });
};

export const getLoginUserMutationOptions = <
  TError = LoginUser400 | LoginUser401 | LoginUser403,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof loginUser>>,
    TError,
    { data: LoginUserBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof loginUser>>,
  TError,
  { data: LoginUserBody },
  TContext
> => {
  const mutationKey = ["loginUser"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof loginUser>>,
    { data: LoginUserBody }
  > = (props) => {
    const { data } = props ?? {};

    return loginUser(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type LoginUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof loginUser>>
>;
export type LoginUserMutationBody = LoginUserBody;
export type LoginUserMutationError = LoginUser400 | LoginUser401 | LoginUser403;

export const useLoginUser = <
  TError = LoginUser400 | LoginUser401 | LoginUser403,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof loginUser>>,
      TError,
      { data: LoginUserBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof loginUser>>,
  TError,
  { data: LoginUserBody },
  TContext
> => {
  const mutationOptions = getLoginUserMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Logout do usuário, removendo cookies de autenticação.
 */
export const logoutUser = (signal?: AbortSignal) => {
  return axiosInstance<LogoutUser200>({
    url: `/auth/logout`,
    method: "POST",
    signal,
  });
};

export const getLogoutUserMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof logoutUser>>,
    TError,
    void,
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof logoutUser>>,
  TError,
  void,
  TContext
> => {
  const mutationKey = ["logoutUser"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof logoutUser>>,
    void
  > = () => {
    return logoutUser();
  };

  return { mutationFn, ...mutationOptions };
};

export type LogoutUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof logoutUser>>
>;

export type LogoutUserMutationError = unknown;

export const useLogoutUser = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof logoutUser>>,
      TError,
      void,
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof logoutUser>>,
  TError,
  void,
  TContext
> => {
  const mutationOptions = getLogoutUserMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Geração de um novo token de acesso com base no refresh token válido presente nos cookies.
 */
export const refreshToken = (signal?: AbortSignal) => {
  return axiosInstance<RefreshToken200>({
    url: `/auth/refresh-token`,
    method: "POST",
    signal,
  });
};

export const getRefreshTokenMutationOptions = <
  TError = RefreshToken401,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof refreshToken>>,
    TError,
    void,
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof refreshToken>>,
  TError,
  void,
  TContext
> => {
  const mutationKey = ["refreshToken"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof refreshToken>>,
    void
  > = () => {
    return refreshToken();
  };

  return { mutationFn, ...mutationOptions };
};

export type RefreshTokenMutationResult = NonNullable<
  Awaited<ReturnType<typeof refreshToken>>
>;

export type RefreshTokenMutationError = RefreshToken401;

export const useRefreshToken = <TError = RefreshToken401, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof refreshToken>>,
      TError,
      void,
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof refreshToken>>,
  TError,
  void,
  TContext
> => {
  const mutationOptions = getRefreshTokenMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
