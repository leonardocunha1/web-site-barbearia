import type { ListProfessionalServices200ServicesItemType } from "./listProfessionalServices200ServicesItemType";

export type ListProfessionalServices200ServicesItem = {
  id: string;
  name: string;
  /** @nullable */
  description: string | null;
  /** @nullable */
  category: string | null;
  type: ListProfessionalServices200ServicesItemType;
  active: boolean;
  /** @nullable */
  price: number | null;
  /** @nullable */
  duration: number | null;
};
