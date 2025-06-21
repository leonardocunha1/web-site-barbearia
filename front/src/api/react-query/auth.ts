import { useMutation } from "@tanstack/react-query";
import type {
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import type {
  PostAuthLogin200,
  PostAuthLogin400,
  PostAuthLogin401,
  PostAuthLogin403,
  PostAuthLoginBody,
  PostAuthLogout200,
  PostAuthRefreshToken200,
  PostAuthRefreshToken401,
  PostAuthRegister201,
  PostAuthRegister400,
  PostAuthRegister403,
  PostAuthRegister409,
  PostAuthRegisterBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Registro de novo usuário.
 */
export const postAuthRegister = (
  postAuthRegisterBody: PostAuthRegisterBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostAuthRegister201>({
    url: `/auth/register`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postAuthRegisterBody,
    signal,
  });
};

export const getPostAuthRegisterMutationOptions = <
  TError = PostAuthRegister400 | PostAuthRegister403 | PostAuthRegister409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthRegister>>,
    TError,
    { data: PostAuthRegisterBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthRegister>>,
  TError,
  { data: PostAuthRegisterBody },
  TContext
> => {
  const mutationKey = ["postAuthRegister"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthRegister>>,
    { data: PostAuthRegisterBody }
  > = (props) => {
    const { data } = props ?? {};

    return postAuthRegister(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthRegisterMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthRegister>>
>;
export type PostAuthRegisterMutationBody = PostAuthRegisterBody;
export type PostAuthRegisterMutationError =
  | PostAuthRegister400
  | PostAuthRegister403
  | PostAuthRegister409;

export const usePostAuthRegister = <
  TError = PostAuthRegister400 | PostAuthRegister403 | PostAuthRegister409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthRegister>>,
    TError,
    { data: PostAuthRegisterBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthRegister>>,
  TError,
  { data: PostAuthRegisterBody },
  TContext
> => {
  const mutationOptions = getPostAuthRegisterMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Autenticação do usuário.
 */
export const postAuthLogin = (
  postAuthLoginBody: PostAuthLoginBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostAuthLogin200>({
    url: `/auth/login`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postAuthLoginBody,
    signal,
  });
};

export const getPostAuthLoginMutationOptions = <
  TError = PostAuthLogin400 | PostAuthLogin401 | PostAuthLogin403,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthLogin>>,
    TError,
    { data: PostAuthLoginBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthLogin>>,
  TError,
  { data: PostAuthLoginBody },
  TContext
> => {
  const mutationKey = ["postAuthLogin"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthLogin>>,
    { data: PostAuthLoginBody }
  > = (props) => {
    const { data } = props ?? {};

    return postAuthLogin(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthLoginMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthLogin>>
>;
export type PostAuthLoginMutationBody = PostAuthLoginBody;
export type PostAuthLoginMutationError =
  | PostAuthLogin400
  | PostAuthLogin401
  | PostAuthLogin403;

export const usePostAuthLogin = <
  TError = PostAuthLogin400 | PostAuthLogin401 | PostAuthLogin403,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthLogin>>,
    TError,
    { data: PostAuthLoginBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthLogin>>,
  TError,
  { data: PostAuthLoginBody },
  TContext
> => {
  const mutationOptions = getPostAuthLoginMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Logout do usuário, removendo cookies de autenticação.
 */
export const postAuthLogout = (signal?: AbortSignal) => {
  return axiosInstance<PostAuthLogout200>({
    url: `/auth/logout`,
    method: "POST",
    signal,
  });
};

export const getPostAuthLogoutMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthLogout>>,
    TError,
    void,
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthLogout>>,
  TError,
  void,
  TContext
> => {
  const mutationKey = ["postAuthLogout"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthLogout>>,
    void
  > = () => {
    return postAuthLogout();
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthLogoutMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthLogout>>
>;

export type PostAuthLogoutMutationError = unknown;

export const usePostAuthLogout = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthLogout>>,
    TError,
    void,
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthLogout>>,
  TError,
  void,
  TContext
> => {
  const mutationOptions = getPostAuthLogoutMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Geração de um novo token de acesso com base no refresh token válido presente nos cookies.
 */
export const postAuthRefreshToken = (signal?: AbortSignal) => {
  return axiosInstance<PostAuthRefreshToken200>({
    url: `/auth/refresh-token`,
    method: "POST",
    signal,
  });
};

export const getPostAuthRefreshTokenMutationOptions = <
  TError = PostAuthRefreshToken401,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthRefreshToken>>,
    TError,
    void,
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthRefreshToken>>,
  TError,
  void,
  TContext
> => {
  const mutationKey = ["postAuthRefreshToken"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthRefreshToken>>,
    void
  > = () => {
    return postAuthRefreshToken();
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthRefreshTokenMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthRefreshToken>>
>;

export type PostAuthRefreshTokenMutationError = PostAuthRefreshToken401;

export const usePostAuthRefreshToken = <
  TError = PostAuthRefreshToken401,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthRefreshToken>>,
    TError,
    void,
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthRefreshToken>>,
  TError,
  void,
  TContext
> => {
  const mutationOptions = getPostAuthRefreshTokenMutationOptions(options);

  return useMutation(mutationOptions);
};
