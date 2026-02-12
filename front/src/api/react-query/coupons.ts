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
  CreateCoupon201,
  CreateCoupon400,
  CreateCoupon409,
  CreateCouponBody,
  DeleteCoupon200,
  DeleteCoupon404,
  GetCouponById200,
  GetCouponById404,
  ListCoupons200,
  ListCoupons400,
  ListCouponsParams,
  ToggleCouponStatus200,
  ToggleCouponStatus404,
  UpdateCoupon200,
  UpdateCoupon400,
  UpdateCoupon404,
  UpdateCouponBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Criação de um novo cupom.
 */
export const createCoupon = (
  createCouponBody: CreateCouponBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<CreateCoupon201>({
    url: `/coupons`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: createCouponBody,
    signal,
  });
};

export const getCreateCouponMutationOptions = <
  TError = CreateCoupon400 | CreateCoupon409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createCoupon>>,
    TError,
    { data: CreateCouponBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createCoupon>>,
  TError,
  { data: CreateCouponBody },
  TContext
> => {
  const mutationKey = ["createCoupon"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createCoupon>>,
    { data: CreateCouponBody }
  > = (props) => {
    const { data } = props ?? {};

    return createCoupon(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateCouponMutationResult = NonNullable<
  Awaited<ReturnType<typeof createCoupon>>
>;
export type CreateCouponMutationBody = CreateCouponBody;
export type CreateCouponMutationError = CreateCoupon400 | CreateCoupon409;

export const useCreateCoupon = <
  TError = CreateCoupon400 | CreateCoupon409,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createCoupon>>,
      TError,
      { data: CreateCouponBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createCoupon>>,
  TError,
  { data: CreateCouponBody },
  TContext
> => {
  const mutationOptions = getCreateCouponMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Lista todos os cupons com paginação.
 */
export const listCoupons = (
  params?: ListCouponsParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<ListCoupons200>({
    url: `/coupons`,
    method: "GET",
    params,
    signal,
  });
};

export const getListCouponsQueryKey = (params?: ListCouponsParams) => {
  return [`/coupons`, ...(params ? [params] : [])] as const;
};

export const getListCouponsInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof listCoupons>>>,
  TError = ListCoupons400,
>(
  params?: ListCouponsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listCoupons>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListCouponsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listCoupons>>> = ({
    signal,
  }) => listCoupons(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof listCoupons>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListCouponsInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof listCoupons>>
>;
export type ListCouponsInfiniteQueryError = ListCoupons400;

export function useListCouponsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listCoupons>>>,
  TError = ListCoupons400,
>(
  params: undefined | ListCouponsParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listCoupons>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listCoupons>>,
          TError,
          Awaited<ReturnType<typeof listCoupons>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListCouponsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listCoupons>>>,
  TError = ListCoupons400,
>(
  params?: ListCouponsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listCoupons>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listCoupons>>,
          TError,
          Awaited<ReturnType<typeof listCoupons>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListCouponsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listCoupons>>>,
  TError = ListCoupons400,
>(
  params?: ListCouponsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listCoupons>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListCouponsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listCoupons>>>,
  TError = ListCoupons400,
>(
  params?: ListCouponsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listCoupons>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListCouponsInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getListCouponsQueryOptions = <
  TData = Awaited<ReturnType<typeof listCoupons>>,
  TError = ListCoupons400,
>(
  params?: ListCouponsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listCoupons>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListCouponsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listCoupons>>> = ({
    signal,
  }) => listCoupons(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listCoupons>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListCouponsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listCoupons>>
>;
export type ListCouponsQueryError = ListCoupons400;

export function useListCoupons<
  TData = Awaited<ReturnType<typeof listCoupons>>,
  TError = ListCoupons400,
>(
  params: undefined | ListCouponsParams,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listCoupons>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listCoupons>>,
          TError,
          Awaited<ReturnType<typeof listCoupons>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListCoupons<
  TData = Awaited<ReturnType<typeof listCoupons>>,
  TError = ListCoupons400,
>(
  params?: ListCouponsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listCoupons>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listCoupons>>,
          TError,
          Awaited<ReturnType<typeof listCoupons>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListCoupons<
  TData = Awaited<ReturnType<typeof listCoupons>>,
  TError = ListCoupons400,
>(
  params?: ListCouponsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listCoupons>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListCoupons<
  TData = Awaited<ReturnType<typeof listCoupons>>,
  TError = ListCoupons400,
>(
  params?: ListCouponsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listCoupons>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListCouponsQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Retorna os detalhes de um cupom pelo ID.
 */
export const getCouponById = (couponId: string, signal?: AbortSignal) => {
  return axiosInstance<GetCouponById200>({
    url: `/coupons/${couponId}`,
    method: "GET",
    signal,
  });
};

export const getGetCouponByIdQueryKey = (couponId: string) => {
  return [`/coupons/${couponId}`] as const;
};

export const getGetCouponByIdInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getCouponById>>>,
  TError = GetCouponById404,
>(
  couponId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getCouponById>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetCouponByIdQueryKey(couponId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getCouponById>>> = ({
    signal,
  }) => getCouponById(couponId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!couponId,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getCouponById>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetCouponByIdInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCouponById>>
>;
export type GetCouponByIdInfiniteQueryError = GetCouponById404;

export function useGetCouponByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getCouponById>>>,
  TError = GetCouponById404,
>(
  couponId: string,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getCouponById>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCouponById>>,
          TError,
          Awaited<ReturnType<typeof getCouponById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCouponByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getCouponById>>>,
  TError = GetCouponById404,
>(
  couponId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getCouponById>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCouponById>>,
          TError,
          Awaited<ReturnType<typeof getCouponById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCouponByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getCouponById>>>,
  TError = GetCouponById404,
>(
  couponId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getCouponById>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetCouponByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getCouponById>>>,
  TError = GetCouponById404,
>(
  couponId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getCouponById>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetCouponByIdInfiniteQueryOptions(couponId, options);

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetCouponByIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getCouponById>>,
  TError = GetCouponById404,
>(
  couponId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getCouponById>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetCouponByIdQueryKey(couponId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getCouponById>>> = ({
    signal,
  }) => getCouponById(couponId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!couponId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getCouponById>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetCouponByIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCouponById>>
>;
export type GetCouponByIdQueryError = GetCouponById404;

export function useGetCouponById<
  TData = Awaited<ReturnType<typeof getCouponById>>,
  TError = GetCouponById404,
>(
  couponId: string,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getCouponById>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCouponById>>,
          TError,
          Awaited<ReturnType<typeof getCouponById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCouponById<
  TData = Awaited<ReturnType<typeof getCouponById>>,
  TError = GetCouponById404,
>(
  couponId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getCouponById>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCouponById>>,
          TError,
          Awaited<ReturnType<typeof getCouponById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCouponById<
  TData = Awaited<ReturnType<typeof getCouponById>>,
  TError = GetCouponById404,
>(
  couponId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getCouponById>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetCouponById<
  TData = Awaited<ReturnType<typeof getCouponById>>,
  TError = GetCouponById404,
>(
  couponId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getCouponById>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetCouponByIdQueryOptions(couponId, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Atualiza um cupom existente.
 */
export const updateCoupon = (
  couponId: string,
  updateCouponBody: UpdateCouponBody,
) => {
  return axiosInstance<UpdateCoupon200>({
    url: `/coupons/${couponId}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: updateCouponBody,
  });
};

export const getUpdateCouponMutationOptions = <
  TError = UpdateCoupon400 | UpdateCoupon404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateCoupon>>,
    TError,
    { couponId: string; data: UpdateCouponBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateCoupon>>,
  TError,
  { couponId: string; data: UpdateCouponBody },
  TContext
> => {
  const mutationKey = ["updateCoupon"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateCoupon>>,
    { couponId: string; data: UpdateCouponBody }
  > = (props) => {
    const { couponId, data } = props ?? {};

    return updateCoupon(couponId, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateCouponMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateCoupon>>
>;
export type UpdateCouponMutationBody = UpdateCouponBody;
export type UpdateCouponMutationError = UpdateCoupon400 | UpdateCoupon404;

export const useUpdateCoupon = <
  TError = UpdateCoupon400 | UpdateCoupon404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateCoupon>>,
      TError,
      { couponId: string; data: UpdateCouponBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateCoupon>>,
  TError,
  { couponId: string; data: UpdateCouponBody },
  TContext
> => {
  const mutationOptions = getUpdateCouponMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Deleta um cupom pelo ID.
 */
export const deleteCoupon = (couponId: string) => {
  return axiosInstance<DeleteCoupon200>({
    url: `/coupons/${couponId}`,
    method: "DELETE",
  });
};

export const getDeleteCouponMutationOptions = <
  TError = DeleteCoupon404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteCoupon>>,
    TError,
    { couponId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteCoupon>>,
  TError,
  { couponId: string },
  TContext
> => {
  const mutationKey = ["deleteCoupon"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteCoupon>>,
    { couponId: string }
  > = (props) => {
    const { couponId } = props ?? {};

    return deleteCoupon(couponId);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteCouponMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteCoupon>>
>;

export type DeleteCouponMutationError = DeleteCoupon404;

export const useDeleteCoupon = <TError = DeleteCoupon404, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteCoupon>>,
      TError,
      { couponId: string },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteCoupon>>,
  TError,
  { couponId: string },
  TContext
> => {
  const mutationOptions = getDeleteCouponMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Ativa ou desativa o status de um cupom.
 */
export const toggleCouponStatus = (couponId: string) => {
  return axiosInstance<ToggleCouponStatus200>({
    url: `/coupons/${couponId}/toggle-status`,
    method: "PATCH",
  });
};

export const getToggleCouponStatusMutationOptions = <
  TError = ToggleCouponStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof toggleCouponStatus>>,
    TError,
    { couponId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof toggleCouponStatus>>,
  TError,
  { couponId: string },
  TContext
> => {
  const mutationKey = ["toggleCouponStatus"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof toggleCouponStatus>>,
    { couponId: string }
  > = (props) => {
    const { couponId } = props ?? {};

    return toggleCouponStatus(couponId);
  };

  return { mutationFn, ...mutationOptions };
};

export type ToggleCouponStatusMutationResult = NonNullable<
  Awaited<ReturnType<typeof toggleCouponStatus>>
>;

export type ToggleCouponStatusMutationError = ToggleCouponStatus404;

export const useToggleCouponStatus = <
  TError = ToggleCouponStatus404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof toggleCouponStatus>>,
      TError,
      { couponId: string },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof toggleCouponStatus>>,
  TError,
  { couponId: string },
  TContext
> => {
  const mutationOptions = getToggleCouponStatusMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
