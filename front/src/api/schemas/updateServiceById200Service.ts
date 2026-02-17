export type UpdateServiceById200Service = {
  id: string;
  name: string;
  /** @nullable */
  description: string | null;
  /** @nullable */
  category: string | null;
  type: "CORTE" | "BARBA" | "SOBRANCELHA" | "ESTETICA";
  active: boolean;
};
