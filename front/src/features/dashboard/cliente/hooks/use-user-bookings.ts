import { useListUserBookings } from "@/api";
import { useMemo } from "react";

/**
 * Hook compartilhado para buscar bookings do usuário.
 * Centraliza a chamada para evitar múltiplas requisições na mesma tela.
 *
 * @param limit - Quantidade de items a buscar (padrão: 10)
 * @returns Query result com bookings e metadados
 */
export function useUserBookings(limit = 10) {
  return useListUserBookings({
    page: 1,
    limit,
    sort: [{ field: "startDateTime", order: "desc" }],
  });
}

/**
 * Retorna o próximo agendamento futuro (PENDING ou CONFIRMED).
 */
export function useNextBooking() {
  const { data } = useUserBookings(10);

  return useMemo(() => {
    const now = new Date();
    return data?.bookings?.find(
      (booking) =>
        (booking.status === "PENDING" || booking.status === "CONFIRMED") &&
        new Date(booking.startDateTime) > now,
    );
  }, [data]);
}

/**
 * Retorna os últimos N bookings para o histórico recente.
 */
export function useRecentBookings(limit = 5) {
  const { data, isLoading, isError } = useUserBookings(Math.max(10, limit));

  const bookings = useMemo(() => {
    return data?.bookings?.slice(0, limit) ?? [];
  }, [data, limit]);

  return { bookings, isLoading, isError };
}
