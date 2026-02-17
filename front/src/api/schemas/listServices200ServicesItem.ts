export type ListServices200ServicesItem = {
  id: string;
  name: string;
  /** @nullable */
  description: string | null;
  /** @nullable */
  category: string | null;
  type: "CORTE" | "BARBA" | "SOBRANCELHA" | "ESTETICA";
  active: boolean;
};
