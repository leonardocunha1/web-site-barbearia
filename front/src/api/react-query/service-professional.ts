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
  DeleteProfessionalsProfessionalIdServicesServiceId204,
  DeleteProfessionalsProfessionalIdServicesServiceId400,
  DeleteProfessionalsProfessionalIdServicesServiceId404,
  GetProfessionalsProfessionalIdServices200,
  GetProfessionalsProfessionalIdServices400,
  GetProfessionalsProfessionalIdServicesParams,
  PostProfessionalsProfessionalIdServices201,
  PostProfessionalsProfessionalIdServices400,
  PostProfessionalsProfessionalIdServices404,
  PostProfessionalsProfessionalIdServices409,
  PostProfessionalsProfessionalIdServicesBody,
  PutProfessionalsProfessionalIdServicesServiceId204,
  PutProfessionalsProfessionalIdServicesServiceId400,
  PutProfessionalsProfessionalIdServicesServiceId500,
  PutProfessionalsProfessionalIdServicesServiceIdBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

export const postProfessionalsProfessionalIdServices = (
  professionalId: string,
  postProfessionalsProfessionalIdServicesBody: PostProfessionalsProfessionalIdServicesBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostProfessionalsProfessionalIdServices201>({
    url: `/professionals/${professionalId}/services`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postProfessionalsProfessionalIdServicesBody,
    signal,
  });
};

export const getPostProfessionalsProfessionalIdServicesMutationOptions = <
  TError =
    | PostProfessionalsProfessionalIdServices400
    | PostProfessionalsProfessionalIdServices404
    | PostProfessionalsProfessionalIdServices409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postProfessionalsProfessionalIdServices>>,
    TError,
    {
      professionalId: string;
      data: PostProfessionalsProfessionalIdServicesBody;
    },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postProfessionalsProfessionalIdServices>>,
  TError,
  { professionalId: string; data: PostProfessionalsProfessionalIdServicesBody },
  TContext
