import type { ListServices200ServicesItemType } from "./listServices200ServicesItemType";

export type ListServices200ServicesItem = {
  id: string;
  name: string;
  /** @nullable */
  description: string | null;
  /** @nullable */
  category: string | null;
  type: ListServices200ServicesItemType;
  active: boolean;
};
