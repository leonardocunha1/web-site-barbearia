import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseInfiniteQueryResult,
  DefinedUseQueryResult,
  InfiniteData,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type {
  AnonymizeUser204,
  AnonymizeUser400,
  AnonymizeUser403,
  AnonymizeUser404,
  GetUserProfile200,
  GetUserProfile404,
  ListUsers200,
  ListUsers400,
  ListUsersParams,
  ResetUserPassword200,
  ResetUserPassword400,
  ResetUserPassword401,
  ResetUserPasswordBody,
  SendForgotPasswordEmail200,
  SendForgotPasswordEmail400,
  SendForgotPasswordEmail404,
  SendForgotPasswordEmailBody,
  SendUserVerificationEmail200,
  SendUserVerificationEmail400,
  SendUserVerificationEmail404,
  SendUserVerificationEmailBody,
  UpdateUserPassword200,
  UpdateUserPassword400,
  UpdateUserPassword401,
  UpdateUserPassword404,
  UpdateUserPassword409,
  UpdateUserPasswordBody,
  UpdateUserProfile200,
  UpdateUserProfile400,
  UpdateUserProfile404,
  UpdateUserProfile409,
  UpdateUserProfileBody,
  VerifyUserEmail200,
  VerifyUserEmail400,
  VerifyUserEmailParams,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Retorna o perfil do usuário logado.
 */
export const getUserProfile = (signal?: AbortSignal) => {
  return axiosInstance<GetUserProfile200>({
    url: `/users/me`,
    method: "GET",
    signal,
  });
};

export const getGetUserProfileQueryKey = () => {
  return [`/users/me`] as const;
};

export const getGetUserProfileInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getUserProfile>>>,
  TError = GetUserProfile404,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getUserProfile>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUserProfileQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserProfile>>> = ({
    signal,
  }) => getUserProfile(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getUserProfile>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetUserProfileInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUserProfile>>
>;
export type GetUserProfileInfiniteQueryError = GetUserProfile404;

export function useGetUserProfileInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getUserProfile>>>,
  TError = GetUserProfile404,
>(
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getUserProfile>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserProfile>>,
          TError,
          Awaited<ReturnType<typeof getUserProfile>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetUserProfileInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getUserProfile>>>,
  TError = GetUserProfile404,
>(
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getUserProfile>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserProfile>>,
          TError,
          Awaited<ReturnType<typeof getUserProfile>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetUserProfileInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getUserProfile>>>,
  TError = GetUserProfile404,
>(
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getUserProfile>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetUserProfileInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getUserProfile>>>,
  TError = GetUserProfile404,
>(
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getUserProfile>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetUserProfileInfiniteQueryOptions(options);

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetUserProfileQueryOptions = <
  TData = Awaited<ReturnType<typeof getUserProfile>>,
  TError = GetUserProfile404,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getUserProfile>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUserProfileQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserProfile>>> = ({
    signal,
  }) => getUserProfile(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUserProfile>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetUserProfileQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUserProfile>>
>;
export type GetUserProfileQueryError = GetUserProfile404;

export function useGetUserProfile<
  TData = Awaited<ReturnType<typeof getUserProfile>>,
  TError = GetUserProfile404,
>(
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getUserProfile>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserProfile>>,
          TError,
          Awaited<ReturnType<typeof getUserProfile>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetUserProfile<
  TData = Awaited<ReturnType<typeof getUserProfile>>,
  TError = GetUserProfile404,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getUserProfile>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserProfile>>,
          TError,
          Awaited<ReturnType<typeof getUserProfile>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetUserProfile<
  TData = Awaited<ReturnType<typeof getUserProfile>>,
  TError = GetUserProfile404,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getUserProfile>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetUserProfile<
  TData = Awaited<ReturnType<typeof getUserProfile>>,
  TError = GetUserProfile404,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getUserProfile>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetUserProfileQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Atualiza o perfil do usuário logado.
 */
export const updateUserProfile = (
  updateUserProfileBody: UpdateUserProfileBody,
) => {
  return axiosInstance<UpdateUserProfile200>({
    url: `/users/me`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: updateUserProfileBody,
  });
};

export const getUpdateUserProfileMutationOptions = <
  TError = UpdateUserProfile400 | UpdateUserProfile404 | UpdateUserProfile409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateUserProfile>>,
    TError,
    { data: UpdateUserProfileBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateUserProfile>>,
  TError,
  { data: UpdateUserProfileBody },
  TContext
> => {
  const mutationKey = ["updateUserProfile"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateUserProfile>>,
    { data: UpdateUserProfileBody }
  > = (props) => {
    const { data } = props ?? {};

    return updateUserProfile(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateUserProfileMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateUserProfile>>
>;
export type UpdateUserProfileMutationBody = UpdateUserProfileBody;
export type UpdateUserProfileMutationError =
  | UpdateUserProfile400
  | UpdateUserProfile404
  | UpdateUserProfile409;

export const useUpdateUserProfile = <
  TError = UpdateUserProfile400 | UpdateUserProfile404 | UpdateUserProfile409,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateUserProfile>>,
      TError,
      { data: UpdateUserProfileBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateUserProfile>>,
  TError,
  { data: UpdateUserProfileBody },
  TContext
> => {
  const mutationOptions = getUpdateUserProfileMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Listar usuários
 */
export const listUsers = (params?: ListUsersParams, signal?: AbortSignal) => {
  return axiosInstance<ListUsers200>({
    url: `/users`,
    method: "GET",
    params,
    signal,
  });
};

export const getListUsersQueryKey = (params?: ListUsersParams) => {
  return [`/users`, ...(params ? [params] : [])] as const;
};

export const getListUsersInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof listUsers>>>,
  TError = ListUsers400,
>(
  params?: ListUsersParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listUsers>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListUsersQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listUsers>>> = ({
    signal,
  }) => listUsers(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof listUsers>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListUsersInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof listUsers>>
>;
export type ListUsersInfiniteQueryError = ListUsers400;

export function useListUsersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listUsers>>>,
  TError = ListUsers400,
>(
  params: undefined | ListUsersParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listUsers>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listUsers>>,
          TError,
          Awaited<ReturnType<typeof listUsers>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListUsersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listUsers>>>,
  TError = ListUsers400,
>(
  params?: ListUsersParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listUsers>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listUsers>>,
          TError,
          Awaited<ReturnType<typeof listUsers>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListUsersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listUsers>>>,
  TError = ListUsers400,
>(
  params?: ListUsersParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listUsers>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListUsersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listUsers>>>,
  TError = ListUsers400,
>(
  params?: ListUsersParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listUsers>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListUsersInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getListUsersQueryOptions = <
  TData = Awaited<ReturnType<typeof listUsers>>,
  TError = ListUsers400,
>(
  params?: ListUsersParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListUsersQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listUsers>>> = ({
    signal,
  }) => listUsers(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listUsers>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListUsersQueryResult = NonNullable<
  Awaited<ReturnType<typeof listUsers>>
>;
export type ListUsersQueryError = ListUsers400;

export function useListUsers<
  TData = Awaited<ReturnType<typeof listUsers>>,
  TError = ListUsers400,
>(
  params: undefined | ListUsersParams,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listUsers>>,
          TError,
          Awaited<ReturnType<typeof listUsers>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListUsers<
  TData = Awaited<ReturnType<typeof listUsers>>,
  TError = ListUsers400,
>(
  params?: ListUsersParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listUsers>>,
          TError,
          Awaited<ReturnType<typeof listUsers>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListUsers<
  TData = Awaited<ReturnType<typeof listUsers>>,
  TError = ListUsers400,
>(
  params?: ListUsersParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListUsers<
  TData = Awaited<ReturnType<typeof listUsers>>,
  TError = ListUsers400,
>(
  params?: ListUsersParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListUsersQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Anonimiza um usuário.
 */
export const anonymizeUser = (userId: string) => {
  return axiosInstance<AnonymizeUser204>({
    url: `/users/${userId}/anonymize`,
    method: "PATCH",
  });
};

export const getAnonymizeUserMutationOptions = <
  TError = AnonymizeUser400 | AnonymizeUser403 | AnonymizeUser404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof anonymizeUser>>,
    TError,
    { userId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof anonymizeUser>>,
  TError,
  { userId: string },
  TContext
> => {
  const mutationKey = ["anonymizeUser"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof anonymizeUser>>,
    { userId: string }
  > = (props) => {
    const { userId } = props ?? {};

    return anonymizeUser(userId);
  };

  return { mutationFn, ...mutationOptions };
};

export type AnonymizeUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof anonymizeUser>>
>;

export type AnonymizeUserMutationError =
  | AnonymizeUser400
  | AnonymizeUser403
  | AnonymizeUser404;

export const useAnonymizeUser = <
  TError = AnonymizeUser400 | AnonymizeUser403 | AnonymizeUser404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof anonymizeUser>>,
      TError,
      { userId: string },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof anonymizeUser>>,
  TError,
  { userId: string },
  TContext
> => {
  const mutationOptions = getAnonymizeUserMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Atualiza a senha do usuário logado.
 */
export const updateUserPassword = (
  updateUserPasswordBody: UpdateUserPasswordBody,
) => {
  return axiosInstance<UpdateUserPassword200>({
    url: `/users/update-password`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: updateUserPasswordBody,
  });
};

export const getUpdateUserPasswordMutationOptions = <
  TError =
    | UpdateUserPassword400
    | UpdateUserPassword401
    | UpdateUserPassword404
    | UpdateUserPassword409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateUserPassword>>,
    TError,
    { data: UpdateUserPasswordBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateUserPassword>>,
  TError,
  { data: UpdateUserPasswordBody },
  TContext
> => {
  const mutationKey = ["updateUserPassword"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateUserPassword>>,
    { data: UpdateUserPasswordBody }
  > = (props) => {
    const { data } = props ?? {};

    return updateUserPassword(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateUserPasswordMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateUserPassword>>
>;
export type UpdateUserPasswordMutationBody = UpdateUserPasswordBody;
export type UpdateUserPasswordMutationError =
  | UpdateUserPassword400
  | UpdateUserPassword401
  | UpdateUserPassword404
  | UpdateUserPassword409;

export const useUpdateUserPassword = <
  TError =
    | UpdateUserPassword400
    | UpdateUserPassword401
    | UpdateUserPassword404
    | UpdateUserPassword409,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateUserPassword>>,
      TError,
      { data: UpdateUserPasswordBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateUserPassword>>,
  TError,
  { data: UpdateUserPasswordBody },
  TContext
> => {
  const mutationOptions = getUpdateUserPasswordMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Verifica o e-mail do usuário.
 */
export const verifyUserEmail = (
  params: VerifyUserEmailParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<VerifyUserEmail200>({
    url: `/users/verify-email`,
    method: "GET",
    params,
    signal,
  });
};

export const getVerifyUserEmailQueryKey = (params: VerifyUserEmailParams) => {
  return [`/users/verify-email`, ...(params ? [params] : [])] as const;
};

export const getVerifyUserEmailInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof verifyUserEmail>>>,
  TError = VerifyUserEmail400,
>(
  params: VerifyUserEmailParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof verifyUserEmail>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getVerifyUserEmailQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof verifyUserEmail>>> = ({
    signal,
  }) => verifyUserEmail(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof verifyUserEmail>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type VerifyUserEmailInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof verifyUserEmail>>
>;
export type VerifyUserEmailInfiniteQueryError = VerifyUserEmail400;

export function useVerifyUserEmailInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof verifyUserEmail>>>,
  TError = VerifyUserEmail400,
>(
  params: VerifyUserEmailParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof verifyUserEmail>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof verifyUserEmail>>,
          TError,
          Awaited<ReturnType<typeof verifyUserEmail>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useVerifyUserEmailInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof verifyUserEmail>>>,
  TError = VerifyUserEmail400,
>(
  params: VerifyUserEmailParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof verifyUserEmail>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof verifyUserEmail>>,
          TError,
          Awaited<ReturnType<typeof verifyUserEmail>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useVerifyUserEmailInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof verifyUserEmail>>>,
  TError = VerifyUserEmail400,
>(
  params: VerifyUserEmailParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof verifyUserEmail>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useVerifyUserEmailInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof verifyUserEmail>>>,
  TError = VerifyUserEmail400,
>(
  params: VerifyUserEmailParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof verifyUserEmail>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getVerifyUserEmailInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getVerifyUserEmailQueryOptions = <
  TData = Awaited<ReturnType<typeof verifyUserEmail>>,
  TError = VerifyUserEmail400,
>(
  params: VerifyUserEmailParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof verifyUserEmail>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getVerifyUserEmailQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof verifyUserEmail>>> = ({
    signal,
  }) => verifyUserEmail(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof verifyUserEmail>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type VerifyUserEmailQueryResult = NonNullable<
  Awaited<ReturnType<typeof verifyUserEmail>>
>;
export type VerifyUserEmailQueryError = VerifyUserEmail400;

export function useVerifyUserEmail<
  TData = Awaited<ReturnType<typeof verifyUserEmail>>,
  TError = VerifyUserEmail400,
>(
  params: VerifyUserEmailParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof verifyUserEmail>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof verifyUserEmail>>,
          TError,
          Awaited<ReturnType<typeof verifyUserEmail>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useVerifyUserEmail<
  TData = Awaited<ReturnType<typeof verifyUserEmail>>,
  TError = VerifyUserEmail400,
>(
  params: VerifyUserEmailParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof verifyUserEmail>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof verifyUserEmail>>,
          TError,
          Awaited<ReturnType<typeof verifyUserEmail>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useVerifyUserEmail<
  TData = Awaited<ReturnType<typeof verifyUserEmail>>,
  TError = VerifyUserEmail400,
>(
  params: VerifyUserEmailParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof verifyUserEmail>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useVerifyUserEmail<
  TData = Awaited<ReturnType<typeof verifyUserEmail>>,
  TError = VerifyUserEmail400,
>(
  params: VerifyUserEmailParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof verifyUserEmail>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getVerifyUserEmailQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Envia um e-mail de verificação.
 */
export const sendUserVerificationEmail = (
  sendUserVerificationEmailBody: SendUserVerificationEmailBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<SendUserVerificationEmail200>({
    url: `/users/send-verification-email`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: sendUserVerificationEmailBody,
    signal,
  });
};

export const getSendUserVerificationEmailMutationOptions = <
  TError = SendUserVerificationEmail400 | SendUserVerificationEmail404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof sendUserVerificationEmail>>,
    TError,
    { data: SendUserVerificationEmailBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof sendUserVerificationEmail>>,
  TError,
  { data: SendUserVerificationEmailBody },
  TContext
> => {
  const mutationKey = ["sendUserVerificationEmail"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof sendUserVerificationEmail>>,
    { data: SendUserVerificationEmailBody }
  > = (props) => {
    const { data } = props ?? {};

    return sendUserVerificationEmail(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type SendUserVerificationEmailMutationResult = NonNullable<
  Awaited<ReturnType<typeof sendUserVerificationEmail>>
>;
export type SendUserVerificationEmailMutationBody =
  SendUserVerificationEmailBody;
export type SendUserVerificationEmailMutationError =
  | SendUserVerificationEmail400
  | SendUserVerificationEmail404;

export const useSendUserVerificationEmail = <
  TError = SendUserVerificationEmail400 | SendUserVerificationEmail404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof sendUserVerificationEmail>>,
      TError,
      { data: SendUserVerificationEmailBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof sendUserVerificationEmail>>,
  TError,
  { data: SendUserVerificationEmailBody },
  TContext
> => {
  const mutationOptions = getSendUserVerificationEmailMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Envia um e-mail para redefinição de senha.
 */
export const sendForgotPasswordEmail = (
  sendForgotPasswordEmailBody: SendForgotPasswordEmailBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<SendForgotPasswordEmail200>({
    url: `/users/forgot-password`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: sendForgotPasswordEmailBody,
    signal,
  });
};

export const getSendForgotPasswordEmailMutationOptions = <
  TError = SendForgotPasswordEmail400 | SendForgotPasswordEmail404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof sendForgotPasswordEmail>>,
    TError,
    { data: SendForgotPasswordEmailBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof sendForgotPasswordEmail>>,
  TError,
  { data: SendForgotPasswordEmailBody },
  TContext
> => {
  const mutationKey = ["sendForgotPasswordEmail"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof sendForgotPasswordEmail>>,
    { data: SendForgotPasswordEmailBody }
  > = (props) => {
    const { data } = props ?? {};

    return sendForgotPasswordEmail(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type SendForgotPasswordEmailMutationResult = NonNullable<
  Awaited<ReturnType<typeof sendForgotPasswordEmail>>
>;
export type SendForgotPasswordEmailMutationBody = SendForgotPasswordEmailBody;
export type SendForgotPasswordEmailMutationError =
  | SendForgotPasswordEmail400
  | SendForgotPasswordEmail404;

export const useSendForgotPasswordEmail = <
  TError = SendForgotPasswordEmail400 | SendForgotPasswordEmail404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof sendForgotPasswordEmail>>,
      TError,
      { data: SendForgotPasswordEmailBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof sendForgotPasswordEmail>>,
  TError,
  { data: SendForgotPasswordEmailBody },
  TContext
> => {
  const mutationOptions = getSendForgotPasswordEmailMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Redefine a senha do usuário.
 */
export const resetUserPassword = (
  resetUserPasswordBody: ResetUserPasswordBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<ResetUserPassword200>({
    url: `/users/reset-password`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: resetUserPasswordBody,
    signal,
  });
};

export const getResetUserPasswordMutationOptions = <
  TError = ResetUserPassword400 | ResetUserPassword401,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof resetUserPassword>>,
    TError,
    { data: ResetUserPasswordBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof resetUserPassword>>,
  TError,
  { data: ResetUserPasswordBody },
  TContext
> => {
  const mutationKey = ["resetUserPassword"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof resetUserPassword>>,
    { data: ResetUserPasswordBody }
  > = (props) => {
    const { data } = props ?? {};

    return resetUserPassword(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type ResetUserPasswordMutationResult = NonNullable<
  Awaited<ReturnType<typeof resetUserPassword>>
>;
export type ResetUserPasswordMutationBody = ResetUserPasswordBody;
export type ResetUserPasswordMutationError =
  | ResetUserPassword400
  | ResetUserPassword401;

export const useResetUserPassword = <
  TError = ResetUserPassword400 | ResetUserPassword401,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof resetUserPassword>>,
      TError,
      { data: ResetUserPasswordBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof resetUserPassword>>,
  TError,
  { data: ResetUserPasswordBody },
  TContext
> => {
  const mutationOptions = getResetUserPasswordMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
