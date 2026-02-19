import type { UpdateServiceById200ServiceType } from "./updateServiceById200ServiceType";

export type UpdateServiceById200Service = {
  id: string;
  name: string;
  /** @nullable */
  description: string | null;
  /** @nullable */
  category: string | null;
  type: UpdateServiceById200ServiceType;
  active: boolean;
};
