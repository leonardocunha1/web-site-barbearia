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
  CreateService201,
  CreateService400,
  CreateService403,
  CreateService404,
  CreateServiceBody,
  DeleteServiceById204,
  DeleteServiceById400,
  DeleteServiceById404,
  DeleteServiceByIdParams,
  GetServiceById200,
  GetServiceById400,
  GetServiceById404,
  ListServices200,
  ListServices400,
  ListServices404,
  ListServicesParams,
  ToggleServiceStatusById200,
  ToggleServiceStatusById400,
  ToggleServiceStatusById404,
  UpdateServiceById200,
  UpdateServiceById400,
  UpdateServiceById404,
  UpdateServiceByIdBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

export const createService = (
  createServiceBody: CreateServiceBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<CreateService201>({
    url: `/services`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: createServiceBody,
    signal,
  });
};

export const getCreateServiceMutationOptions = <
  TError = CreateService400 | CreateService403 | CreateService404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createService>>,
    TError,
    { data: CreateServiceBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createService>>,
  TError,
  { data: CreateServiceBody },
  TContext
> => {
  const mutationKey = ["createService"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createService>>,
    { data: CreateServiceBody }
  > = (props) => {
    const { data } = props ?? {};

    return createService(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateServiceMutationResult = NonNullable<
  Awaited<ReturnType<typeof createService>>
>;
export type CreateServiceMutationBody = CreateServiceBody;
export type CreateServiceMutationError =
  | CreateService400
  | CreateService403
  | CreateService404;

export const useCreateService = <
  TError = CreateService400 | CreateService403 | CreateService404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createService>>,
      TError,
      { data: CreateServiceBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createService>>,
  TError,
  { data: CreateServiceBody },
  TContext
> => {
  const mutationOptions = getCreateServiceMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
export const listServices = (
  params?: ListServicesParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<ListServices200>({
    url: `/services`,
    method: "GET",
    params,
    signal,
  });
};

export const getListServicesQueryKey = (params?: ListServicesParams) => {
  return [`/services`, ...(params ? [params] : [])] as const;
};

export const getListServicesInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof listServices>>>,
  TError = ListServices400 | ListServices404,
>(
  params?: ListServicesParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listServices>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListServicesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listServices>>> = ({
    signal,
  }) => listServices(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof listServices>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListServicesInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof listServices>>
>;
export type ListServicesInfiniteQueryError = ListServices400 | ListServices404;

export function useListServicesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listServices>>>,
  TError = ListServices400 | ListServices404,
>(
  params: undefined | ListServicesParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listServices>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listServices>>,
          TError,
          Awaited<ReturnType<typeof listServices>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListServicesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listServices>>>,
  TError = ListServices400 | ListServices404,
>(
  params?: ListServicesParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listServices>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listServices>>,
          TError,
          Awaited<ReturnType<typeof listServices>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListServicesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listServices>>>,
  TError = ListServices400 | ListServices404,
>(
  params?: ListServicesParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listServices>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListServicesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listServices>>>,
  TError = ListServices400 | ListServices404,
>(
  params?: ListServicesParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listServices>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListServicesInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getListServicesQueryOptions = <
  TData = Awaited<ReturnType<typeof listServices>>,
  TError = ListServices400 | ListServices404,
>(
  params?: ListServicesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListServicesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listServices>>> = ({
    signal,
  }) => listServices(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listServices>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListServicesQueryResult = NonNullable<
  Awaited<ReturnType<typeof listServices>>
>;
export type ListServicesQueryError = ListServices400 | ListServices404;

export function useListServices<
  TData = Awaited<ReturnType<typeof listServices>>,
  TError = ListServices400 | ListServices404,
>(
  params: undefined | ListServicesParams,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listServices>>,
          TError,
          Awaited<ReturnType<typeof listServices>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListServices<
  TData = Awaited<ReturnType<typeof listServices>>,
  TError = ListServices400 | ListServices404,
>(
  params?: ListServicesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listServices>>,
          TError,
          Awaited<ReturnType<typeof listServices>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListServices<
  TData = Awaited<ReturnType<typeof listServices>>,
  TError = ListServices400 | ListServices404,
>(
  params?: ListServicesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListServices<
  TData = Awaited<ReturnType<typeof listServices>>,
  TError = ListServices400 | ListServices404,
>(
  params?: ListServicesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListServicesQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getServiceById = (id: string, signal?: AbortSignal) => {
  return axiosInstance<GetServiceById200>({
    url: `/services/${id}`,
    method: "GET",
    signal,
  });
};

export const getGetServiceByIdQueryKey = (id: string) => {
  return [`/services/${id}`] as const;
};

export const getGetServiceByIdInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getServiceById>>>,
  TError = GetServiceById400 | GetServiceById404,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getServiceById>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetServiceByIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getServiceById>>> = ({
    signal,
  }) => getServiceById(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getServiceById>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetServiceByIdInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getServiceById>>
>;
export type GetServiceByIdInfiniteQueryError =
  | GetServiceById400
  | GetServiceById404;

export function useGetServiceByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getServiceById>>>,
  TError = GetServiceById400 | GetServiceById404,
>(
  id: string,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getServiceById>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getServiceById>>,
          TError,
          Awaited<ReturnType<typeof getServiceById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetServiceByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getServiceById>>>,
  TError = GetServiceById400 | GetServiceById404,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getServiceById>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getServiceById>>,
          TError,
          Awaited<ReturnType<typeof getServiceById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetServiceByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getServiceById>>>,
  TError = GetServiceById400 | GetServiceById404,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getServiceById>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetServiceByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getServiceById>>>,
  TError = GetServiceById400 | GetServiceById404,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getServiceById>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetServiceByIdInfiniteQueryOptions(id, options);

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetServiceByIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getServiceById>>,
  TError = GetServiceById400 | GetServiceById404,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getServiceById>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetServiceByIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getServiceById>>> = ({
    signal,
  }) => getServiceById(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getServiceById>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetServiceByIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getServiceById>>
>;
export type GetServiceByIdQueryError = GetServiceById400 | GetServiceById404;

export function useGetServiceById<
  TData = Awaited<ReturnType<typeof getServiceById>>,
  TError = GetServiceById400 | GetServiceById404,
>(
  id: string,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getServiceById>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getServiceById>>,
          TError,
          Awaited<ReturnType<typeof getServiceById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetServiceById<
  TData = Awaited<ReturnType<typeof getServiceById>>,
  TError = GetServiceById400 | GetServiceById404,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getServiceById>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getServiceById>>,
          TError,
          Awaited<ReturnType<typeof getServiceById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetServiceById<
  TData = Awaited<ReturnType<typeof getServiceById>>,
  TError = GetServiceById400 | GetServiceById404,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getServiceById>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetServiceById<
  TData = Awaited<ReturnType<typeof getServiceById>>,
  TError = GetServiceById400 | GetServiceById404,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getServiceById>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetServiceByIdQueryOptions(id, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const updateServiceById = (
  id: string,
  updateServiceByIdBody: UpdateServiceByIdBody,
) => {
  return axiosInstance<UpdateServiceById200>({
    url: `/services/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: updateServiceByIdBody,
  });
};

export const getUpdateServiceByIdMutationOptions = <
  TError = UpdateServiceById400 | UpdateServiceById404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateServiceById>>,
    TError,
    { id: string; data: UpdateServiceByIdBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateServiceById>>,
  TError,
  { id: string; data: UpdateServiceByIdBody },
  TContext
> => {
  const mutationKey = ["updateServiceById"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateServiceById>>,
    { id: string; data: UpdateServiceByIdBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return updateServiceById(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateServiceByIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateServiceById>>
>;
export type UpdateServiceByIdMutationBody = UpdateServiceByIdBody;
export type UpdateServiceByIdMutationError =
  | UpdateServiceById400
  | UpdateServiceById404;

export const useUpdateServiceById = <
  TError = UpdateServiceById400 | UpdateServiceById404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateServiceById>>,
      TError,
      { id: string; data: UpdateServiceByIdBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateServiceById>>,
  TError,
  { id: string; data: UpdateServiceByIdBody },
  TContext
> => {
  const mutationOptions = getUpdateServiceByIdMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
export const deleteServiceById = (
  id: string,
  params?: DeleteServiceByIdParams,
) => {
  return axiosInstance<DeleteServiceById204>({
    url: `/services/${id}`,
    method: "DELETE",
    params,
  });
};

export const getDeleteServiceByIdMutationOptions = <
  TError = DeleteServiceById400 | DeleteServiceById404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteServiceById>>,
    TError,
    { id: string; params?: DeleteServiceByIdParams },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteServiceById>>,
  TError,
  { id: string; params?: DeleteServiceByIdParams },
  TContext
> => {
  const mutationKey = ["deleteServiceById"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteServiceById>>,
    { id: string; params?: DeleteServiceByIdParams }
  > = (props) => {
    const { id, params } = props ?? {};

    return deleteServiceById(id, params);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteServiceByIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteServiceById>>
>;

export type DeleteServiceByIdMutationError =
  | DeleteServiceById400
  | DeleteServiceById404;

export const useDeleteServiceById = <
  TError = DeleteServiceById400 | DeleteServiceById404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteServiceById>>,
      TError,
      { id: string; params?: DeleteServiceByIdParams },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteServiceById>>,
  TError,
  { id: string; params?: DeleteServiceByIdParams },
  TContext
> => {
  const mutationOptions = getDeleteServiceByIdMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
export const toggleServiceStatusById = (id: string) => {
  return axiosInstance<ToggleServiceStatusById200>({
    url: `/services/${id}/status`,
    method: "PATCH",
  });
};

export const getToggleServiceStatusByIdMutationOptions = <
  TError = ToggleServiceStatusById400 | ToggleServiceStatusById404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof toggleServiceStatusById>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof toggleServiceStatusById>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationKey = ["toggleServiceStatusById"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof toggleServiceStatusById>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return toggleServiceStatusById(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type ToggleServiceStatusByIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof toggleServiceStatusById>>
>;

export type ToggleServiceStatusByIdMutationError =
  | ToggleServiceStatusById400
  | ToggleServiceStatusById404;

export const useToggleServiceStatusById = <
  TError = ToggleServiceStatusById400 | ToggleServiceStatusById404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof toggleServiceStatusById>>,
      TError,
      { id: string },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof toggleServiceStatusById>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getToggleServiceStatusByIdMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
