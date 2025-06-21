import type { GetBookingsMe200BookingsItemStatus } from "./getBookingsMe200BookingsItemStatus";
import type { GetBookingsMe200BookingsItemProfissional } from "./getBookingsMe200BookingsItemProfissional";
import type { GetBookingsMe200BookingsItemUser } from "./getBookingsMe200BookingsItemUser";
import type { GetBookingsMe200BookingsItemItemsItem } from "./getBookingsMe200BookingsItemItemsItem";

export type GetBookingsMe200BookingsItem = {
  id: string;
  usuarioId: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: GetBookingsMe200BookingsItemStatus;
  /** @nullable */
  observacoes?: string | null;
  /**
   * @minimum 0
   * @exclusiveMinimum
   * @nullable
   */
  valorFinal?: number | null;
  /** @nullable */
  canceledAt?: string | null;
  /** @nullable */
  confirmedAt?: string | null;
  updatedAt: string;
  createdAt: string;
  profissional: GetBookingsMe200BookingsItemProfissional;
  user: GetBookingsMe200BookingsItemUser;
  items: GetBookingsMe200BookingsItemItemsItem[];
};
