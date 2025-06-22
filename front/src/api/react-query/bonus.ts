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
  AssignBonusToUser201,
  AssignBonusToUser400,
  AssignBonusToUser404,
  AssignBonusToUserBody,
  GetBonusBalance200,
  GetBonusBalance401,
  GetBonusBalance404,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Atribuir bônus a um usuário.
 */
export const assignBonusToUser = (
  assignBonusToUserBody: AssignBonusToUserBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<AssignBonusToUser201>({
    url: `/bonus/assign`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: assignBonusToUserBody,
    signal,
  });
};

export const getAssignBonusToUserMutationOptions = <
  TError = AssignBonusToUser400 | AssignBonusToUser404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof assignBonusToUser>>,
    TError,
    { data: AssignBonusToUserBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof assignBonusToUser>>,
  TError,
  { data: AssignBonusToUserBody },
  TContext
> => {
  const mutationKey = ["assignBonusToUser"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof assignBonusToUser>>,
    { data: AssignBonusToUserBody }
  > = (props) => {
    const { data } = props ?? {};

    return assignBonusToUser(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type AssignBonusToUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof assignBonusToUser>>
>;
export type AssignBonusToUserMutationBody = AssignBonusToUserBody;
export type AssignBonusToUserMutationError =
  | AssignBonusToUser400
  | AssignBonusToUser404;

export const useAssignBonusToUser = <
  TError = AssignBonusToUser400 | AssignBonusToUser404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof assignBonusToUser>>,
      TError,
      { data: AssignBonusToUserBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof assignBonusToUser>>,
  TError,
  { data: AssignBonusToUserBody },
  TContext
> => {
  const mutationOptions = getAssignBonusToUserMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Obter o saldo de bônus (pontos e valor em R$) do usuário autenticado.
 */
export const getBonusBalance = (signal?: AbortSignal) => {
  return axiosInstance<GetBonusBalance200>({
    url: `/bonus/balance`,
    method: "GET",
    signal,
  });
};

export const getGetBonusBalanceQueryKey = () => {
  return [`/bonus/balance`] as const;
};

export const getGetBonusBalanceInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getBonusBalance>>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getBonusBalance>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetBonusBalanceQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getBonusBalance>>> = ({
    signal,
  }) => getBonusBalance(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getBonusBalance>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetBonusBalanceInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBonusBalance>>
>;
export type GetBonusBalanceInfiniteQueryError =
  | GetBonusBalance401
  | GetBonusBalance404;

export function useGetBonusBalanceInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getBonusBalance>>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getBonusBalance>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getBonusBalance>>,
          TError,
          Awaited<ReturnType<typeof getBonusBalance>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetBonusBalanceInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getBonusBalance>>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getBonusBalance>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getBonusBalance>>,
          TError,
          Awaited<ReturnType<typeof getBonusBalance>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetBonusBalanceInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getBonusBalance>>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getBonusBalance>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetBonusBalanceInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getBonusBalance>>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getBonusBalance>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetBonusBalanceInfiniteQueryOptions(options);

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetBonusBalanceQueryOptions = <
  TData = Awaited<ReturnType<typeof getBonusBalance>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getBonusBalance>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetBonusBalanceQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getBonusBalance>>> = ({
    signal,
  }) => getBonusBalance(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getBonusBalance>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetBonusBalanceQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBonusBalance>>
>;
export type GetBonusBalanceQueryError = GetBonusBalance401 | GetBonusBalance404;

export function useGetBonusBalance<
  TData = Awaited<ReturnType<typeof getBonusBalance>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getBonusBalance>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getBonusBalance>>,
          TError,
          Awaited<ReturnType<typeof getBonusBalance>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetBonusBalance<
  TData = Awaited<ReturnType<typeof getBonusBalance>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getBonusBalance>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getBonusBalance>>,
          TError,
          Awaited<ReturnType<typeof getBonusBalance>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetBonusBalance<
  TData = Awaited<ReturnType<typeof getBonusBalance>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getBonusBalance>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetBonusBalance<
  TData = Awaited<ReturnType<typeof getBonusBalance>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getBonusBalance>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetBonusBalanceQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}