> => {
  const mutationKey = ["postProfessionalsProfessionalIdServices"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postProfessionalsProfessionalIdServices>>,
    {
      professionalId: string;
      data: PostProfessionalsProfessionalIdServicesBody;
    }
  > = (props) => {
    const { professionalId, data } = props ?? {};

    return postProfessionalsProfessionalIdServices(professionalId, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostProfessionalsProfessionalIdServicesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postProfessionalsProfessionalIdServices>>
>;
export type PostProfessionalsProfessionalIdServicesMutationBody =
  PostProfessionalsProfessionalIdServicesBody;
export type PostProfessionalsProfessionalIdServicesMutationError =
  | PostProfessionalsProfessionalIdServices400
  | PostProfessionalsProfessionalIdServices404
  | PostProfessionalsProfessionalIdServices409;

export const usePostProfessionalsProfessionalIdServices = <
  TError =
    | PostProfessionalsProfessionalIdServices400
    | PostProfessionalsProfessionalIdServices404
    | PostProfessionalsProfessionalIdServices409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postProfessionalsProfessionalIdServices>>,
    TError,
    {
      professionalId: string;
      data: PostProfessionalsProfessionalIdServicesBody;
    },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postProfessionalsProfessionalIdServices>>,
  TError,
  { professionalId: string; data: PostProfessionalsProfessionalIdServicesBody },
  TContext
> => {
  const mutationOptions =
    getPostProfessionalsProfessionalIdServicesMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getProfessionalsProfessionalIdServices = (
  professionalId: string,
  params?: GetProfessionalsProfessionalIdServicesParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetProfessionalsProfessionalIdServices200>({
    url: `/professionals/${professionalId}/services`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetProfessionalsProfessionalIdServicesQueryKey = (
  professionalId: string,
  params?: GetProfessionalsProfessionalIdServicesParams,
) => {
  return [
    `/professionals/${professionalId}/services`,
    ...(params ? [params] : []),
  ] as const;
};

export const getGetProfessionalsProfessionalIdServicesInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>,
  TError = GetProfessionalsProfessionalIdServices400,
>(
  professionalId: string,
  params?: GetProfessionalsProfessionalIdServicesParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getGetProfessionalsProfessionalIdServicesQueryKey(professionalId, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>
  > = ({ signal }) =>
    getProfessionalsProfessionalIdServices(professionalId, params, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!professionalId,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetProfessionalsProfessionalIdServicesInfiniteQueryResult =
  NonNullable<
    Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>
  >;
export type GetProfessionalsProfessionalIdServicesInfiniteQueryError =
  GetProfessionalsProfessionalIdServices400;

export function useGetProfessionalsProfessionalIdServicesInfinite<
  TData = Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>,
  TError = GetProfessionalsProfessionalIdServices400,
>(
  professionalId: string,
  params?: GetProfessionalsProfessionalIdServicesParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions =
    getGetProfessionalsProfessionalIdServicesInfiniteQueryOptions(
      professionalId,
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

export const getGetProfessionalsProfessionalIdServicesQueryOptions = <
  TData = Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>,
  TError = GetProfessionalsProfessionalIdServices400,
>(
  professionalId: string,
  params?: GetProfessionalsProfessionalIdServicesParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getGetProfessionalsProfessionalIdServicesQueryKey(professionalId, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>
  > = ({ signal }) =>
    getProfessionalsProfessionalIdServices(professionalId, params, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!professionalId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetProfessionalsProfessionalIdServicesQueryResult = NonNullable<
  Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>
>;
export type GetProfessionalsProfessionalIdServicesQueryError =
  GetProfessionalsProfessionalIdServices400;

export function useGetProfessionalsProfessionalIdServices<
  TData = Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>,
  TError = GetProfessionalsProfessionalIdServices400,
>(
  professionalId: string,
  params?: GetProfessionalsProfessionalIdServicesParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getProfessionalsProfessionalIdServices>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetProfessionalsProfessionalIdServicesQueryOptions(
    professionalId,
    params,
    options,
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const deleteProfessionalsProfessionalIdServicesServiceId = (
  professionalId: string,
  serviceId: string,
) => {
  return axiosInstance<DeleteProfessionalsProfessionalIdServicesServiceId204>({
    url: `/professionals/${professionalId}/services/${serviceId}`,
    method: "DELETE",
  });
};

export const getDeleteProfessionalsProfessionalIdServicesServiceIdMutationOptions =
  <
    TError =
      | DeleteProfessionalsProfessionalIdServicesServiceId400
      | DeleteProfessionalsProfessionalIdServicesServiceId404,
    TContext = unknown,
  >(options?: {
    mutation?: UseMutationOptions<
      Awaited<
        ReturnType<typeof deleteProfessionalsProfessionalIdServicesServiceId>
      >,
      TError,
      { professionalId: string; serviceId: string },
      TContext
    >;
  }): UseMutationOptions<
    Awaited<
      ReturnType<typeof deleteProfessionalsProfessionalIdServicesServiceId>
    >,
    TError,
    { professionalId: string; serviceId: string },
    TContext
  > => {
    const mutationKey = ["deleteProfessionalsProfessionalIdServicesServiceId"];
    const { mutation: mutationOptions } = options
      ? options.mutation &&
        "mutationKey" in options.mutation &&
        options.mutation.mutationKey
        ? options
        : { ...options, mutation: { ...options.mutation, mutationKey } }
      : { mutation: { mutationKey } };

    const mutationFn: MutationFunction<
      Awaited<
        ReturnType<typeof deleteProfessionalsProfessionalIdServicesServiceId>
      >,
      { professionalId: string; serviceId: string }
    > = (props) => {
      const { professionalId, serviceId } = props ?? {};

      return deleteProfessionalsProfessionalIdServicesServiceId(
        professionalId,
        serviceId,
      );
    };

    return { mutationFn, ...mutationOptions };
  };

export type DeleteProfessionalsProfessionalIdServicesServiceIdMutationResult =
  NonNullable<
    Awaited<
      ReturnType<typeof deleteProfessionalsProfessionalIdServicesServiceId>
    >
  >;

export type DeleteProfessionalsProfessionalIdServicesServiceIdMutationError =
  | DeleteProfessionalsProfessionalIdServicesServiceId400
  | DeleteProfessionalsProfessionalIdServicesServiceId404;

export const useDeleteProfessionalsProfessionalIdServicesServiceId = <
  TError =
    | DeleteProfessionalsProfessionalIdServicesServiceId400
    | DeleteProfessionalsProfessionalIdServicesServiceId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<
      ReturnType<typeof deleteProfessionalsProfessionalIdServicesServiceId>
    >,
    TError,
    { professionalId: string; serviceId: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<
    ReturnType<typeof deleteProfessionalsProfessionalIdServicesServiceId>
  >,
  TError,
  { professionalId: string; serviceId: string },
  TContext
> => {
  const mutationOptions =
    getDeleteProfessionalsProfessionalIdServicesServiceIdMutationOptions(
      options,
    );

  return useMutation(mutationOptions);
};
export const putProfessionalsProfessionalIdServicesServiceId = (
  professionalId: string,
  serviceId: string,
  putProfessionalsProfessionalIdServicesServiceIdBody: PutProfessionalsProfessionalIdServicesServiceIdBody,
) => {
  return axiosInstance<PutProfessionalsProfessionalIdServicesServiceId204>({
    url: `/professionals/${professionalId}/services/${serviceId}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: putProfessionalsProfessionalIdServicesServiceIdBody,
  });
};

export const getPutProfessionalsProfessionalIdServicesServiceIdMutationOptions =
  <
    TError =
      | PutProfessionalsProfessionalIdServicesServiceId400
      | PutProfessionalsProfessionalIdServicesServiceId500,
    TContext = unknown,
  >(options?: {
    mutation?: UseMutationOptions<
      Awaited<
        ReturnType<typeof putProfessionalsProfessionalIdServicesServiceId>
      >,
      TError,
      {
        professionalId: string;
        serviceId: string;
        data: PutProfessionalsProfessionalIdServicesServiceIdBody;
      },
      TContext
    >;
  }): UseMutationOptions<
    Awaited<ReturnType<typeof putProfessionalsProfessionalIdServicesServiceId>>,
    TError,
    {
      professionalId: string;
      serviceId: string;
      data: PutProfessionalsProfessionalIdServicesServiceIdBody;
    },
    TContext
  > => {
    const mutationKey = ["putProfessionalsProfessionalIdServicesServiceId"];
    const { mutation: mutationOptions } = options
      ? options.mutation &&
        "mutationKey" in options.mutation &&
        options.mutation.mutationKey
        ? options
        : { ...options, mutation: { ...options.mutation, mutationKey } }
      : { mutation: { mutationKey } };

    const mutationFn: MutationFunction<
      Awaited<
        ReturnType<typeof putProfessionalsProfessionalIdServicesServiceId>
      >,
      {
        professionalId: string;
        serviceId: string;
        data: PutProfessionalsProfessionalIdServicesServiceIdBody;
      }
    > = (props) => {
      const { professionalId, serviceId, data } = props ?? {};

      return putProfessionalsProfessionalIdServicesServiceId(
        professionalId,
        serviceId,
        data,
      );
    };

    return { mutationFn, ...mutationOptions };
  };

export type PutProfessionalsProfessionalIdServicesServiceIdMutationResult =
  NonNullable<
    Awaited<ReturnType<typeof putProfessionalsProfessionalIdServicesServiceId>>
  >;
export type PutProfessionalsProfessionalIdServicesServiceIdMutationBody =
  PutProfessionalsProfessionalIdServicesServiceIdBody;
export type PutProfessionalsProfessionalIdServicesServiceIdMutationError =
  | PutProfessionalsProfessionalIdServicesServiceId400
  | PutProfessionalsProfessionalIdServicesServiceId500;

export const usePutProfessionalsProfessionalIdServicesServiceId = <
  TError =
    | PutProfessionalsProfessionalIdServicesServiceId400
    | PutProfessionalsProfessionalIdServicesServiceId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putProfessionalsProfessionalIdServicesServiceId>>,
    TError,
    {
      professionalId: string;
      serviceId: string;
      data: PutProfessionalsProfessionalIdServicesServiceIdBody;
    },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof putProfessionalsProfessionalIdServicesServiceId>>,
  TError,
  {
    professionalId: string;
    serviceId: string;
    data: PutProfessionalsProfessionalIdServicesServiceIdBody;
  },
  TContext
> => {
  const mutationOptions =
    getPutProfessionalsProfessionalIdServicesServiceIdMutationOptions(options);

  return useMutation(mutationOptions);
};
