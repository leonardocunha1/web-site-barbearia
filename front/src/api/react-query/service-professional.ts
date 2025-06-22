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
  AddServiceToProfessional201,
  AddServiceToProfessional400,
  AddServiceToProfessional404,
  AddServiceToProfessional409,
  AddServiceToProfessionalBody,
  ListProfessionalServices200,
  ListProfessionalServices400,
  ListProfessionalServicesParams,
  RemoveServiceFromProfessional204,
  RemoveServiceFromProfessional400,
  RemoveServiceFromProfessional404,
  UpdateServiceProfessional204,
  UpdateServiceProfessional400,
  UpdateServiceProfessional500,
  UpdateServiceProfessionalBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

export const addServiceToProfessional = (
  professionalId: string,
  addServiceToProfessionalBody: AddServiceToProfessionalBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<AddServiceToProfessional201>({
    url: `/professionals/${professionalId}/services`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: addServiceToProfessionalBody,
    signal,
  });
};

export const getAddServiceToProfessionalMutationOptions = <
  TError =
    | AddServiceToProfessional400
    | AddServiceToProfessional404
    | AddServiceToProfessional409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addServiceToProfessional>>,
    TError,
    { professionalId: string; data: AddServiceToProfessionalBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof addServiceToProfessional>>,
  TError,
  { professionalId: string; data: AddServiceToProfessionalBody },
  TContext
> => {
  const mutationKey = ["addServiceToProfessional"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof addServiceToProfessional>>,
    { professionalId: string; data: AddServiceToProfessionalBody }
  > = (props) => {
    const { professionalId, data } = props ?? {};

    return addServiceToProfessional(professionalId, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type AddServiceToProfessionalMutationResult = NonNullable<
  Awaited<ReturnType<typeof addServiceToProfessional>>
>;
export type AddServiceToProfessionalMutationBody = AddServiceToProfessionalBody;
export type AddServiceToProfessionalMutationError =
  | AddServiceToProfessional400
  | AddServiceToProfessional404
  | AddServiceToProfessional409;

export const useAddServiceToProfessional = <
  TError =
    | AddServiceToProfessional400
    | AddServiceToProfessional404
    | AddServiceToProfessional409,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof addServiceToProfessional>>,
      TError,
      { professionalId: string; data: AddServiceToProfessionalBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof addServiceToProfessional>>,
  TError,
  { professionalId: string; data: AddServiceToProfessionalBody },
  TContext
> => {
  const mutationOptions = getAddServiceToProfessionalMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
export const listProfessionalServices = (
  professionalId: string,
  params?: ListProfessionalServicesParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<ListProfessionalServices200>({
    url: `/professionals/${professionalId}/services`,
    method: "GET",
    params,
    signal,
  });
};

export const getListProfessionalServicesQueryKey = (
  professionalId: string,
  params?: ListProfessionalServicesParams,
) => {
  return [
    `/professionals/${professionalId}/services`,
    ...(params ? [params] : []),
  ] as const;
};

export const getListProfessionalServicesInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof listProfessionalServices>>>,
  TError = ListProfessionalServices400,
>(
  professionalId: string,
  params?: ListProfessionalServicesParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listProfessionalServices>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getListProfessionalServicesQueryKey(professionalId, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listProfessionalServices>>
  > = ({ signal }) => listProfessionalServices(professionalId, params, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!professionalId,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof listProfessionalServices>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListProfessionalServicesInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof listProfessionalServices>>
>;
export type ListProfessionalServicesInfiniteQueryError =
  ListProfessionalServices400;

export function useListProfessionalServicesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listProfessionalServices>>>,
  TError = ListProfessionalServices400,
>(
  professionalId: string,
  params: undefined | ListProfessionalServicesParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listProfessionalServices>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listProfessionalServices>>,
          TError,
          Awaited<ReturnType<typeof listProfessionalServices>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListProfessionalServicesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listProfessionalServices>>>,
  TError = ListProfessionalServices400,
>(
  professionalId: string,
  params?: ListProfessionalServicesParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listProfessionalServices>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listProfessionalServices>>,
          TError,
          Awaited<ReturnType<typeof listProfessionalServices>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListProfessionalServicesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listProfessionalServices>>>,
  TError = ListProfessionalServices400,
>(
  professionalId: string,
  params?: ListProfessionalServicesParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listProfessionalServices>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListProfessionalServicesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listProfessionalServices>>>,
  TError = ListProfessionalServices400,
>(
  professionalId: string,
  params?: ListProfessionalServicesParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listProfessionalServices>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListProfessionalServicesInfiniteQueryOptions(
    professionalId,
    params,
    options,
  );

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getListProfessionalServicesQueryOptions = <
  TData = Awaited<ReturnType<typeof listProfessionalServices>>,
  TError = ListProfessionalServices400,
>(
  professionalId: string,
  params?: ListProfessionalServicesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listProfessionalServices>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getListProfessionalServicesQueryKey(professionalId, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listProfessionalServices>>
  > = ({ signal }) => listProfessionalServices(professionalId, params, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!professionalId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof listProfessionalServices>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListProfessionalServicesQueryResult = NonNullable<
  Awaited<ReturnType<typeof listProfessionalServices>>
>;
export type ListProfessionalServicesQueryError = ListProfessionalServices400;

export function useListProfessionalServices<
  TData = Awaited<ReturnType<typeof listProfessionalServices>>,
  TError = ListProfessionalServices400,
>(
  professionalId: string,
  params: undefined | ListProfessionalServicesParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listProfessionalServices>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listProfessionalServices>>,
          TError,
          Awaited<ReturnType<typeof listProfessionalServices>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListProfessionalServices<
  TData = Awaited<ReturnType<typeof listProfessionalServices>>,
  TError = ListProfessionalServices400,
>(
  professionalId: string,
  params?: ListProfessionalServicesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listProfessionalServices>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listProfessionalServices>>,
          TError,
          Awaited<ReturnType<typeof listProfessionalServices>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListProfessionalServices<
  TData = Awaited<ReturnType<typeof listProfessionalServices>>,
  TError = ListProfessionalServices400,
>(
  professionalId: string,
  params?: ListProfessionalServicesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listProfessionalServices>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListProfessionalServices<
  TData = Awaited<ReturnType<typeof listProfessionalServices>>,
  TError = ListProfessionalServices400,
>(
  professionalId: string,
  params?: ListProfessionalServicesParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listProfessionalServices>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListProfessionalServicesQueryOptions(
    professionalId,
    params,
    options,
  );

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const removeServiceFromProfessional = (
  professionalId: string,
  serviceId: string,
) => {
  return axiosInstance<RemoveServiceFromProfessional204>({
    url: `/professionals/${professionalId}/services/${serviceId}`,
    method: "DELETE",
  });
};

export const getRemoveServiceFromProfessionalMutationOptions = <
  TError = RemoveServiceFromProfessional400 | RemoveServiceFromProfessional404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof removeServiceFromProfessional>>,
    TError,
    { professionalId: string; serviceId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof removeServiceFromProfessional>>,
  TError,
  { professionalId: string; serviceId: string },
  TContext
> => {
  const mutationKey = ["removeServiceFromProfessional"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof removeServiceFromProfessional>>,
    { professionalId: string; serviceId: string }
  > = (props) => {
    const { professionalId, serviceId } = props ?? {};

    return removeServiceFromProfessional(professionalId, serviceId);
  };

  return { mutationFn, ...mutationOptions };
};

export type RemoveServiceFromProfessionalMutationResult = NonNullable<
  Awaited<ReturnType<typeof removeServiceFromProfessional>>
>;

export type RemoveServiceFromProfessionalMutationError =
  | RemoveServiceFromProfessional400
  | RemoveServiceFromProfessional404;

export const useRemoveServiceFromProfessional = <
  TError = RemoveServiceFromProfessional400 | RemoveServiceFromProfessional404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof removeServiceFromProfessional>>,
      TError,
      { professionalId: string; serviceId: string },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof removeServiceFromProfessional>>,
  TError,
  { professionalId: string; serviceId: string },
  TContext
> => {
  const mutationOptions =
    getRemoveServiceFromProfessionalMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
export const updateServiceProfessional = (
  professionalId: string,
  serviceId: string,
  updateServiceProfessionalBody: UpdateServiceProfessionalBody,
) => {
  return axiosInstance<UpdateServiceProfessional204>({
    url: `/professionals/${professionalId}/services/${serviceId}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: updateServiceProfessionalBody,
  });
};

export const getUpdateServiceProfessionalMutationOptions = <
  TError = UpdateServiceProfessional400 | UpdateServiceProfessional500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateServiceProfessional>>,
    TError,
    {
      professionalId: string;
      serviceId: string;
      data: UpdateServiceProfessionalBody;
    },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateServiceProfessional>>,
  TError,
  {
    professionalId: string;
    serviceId: string;
    data: UpdateServiceProfessionalBody;
  },
  TContext
> => {
  const mutationKey = ["updateServiceProfessional"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateServiceProfessional>>,
    {
      professionalId: string;
      serviceId: string;
      data: UpdateServiceProfessionalBody;
    }
  > = (props) => {
    const { professionalId, serviceId, data } = props ?? {};

    return updateServiceProfessional(professionalId, serviceId, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateServiceProfessionalMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateServiceProfessional>>
>;
export type UpdateServiceProfessionalMutationBody =
  UpdateServiceProfessionalBody;
export type UpdateServiceProfessionalMutationError =
  | UpdateServiceProfessional400
  | UpdateServiceProfessional500;

export const useUpdateServiceProfessional = <
  TError = UpdateServiceProfessional400 | UpdateServiceProfessional500,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateServiceProfessional>>,
      TError,
      {
        professionalId: string;
        serviceId: string;
        data: UpdateServiceProfessionalBody;
      },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateServiceProfessional>>,
  TError,
  {
    professionalId: string;
    serviceId: string;
    data: UpdateServiceProfessionalBody;
  },
  TContext
> => {
  const mutationOptions = getUpdateServiceProfessionalMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
