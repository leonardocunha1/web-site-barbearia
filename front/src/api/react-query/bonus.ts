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
  GetBonusBalance200,
  GetBonusBalance401,
  GetBonusBalance404,
  PostBonusAssign201,
  PostBonusAssign400,
  PostBonusAssign404,
  PostBonusAssignBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Atribuir bônus a um usuário.
 */
export const postBonusAssign = (
  postBonusAssignBody: PostBonusAssignBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostBonusAssign201>({
    url: `/bonus/assign`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postBonusAssignBody,
    signal,
  });
};

export const getPostBonusAssignMutationOptions = <
  TError = PostBonusAssign400 | PostBonusAssign404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postBonusAssign>>,
    TError,
    { data: PostBonusAssignBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postBonusAssign>>,
  TError,
  { data: PostBonusAssignBody },
  TContext
> => {
  const mutationKey = ["postBonusAssign"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postBonusAssign>>,
    { data: PostBonusAssignBody }
  > = (props) => {
    const { data } = props ?? {};

    return postBonusAssign(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostBonusAssignMutationResult = NonNullable<
  Awaited<ReturnType<typeof postBonusAssign>>
>;
export type PostBonusAssignMutationBody = PostBonusAssignBody;
export type PostBonusAssignMutationError =
  | PostBonusAssign400
  | PostBonusAssign404;

export const usePostBonusAssign = <
  TError = PostBonusAssign400 | PostBonusAssign404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postBonusAssign>>,
    TError,
    { data: PostBonusAssignBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postBonusAssign>>,
  TError,
  { data: PostBonusAssignBody },
  TContext
> => {
  const mutationOptions = getPostBonusAssignMutationOptions(options);

  return useMutation(mutationOptions);
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
  TData = Awaited<ReturnType<typeof getBonusBalance>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(options?: {
  query?: UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getBonusBalance>>,
    TError,
    TData
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
  > & { queryKey: QueryKey };
};

export type GetBonusBalanceInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBonusBalance>>
>;
export type GetBonusBalanceInfiniteQueryError =
  | GetBonusBalance401
  | GetBonusBalance404;

export function useGetBonusBalanceInfinite<
  TData = Awaited<ReturnType<typeof getBonusBalance>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(options?: {
  query?: UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getBonusBalance>>,
    TError,
    TData
  >;
}): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBonusBalanceInfiniteQueryOptions(options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetBonusBalanceQueryOptions = <
  TData = Awaited<ReturnType<typeof getBonusBalance>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getBonusBalance>>,
    TError,
    TData
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
  > & { queryKey: QueryKey };
};

export type GetBonusBalanceQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBonusBalance>>
>;
export type GetBonusBalanceQueryError = GetBonusBalance401 | GetBonusBalance404;

export function useGetBonusBalance<
  TData = Awaited<ReturnType<typeof getBonusBalance>>,
  TError = GetBonusBalance401 | GetBonusBalance404,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getBonusBalance>>,
    TError,
    TData
  >;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBonusBalanceQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}
