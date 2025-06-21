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
  DeleteBusinessHoursBusinessHoursId204,
  DeleteBusinessHoursBusinessHoursId400,
  DeleteBusinessHoursBusinessHoursId403,
  DeleteBusinessHoursBusinessHoursId404,
  GetBusinessHoursProfessionalId200,
  GetBusinessHoursProfessionalId400,
  GetBusinessHoursProfessionalId404,
  PostBusinessHours201,
  PostBusinessHours400,
  PostBusinessHours404,
  PostBusinessHours409,
  PostBusinessHoursBody,
  PutBusinessHoursProfessionalId200,
  PutBusinessHoursProfessionalId400,
  PutBusinessHoursProfessionalId404,
  PutBusinessHoursProfessionalIdBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Criação de um novo horário de funcionamento.
 */
export const postBusinessHours = (
  postBusinessHoursBody: PostBusinessHoursBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostBusinessHours201>({
    url: `/business-hours`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postBusinessHoursBody,
    signal,
  });
};

export const getPostBusinessHoursMutationOptions = <
  TError = PostBusinessHours400 | PostBusinessHours404 | PostBusinessHours409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postBusinessHours>>,
    TError,
    { data: PostBusinessHoursBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postBusinessHours>>,
  TError,
  { data: PostBusinessHoursBody },
  TContext
> => {
  const mutationKey = ["postBusinessHours"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postBusinessHours>>,
    { data: PostBusinessHoursBody }
  > = (props) => {
    const { data } = props ?? {};

    return postBusinessHours(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostBusinessHoursMutationResult = NonNullable<
  Awaited<ReturnType<typeof postBusinessHours>>
>;
export type PostBusinessHoursMutationBody = PostBusinessHoursBody;
export type PostBusinessHoursMutationError =
  | PostBusinessHours400
  | PostBusinessHours404
  | PostBusinessHours409;

export const usePostBusinessHours = <
  TError = PostBusinessHours400 | PostBusinessHours404 | PostBusinessHours409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postBusinessHours>>,
    TError,
    { data: PostBusinessHoursBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postBusinessHours>>,
  TError,
  { data: PostBusinessHoursBody },
  TContext
> => {
  const mutationOptions = getPostBusinessHoursMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Atualização de um horário de funcionamento.
 */
export const putBusinessHoursProfessionalId = (
  professionalId: string,
  putBusinessHoursProfessionalIdBody: PutBusinessHoursProfessionalIdBody,
) => {
  return axiosInstance<PutBusinessHoursProfessionalId200>({
    url: `/business-hours/${professionalId}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: putBusinessHoursProfessionalIdBody,
  });
};

export const getPutBusinessHoursProfessionalIdMutationOptions = <
  TError =
    | PutBusinessHoursProfessionalId400
    | PutBusinessHoursProfessionalId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putBusinessHoursProfessionalId>>,
    TError,
    { professionalId: string; data: PutBusinessHoursProfessionalIdBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putBusinessHoursProfessionalId>>,
  TError,
  { professionalId: string; data: PutBusinessHoursProfessionalIdBody },
  TContext
> => {
  const mutationKey = ["putBusinessHoursProfessionalId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putBusinessHoursProfessionalId>>,
    { professionalId: string; data: PutBusinessHoursProfessionalIdBody }
  > = (props) => {
    const { professionalId, data } = props ?? {};

    return putBusinessHoursProfessionalId(professionalId, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutBusinessHoursProfessionalIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putBusinessHoursProfessionalId>>
>;
export type PutBusinessHoursProfessionalIdMutationBody =
  PutBusinessHoursProfessionalIdBody;
export type PutBusinessHoursProfessionalIdMutationError =
  | PutBusinessHoursProfessionalId400
  | PutBusinessHoursProfessionalId404;

export const usePutBusinessHoursProfessionalId = <
  TError =
    | PutBusinessHoursProfessionalId400
    | PutBusinessHoursProfessionalId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putBusinessHoursProfessionalId>>,
    TError,
    { professionalId: string; data: PutBusinessHoursProfessionalIdBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof putBusinessHoursProfessionalId>>,
  TError,
  { professionalId: string; data: PutBusinessHoursProfessionalIdBody },
  TContext
> => {
  const mutationOptions =
    getPutBusinessHoursProfessionalIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Listar horários de funcionamento.
 */
export const getBusinessHoursProfessionalId = (
  professionalId: string,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetBusinessHoursProfessionalId200>({
    url: `/business-hours/${professionalId}`,
    method: "GET",
    signal,
  });
};

export const getGetBusinessHoursProfessionalIdQueryKey = (
  professionalId: string,
) => {
  return [`/business-hours/${professionalId}`] as const;
};

export const getGetBusinessHoursProfessionalIdInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>,
  TError =
    | GetBusinessHoursProfessionalId400
    | GetBusinessHoursProfessionalId404,
>(
  professionalId: string,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getGetBusinessHoursProfessionalIdQueryKey(professionalId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>
  > = ({ signal }) => getBusinessHoursProfessionalId(professionalId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!professionalId,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetBusinessHoursProfessionalIdInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>
>;
export type GetBusinessHoursProfessionalIdInfiniteQueryError =
  | GetBusinessHoursProfessionalId400
  | GetBusinessHoursProfessionalId404;

export function useGetBusinessHoursProfessionalIdInfinite<
  TData = Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>,
  TError =
    | GetBusinessHoursProfessionalId400
    | GetBusinessHoursProfessionalId404,
>(
  professionalId: string,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBusinessHoursProfessionalIdInfiniteQueryOptions(
    professionalId,
    options,
  );

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetBusinessHoursProfessionalIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>,
  TError =
    | GetBusinessHoursProfessionalId400
    | GetBusinessHoursProfessionalId404,
>(
  professionalId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getGetBusinessHoursProfessionalIdQueryKey(professionalId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>
  > = ({ signal }) => getBusinessHoursProfessionalId(professionalId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!professionalId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetBusinessHoursProfessionalIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>
>;
export type GetBusinessHoursProfessionalIdQueryError =
  | GetBusinessHoursProfessionalId400
  | GetBusinessHoursProfessionalId404;

export function useGetBusinessHoursProfessionalId<
  TData = Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>,
  TError =
    | GetBusinessHoursProfessionalId400
    | GetBusinessHoursProfessionalId404,
>(
  professionalId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getBusinessHoursProfessionalId>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBusinessHoursProfessionalIdQueryOptions(
    professionalId,
    options,
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Deletar um horário de funcionamento.
 */
export const deleteBusinessHoursBusinessHoursId = (businessHoursId: string) => {
  return axiosInstance<DeleteBusinessHoursBusinessHoursId204>({
    url: `/business-hours/${businessHoursId}`,
    method: "DELETE",
  });
};

export const getDeleteBusinessHoursBusinessHoursIdMutationOptions = <
  TError =
    | DeleteBusinessHoursBusinessHoursId400
    | DeleteBusinessHoursBusinessHoursId403
    | DeleteBusinessHoursBusinessHoursId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteBusinessHoursBusinessHoursId>>,
    TError,
    { businessHoursId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteBusinessHoursBusinessHoursId>>,
  TError,
  { businessHoursId: string },
  TContext
> => {
  const mutationKey = ["deleteBusinessHoursBusinessHoursId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteBusinessHoursBusinessHoursId>>,
    { businessHoursId: string }
  > = (props) => {
    const { businessHoursId } = props ?? {};

    return deleteBusinessHoursBusinessHoursId(businessHoursId);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteBusinessHoursBusinessHoursIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteBusinessHoursBusinessHoursId>>
>;

export type DeleteBusinessHoursBusinessHoursIdMutationError =
  | DeleteBusinessHoursBusinessHoursId400
  | DeleteBusinessHoursBusinessHoursId403
  | DeleteBusinessHoursBusinessHoursId404;

export const useDeleteBusinessHoursBusinessHoursId = <
  TError =
    | DeleteBusinessHoursBusinessHoursId400
    | DeleteBusinessHoursBusinessHoursId403
    | DeleteBusinessHoursBusinessHoursId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteBusinessHoursBusinessHoursId>>,
    TError,
    { businessHoursId: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteBusinessHoursBusinessHoursId>>,
  TError,
  { businessHoursId: string },
  TContext
> => {
  const mutationOptions =
    getDeleteBusinessHoursBusinessHoursIdMutationOptions(options);

  return useMutation(mutationOptions);
};
