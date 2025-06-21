import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type {
  GetUsers200,
  GetUsers400,
  GetUsersMe200,
  GetUsersMe404,
  GetUsersParams,
  GetUsersVerifyEmail200,
  GetUsersVerifyEmail400,
  GetUsersVerifyEmailParams,
  PatchUsersMe200,
  PatchUsersMe400,
  PatchUsersMe404,
  PatchUsersMe409,
  PatchUsersMeBody,
  PatchUsersUpdatePassword200,
  PatchUsersUpdatePassword400,
  PatchUsersUpdatePassword401,
  PatchUsersUpdatePassword404,
  PatchUsersUpdatePassword409,
  PatchUsersUpdatePasswordBody,
  PatchUsersUserIdAnonymize204,
  PatchUsersUserIdAnonymize400,
  PatchUsersUserIdAnonymize403,
  PatchUsersUserIdAnonymize404,
  PostUsersForgotPassword200,
  PostUsersForgotPassword400,
  PostUsersForgotPassword404,
  PostUsersForgotPasswordBody,
  PostUsersResetPassword200,
  PostUsersResetPassword400,
  PostUsersResetPassword401,
  PostUsersResetPasswordBody,
  PostUsersSendVerificationEmail200,
  PostUsersSendVerificationEmail400,
  PostUsersSendVerificationEmail404,
  PostUsersSendVerificationEmailBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Retorna o perfil do usuário logado.
 */
export const getUsersMe = (signal?: AbortSignal) => {
  return axiosInstance<GetUsersMe200>({
    url: `/users/me`,
    method: "GET",
    signal,
  });
};

export const getGetUsersMeQueryKey = () => {
  return [`/users/me`] as const;
};

export const getGetUsersMeInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsersMe>>,
  TError = GetUsersMe404,
>(options?: {
  query?: UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getUsersMe>>,
    TError,
    TData
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersMeQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsersMe>>> = ({
    signal,
  }) => getUsersMe(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getUsersMe>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersMeInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUsersMe>>
>;
export type GetUsersMeInfiniteQueryError = GetUsersMe404;

export function useGetUsersMeInfinite<
  TData = Awaited<ReturnType<typeof getUsersMe>>,
  TError = GetUsersMe404,
>(options?: {
  query?: UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getUsersMe>>,
    TError,
    TData
  >;
}): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetUsersMeInfiniteQueryOptions(options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetUsersMeQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsersMe>>,
  TError = GetUsersMe404,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getUsersMe>>,
    TError,
    TData
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersMeQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsersMe>>> = ({
    signal,
  }) => getUsersMe(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsersMe>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersMeQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUsersMe>>
>;
export type GetUsersMeQueryError = GetUsersMe404;

export function useGetUsersMe<
  TData = Awaited<ReturnType<typeof getUsersMe>>,
  TError = GetUsersMe404,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getUsersMe>>,
    TError,
    TData
  >;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetUsersMeQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Atualiza o perfil do usuário logado.
 */
export const patchUsersMe = (patchUsersMeBody: PatchUsersMeBody) => {
  return axiosInstance<PatchUsersMe200>({
    url: `/users/me`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: patchUsersMeBody,
  });
};

export const getPatchUsersMeMutationOptions = <
  TError = PatchUsersMe400 | PatchUsersMe404 | PatchUsersMe409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchUsersMe>>,
    TError,
    { data: PatchUsersMeBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchUsersMe>>,
  TError,
  { data: PatchUsersMeBody },
  TContext
> => {
  const mutationKey = ["patchUsersMe"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchUsersMe>>,
    { data: PatchUsersMeBody }
  > = (props) => {
    const { data } = props ?? {};

    return patchUsersMe(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchUsersMeMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchUsersMe>>
>;
export type PatchUsersMeMutationBody = PatchUsersMeBody;
export type PatchUsersMeMutationError =
  | PatchUsersMe400
  | PatchUsersMe404
  | PatchUsersMe409;

export const usePatchUsersMe = <
  TError = PatchUsersMe400 | PatchUsersMe404 | PatchUsersMe409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchUsersMe>>,
    TError,
    { data: PatchUsersMeBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchUsersMe>>,
  TError,
  { data: PatchUsersMeBody },
  TContext
> => {
  const mutationOptions = getPatchUsersMeMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Listar usuários
 */
export const getUsers = (params?: GetUsersParams, signal?: AbortSignal) => {
  return axiosInstance<GetUsers200>({
    url: `/users`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetUsersQueryKey = (params?: GetUsersParams) => {
  return [`/users`, ...(params ? [params] : [])] as const;
};

export const getGetUsersInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsers>>,
  TError = GetUsers400,
>(
  params?: GetUsersParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getUsers>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsers>>> = ({
    signal,
  }) => getUsers(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getUsers>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUsers>>
>;
export type GetUsersInfiniteQueryError = GetUsers400;

export function useGetUsersInfinite<
  TData = Awaited<ReturnType<typeof getUsers>>,
  TError = GetUsers400,
>(
  params?: GetUsersParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getUsers>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetUsersInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetUsersQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsers>>,
  TError = GetUsers400,
>(
  params?: GetUsersParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getUsers>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsers>>> = ({
    signal,
  }) => getUsers(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsers>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUsers>>
>;
export type GetUsersQueryError = GetUsers400;

export function useGetUsers<
  TData = Awaited<ReturnType<typeof getUsers>>,
  TError = GetUsers400,
>(
  params?: GetUsersParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getUsers>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetUsersQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Anonimiza um usuário.
 */
export const patchUsersUserIdAnonymize = (userId: string) => {
  return axiosInstance<PatchUsersUserIdAnonymize204>({
    url: `/users/${userId}/anonymize`,
    method: "PATCH",
  });
};

export const getPatchUsersUserIdAnonymizeMutationOptions = <
  TError =
    | PatchUsersUserIdAnonymize400
    | PatchUsersUserIdAnonymize403
    | PatchUsersUserIdAnonymize404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchUsersUserIdAnonymize>>,
    TError,
    { userId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchUsersUserIdAnonymize>>,
  TError,
  { userId: string },
  TContext
> => {
  const mutationKey = ["patchUsersUserIdAnonymize"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchUsersUserIdAnonymize>>,
    { userId: string }
  > = (props) => {
    const { userId } = props ?? {};

    return patchUsersUserIdAnonymize(userId);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchUsersUserIdAnonymizeMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchUsersUserIdAnonymize>>
>;

export type PatchUsersUserIdAnonymizeMutationError =
  | PatchUsersUserIdAnonymize400
  | PatchUsersUserIdAnonymize403
  | PatchUsersUserIdAnonymize404;

export const usePatchUsersUserIdAnonymize = <
  TError =
    | PatchUsersUserIdAnonymize400
    | PatchUsersUserIdAnonymize403
    | PatchUsersUserIdAnonymize404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchUsersUserIdAnonymize>>,
    TError,
    { userId: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchUsersUserIdAnonymize>>,
  TError,
  { userId: string },
  TContext
> => {
  const mutationOptions = getPatchUsersUserIdAnonymizeMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Atualiza a senha do usuário logado.
 */
export const patchUsersUpdatePassword = (
  patchUsersUpdatePasswordBody: PatchUsersUpdatePasswordBody,
) => {
  return axiosInstance<PatchUsersUpdatePassword200>({
    url: `/users/update-password`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: patchUsersUpdatePasswordBody,
  });
};

export const getPatchUsersUpdatePasswordMutationOptions = <
  TError =
    | PatchUsersUpdatePassword400
    | PatchUsersUpdatePassword401
    | PatchUsersUpdatePassword404
    | PatchUsersUpdatePassword409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchUsersUpdatePassword>>,
    TError,
    { data: PatchUsersUpdatePasswordBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchUsersUpdatePassword>>,
  TError,
  { data: PatchUsersUpdatePasswordBody },
  TContext
> => {
  const mutationKey = ["patchUsersUpdatePassword"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchUsersUpdatePassword>>,
    { data: PatchUsersUpdatePasswordBody }
  > = (props) => {
    const { data } = props ?? {};

    return patchUsersUpdatePassword(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchUsersUpdatePasswordMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchUsersUpdatePassword>>
>;
export type PatchUsersUpdatePasswordMutationBody = PatchUsersUpdatePasswordBody;
export type PatchUsersUpdatePasswordMutationError =
  | PatchUsersUpdatePassword400
  | PatchUsersUpdatePassword401
  | PatchUsersUpdatePassword404
  | PatchUsersUpdatePassword409;

export const usePatchUsersUpdatePassword = <
  TError =
    | PatchUsersUpdatePassword400
    | PatchUsersUpdatePassword401
    | PatchUsersUpdatePassword404
    | PatchUsersUpdatePassword409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchUsersUpdatePassword>>,
    TError,
    { data: PatchUsersUpdatePasswordBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchUsersUpdatePassword>>,
  TError,
  { data: PatchUsersUpdatePasswordBody },
  TContext
> => {
  const mutationOptions = getPatchUsersUpdatePasswordMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Verifica o e-mail do usuário.
 */
export const getUsersVerifyEmail = (
  params: GetUsersVerifyEmailParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetUsersVerifyEmail200>({
    url: `/users/verify-email`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetUsersVerifyEmailQueryKey = (
  params: GetUsersVerifyEmailParams,
) => {
  return [`/users/verify-email`, ...(params ? [params] : [])] as const;
};

export const getGetUsersVerifyEmailInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsersVerifyEmail>>,
  TError = GetUsersVerifyEmail400,
>(
  params: GetUsersVerifyEmailParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getUsersVerifyEmail>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetUsersVerifyEmailQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getUsersVerifyEmail>>
  > = ({ signal }) => getUsersVerifyEmail(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getUsersVerifyEmail>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersVerifyEmailInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUsersVerifyEmail>>
>;
export type GetUsersVerifyEmailInfiniteQueryError = GetUsersVerifyEmail400;

export function useGetUsersVerifyEmailInfinite<
  TData = Awaited<ReturnType<typeof getUsersVerifyEmail>>,
  TError = GetUsersVerifyEmail400,
>(
  params: GetUsersVerifyEmailParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getUsersVerifyEmail>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetUsersVerifyEmailInfiniteQueryOptions(
    params,
    options,
  );

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetUsersVerifyEmailQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsersVerifyEmail>>,
  TError = GetUsersVerifyEmail400,
>(
  params: GetUsersVerifyEmailParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getUsersVerifyEmail>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetUsersVerifyEmailQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getUsersVerifyEmail>>
  > = ({ signal }) => getUsersVerifyEmail(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsersVerifyEmail>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersVerifyEmailQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUsersVerifyEmail>>
>;
export type GetUsersVerifyEmailQueryError = GetUsersVerifyEmail400;

export function useGetUsersVerifyEmail<
  TData = Awaited<ReturnType<typeof getUsersVerifyEmail>>,
  TError = GetUsersVerifyEmail400,
>(
  params: GetUsersVerifyEmailParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getUsersVerifyEmail>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetUsersVerifyEmailQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Envia um e-mail de verificação.
 */
export const postUsersSendVerificationEmail = (
  postUsersSendVerificationEmailBody: PostUsersSendVerificationEmailBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostUsersSendVerificationEmail200>({
    url: `/users/send-verification-email`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postUsersSendVerificationEmailBody,
    signal,
  });
};

export const getPostUsersSendVerificationEmailMutationOptions = <
  TError =
    | PostUsersSendVerificationEmail400
    | PostUsersSendVerificationEmail404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUsersSendVerificationEmail>>,
    TError,
    { data: PostUsersSendVerificationEmailBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postUsersSendVerificationEmail>>,
  TError,
  { data: PostUsersSendVerificationEmailBody },
  TContext
> => {
  const mutationKey = ["postUsersSendVerificationEmail"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postUsersSendVerificationEmail>>,
    { data: PostUsersSendVerificationEmailBody }
  > = (props) => {
    const { data } = props ?? {};

    return postUsersSendVerificationEmail(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostUsersSendVerificationEmailMutationResult = NonNullable<
  Awaited<ReturnType<typeof postUsersSendVerificationEmail>>
>;
export type PostUsersSendVerificationEmailMutationBody =
  PostUsersSendVerificationEmailBody;
export type PostUsersSendVerificationEmailMutationError =
  | PostUsersSendVerificationEmail400
  | PostUsersSendVerificationEmail404;

export const usePostUsersSendVerificationEmail = <
  TError =
    | PostUsersSendVerificationEmail400
    | PostUsersSendVerificationEmail404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUsersSendVerificationEmail>>,
    TError,
    { data: PostUsersSendVerificationEmailBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postUsersSendVerificationEmail>>,
  TError,
  { data: PostUsersSendVerificationEmailBody },
  TContext
> => {
  const mutationOptions =
    getPostUsersSendVerificationEmailMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Envia um e-mail para redefinição de senha.
 */
export const postUsersForgotPassword = (
  postUsersForgotPasswordBody: PostUsersForgotPasswordBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostUsersForgotPassword200>({
    url: `/users/forgot-password`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postUsersForgotPasswordBody,
    signal,
  });
};

export const getPostUsersForgotPasswordMutationOptions = <
  TError = PostUsersForgotPassword400 | PostUsersForgotPassword404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUsersForgotPassword>>,
    TError,
    { data: PostUsersForgotPasswordBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postUsersForgotPassword>>,
  TError,
  { data: PostUsersForgotPasswordBody },
  TContext
> => {
  const mutationKey = ["postUsersForgotPassword"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postUsersForgotPassword>>,
    { data: PostUsersForgotPasswordBody }
  > = (props) => {
    const { data } = props ?? {};

    return postUsersForgotPassword(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostUsersForgotPasswordMutationResult = NonNullable<
  Awaited<ReturnType<typeof postUsersForgotPassword>>
>;
export type PostUsersForgotPasswordMutationBody = PostUsersForgotPasswordBody;
export type PostUsersForgotPasswordMutationError =
  | PostUsersForgotPassword400
  | PostUsersForgotPassword404;

export const usePostUsersForgotPassword = <
  TError = PostUsersForgotPassword400 | PostUsersForgotPassword404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUsersForgotPassword>>,
    TError,
    { data: PostUsersForgotPasswordBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postUsersForgotPassword>>,
  TError,
  { data: PostUsersForgotPasswordBody },
  TContext
> => {
  const mutationOptions = getPostUsersForgotPasswordMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Redefine a senha do usuário.
 */
export const postUsersResetPassword = (
  postUsersResetPasswordBody: PostUsersResetPasswordBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostUsersResetPassword200>({
    url: `/users/reset-password`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postUsersResetPasswordBody,
    signal,
  });
};

export const getPostUsersResetPasswordMutationOptions = <
  TError = PostUsersResetPassword400 | PostUsersResetPassword401,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUsersResetPassword>>,
    TError,
    { data: PostUsersResetPasswordBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postUsersResetPassword>>,
  TError,
  { data: PostUsersResetPasswordBody },
  TContext
> => {
  const mutationKey = ["postUsersResetPassword"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postUsersResetPassword>>,
    { data: PostUsersResetPasswordBody }
  > = (props) => {
    const { data } = props ?? {};

    return postUsersResetPassword(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostUsersResetPasswordMutationResult = NonNullable<
  Awaited<ReturnType<typeof postUsersResetPassword>>
>;
export type PostUsersResetPasswordMutationBody = PostUsersResetPasswordBody;
export type PostUsersResetPasswordMutationError =
  | PostUsersResetPassword400
  | PostUsersResetPassword401;

export const usePostUsersResetPassword = <
  TError = PostUsersResetPassword400 | PostUsersResetPassword401,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUsersResetPassword>>,
    TError,
    { data: PostUsersResetPasswordBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postUsersResetPassword>>,
  TError,
  { data: PostUsersResetPasswordBody },
  TContext
> => {
  const mutationOptions = getPostUsersResetPasswordMutationOptions(options);

  return useMutation(mutationOptions);
};
