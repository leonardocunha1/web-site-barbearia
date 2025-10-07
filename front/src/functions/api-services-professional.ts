export function SERVICE_PROFESSIONALS_GET(
  professionalId: string,
  query?: { page?: number; limit?: number; activeOnly?: boolean }
) {
  const params = new URLSearchParams();

  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.activeOnly !== undefined) params.append("activeOnly", String(query.activeOnly));

  const queryString = params.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/professionals/${professionalId}/services${
    queryString ? `?${queryString}` : ""
  }`;

  return {
    url,
    options: {
      method: "GET",
    },
  };
}
