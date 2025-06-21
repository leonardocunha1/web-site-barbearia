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
  DeleteCouponsCouponId204,
  DeleteCouponsCouponId404,
  GetCoupons200,
  GetCoupons400,
  GetCouponsCouponId200,
  GetCouponsCouponId404,
  GetCouponsParams,
  PatchCouponsCouponIdToggleStatus200,
  PatchCouponsCouponIdToggleStatus404,
  PostCoupons201,
  PostCoupons400,
  PostCoupons409,
  PostCouponsBody,
  PutCouponsCouponId200,
  PutCouponsCouponId400,
  PutCouponsCouponId404,
  PutCouponsCouponIdBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Criação de um novo cupom.
 */
export const postCoupons = (
  postCouponsBody: PostCouponsBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostCoupons201>({
    url: `/coupons`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postCouponsBody,
    signal,
  });
};

export const getPostCouponsMutationOptions = <
  TError = PostCoupons400 | PostCoupons409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postCoupons>>,
    TError,
    { data: PostCouponsBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postCoupons>>,
  TError,
  { data: PostCouponsBody },
  TContext
> => {
  const mutationKey = ["postCoupons"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postCoupons>>,
    { data: PostCouponsBody }
  > = (props) => {
    const { data } = props ?? {};

    return postCoupons(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostCouponsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postCoupons>>
>;
export type PostCouponsMutationBody = PostCouponsBody;
export type PostCouponsMutationError = PostCoupons400 | PostCoupons409;

export const usePostCoupons = <
  TError = PostCoupons400 | PostCoupons409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postCoupons>>,
    TError,
    { data: PostCouponsBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postCoupons>>,
  TError,
  { data: PostCouponsBody },
  TContext
> => {
  const mutationOptions = getPostCouponsMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Lista todos os cupons com paginação.
 */
export const getCoupons = (params?: GetCouponsParams, signal?: AbortSignal) => {
  return axiosInstance<GetCoupons200>({
    url: `/coupons`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetCouponsQueryKey = (params?: GetCouponsParams) => {
  return [`/coupons`, ...(params ? [params] : [])] as const;
};

export const getGetCouponsInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getCoupons>>,
  TError = GetCoupons400,
>(
  params?: GetCouponsParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getCoupons>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetCouponsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getCoupons>>> = ({
    signal,
  }) => getCoupons(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getCoupons>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetCouponsInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCoupons>>
>;
export type GetCouponsInfiniteQueryError = GetCoupons400;

export function useGetCouponsInfinite<
  TData = Awaited<ReturnType<typeof getCoupons>>,
  TError = GetCoupons400,
>(
  params?: GetCouponsParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getCoupons>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetCouponsInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetCouponsQueryOptions = <
  TData = Awaited<ReturnType<typeof getCoupons>>,
  TError = GetCoupons400,
>(
  params?: GetCouponsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getCoupons>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetCouponsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getCoupons>>> = ({
    signal,
  }) => getCoupons(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getCoupons>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetCouponsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCoupons>>
>;
export type GetCouponsQueryError = GetCoupons400;

export function useGetCoupons<
  TData = Awaited<ReturnType<typeof getCoupons>>,
  TError = GetCoupons400,
>(
  params?: GetCouponsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getCoupons>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetCouponsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Retorna os detalhes de um cupom pelo ID.
 */
export const getCouponsCouponId = (couponId: string, signal?: AbortSignal) => {
  return axiosInstance<GetCouponsCouponId200>({
    url: `/coupons/${couponId}`,
    method: "GET",
    signal,
  });
};

export const getGetCouponsCouponIdQueryKey = (couponId: string) => {
  return [`/coupons/${couponId}`] as const;
};

export const getGetCouponsCouponIdInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getCouponsCouponId>>,
  TError = GetCouponsCouponId404,
>(
  couponId: string,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getCouponsCouponId>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetCouponsCouponIdQueryKey(couponId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getCouponsCouponId>>
  > = ({ signal }) => getCouponsCouponId(couponId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!couponId,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getCouponsCouponId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetCouponsCouponIdInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCouponsCouponId>>
>;
export type GetCouponsCouponIdInfiniteQueryError = GetCouponsCouponId404;

export function useGetCouponsCouponIdInfinite<
  TData = Awaited<ReturnType<typeof getCouponsCouponId>>,
  TError = GetCouponsCouponId404,
>(
  couponId: string,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getCouponsCouponId>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetCouponsCouponIdInfiniteQueryOptions(
    couponId,
    options,
  );

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetCouponsCouponIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getCouponsCouponId>>,
  TError = GetCouponsCouponId404,
>(
  couponId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getCouponsCouponId>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetCouponsCouponIdQueryKey(couponId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getCouponsCouponId>>
  > = ({ signal }) => getCouponsCouponId(couponId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!couponId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getCouponsCouponId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetCouponsCouponIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCouponsCouponId>>
>;
export type GetCouponsCouponIdQueryError = GetCouponsCouponId404;

export function useGetCouponsCouponId<
  TData = Awaited<ReturnType<typeof getCouponsCouponId>>,
  TError = GetCouponsCouponId404,
>(
  couponId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getCouponsCouponId>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetCouponsCouponIdQueryOptions(couponId, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Atualiza um cupom existente.
 */
export const putCouponsCouponId = (
  couponId: string,
  putCouponsCouponIdBody: PutCouponsCouponIdBody,
) => {
  return axiosInstance<PutCouponsCouponId200>({
    url: `/coupons/${couponId}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: putCouponsCouponIdBody,
  });
};

export const getPutCouponsCouponIdMutationOptions = <
  TError = PutCouponsCouponId400 | PutCouponsCouponId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putCouponsCouponId>>,
    TError,
    { couponId: string; data: PutCouponsCouponIdBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putCouponsCouponId>>,
  TError,
  { couponId: string; data: PutCouponsCouponIdBody },
  TContext
> => {
  const mutationKey = ["putCouponsCouponId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putCouponsCouponId>>,
    { couponId: string; data: PutCouponsCouponIdBody }
  > = (props) => {
    const { couponId, data } = props ?? {};

    return putCouponsCouponId(couponId, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutCouponsCouponIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putCouponsCouponId>>
>;
export type PutCouponsCouponIdMutationBody = PutCouponsCouponIdBody;
export type PutCouponsCouponIdMutationError =
  | PutCouponsCouponId400
  | PutCouponsCouponId404;

export const usePutCouponsCouponId = <
  TError = PutCouponsCouponId400 | PutCouponsCouponId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putCouponsCouponId>>,
    TError,
    { couponId: string; data: PutCouponsCouponIdBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof putCouponsCouponId>>,
  TError,
  { couponId: string; data: PutCouponsCouponIdBody },
  TContext
> => {
  const mutationOptions = getPutCouponsCouponIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Deleta um cupom pelo ID.
 */
export const deleteCouponsCouponId = (couponId: string) => {
  return axiosInstance<DeleteCouponsCouponId204>({
    url: `/coupons/${couponId}`,
    method: "DELETE",
  });
};

export const getDeleteCouponsCouponIdMutationOptions = <
  TError = DeleteCouponsCouponId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteCouponsCouponId>>,
    TError,
    { couponId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteCouponsCouponId>>,
  TError,
  { couponId: string },
  TContext
> => {
  const mutationKey = ["deleteCouponsCouponId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteCouponsCouponId>>,
    { couponId: string }
  > = (props) => {
    const { couponId } = props ?? {};

    return deleteCouponsCouponId(couponId);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteCouponsCouponIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteCouponsCouponId>>
>;

export type DeleteCouponsCouponIdMutationError = DeleteCouponsCouponId404;

export const useDeleteCouponsCouponId = <
  TError = DeleteCouponsCouponId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteCouponsCouponId>>,
    TError,
    { couponId: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteCouponsCouponId>>,
  TError,
  { couponId: string },
  TContext
> => {
  const mutationOptions = getDeleteCouponsCouponIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Ativa ou desativa o status de um cupom.
 */
export const patchCouponsCouponIdToggleStatus = (couponId: string) => {
  return axiosInstance<PatchCouponsCouponIdToggleStatus200>({
    url: `/coupons/${couponId}/toggle-status`,
    method: "PATCH",
  });
};

export const getPatchCouponsCouponIdToggleStatusMutationOptions = <
  TError = PatchCouponsCouponIdToggleStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchCouponsCouponIdToggleStatus>>,
    TError,
    { couponId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchCouponsCouponIdToggleStatus>>,
  TError,
  { couponId: string },
  TContext
> => {
  const mutationKey = ["patchCouponsCouponIdToggleStatus"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchCouponsCouponIdToggleStatus>>,
    { couponId: string }
  > = (props) => {
    const { couponId } = props ?? {};

    return patchCouponsCouponIdToggleStatus(couponId);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchCouponsCouponIdToggleStatusMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchCouponsCouponIdToggleStatus>>
>;

export type PatchCouponsCouponIdToggleStatusMutationError =
  PatchCouponsCouponIdToggleStatus404;

export const usePatchCouponsCouponIdToggleStatus = <
  TError = PatchCouponsCouponIdToggleStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchCouponsCouponIdToggleStatus>>,
    TError,
    { couponId: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchCouponsCouponIdToggleStatus>>,
  TError,
  { couponId: string },
  TContext
> => {
  const mutationOptions =
    getPatchCouponsCouponIdToggleStatusMutationOptions(options);

  return useMutation(mutationOptions);
};
