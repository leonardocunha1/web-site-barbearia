import type { GetServiceById200ServiceType } from "./getServiceById200ServiceType";
import type { GetServiceById200ServiceProfessionalsItem } from "./getServiceById200ServiceProfessionalsItem";

export type GetServiceById200Service = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  type: GetServiceById200ServiceType;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  professionals: GetServiceById200ServiceProfessionalsItem[];
};
