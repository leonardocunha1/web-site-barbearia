export const SPECIALTY_OPTIONS = [
  { value: "Barbeiro", label: "Barbeiro" },
  { value: "Cabeleireiro", label: "Cabeleireiro" },
  { value: "Esteticista", label: "Esteticista" },
  { value: "Manicure", label: "Manicure" },
  { value: "Outro", label: "Outro" },
] as const;

export const WEEKDAY_LABELS: Record<string, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const DEFAULT_WORKING_HOURS = {
  monday: ["09:00", "18:00"],
  tuesday: ["09:00", "18:00"],
  wednesday: ["09:00", "18:00"],
  thursday: ["09:00", "18:00"],
  friday: ["09:00", "18:00"],
  saturday: ["10:00", "15:00"],
  sunday: [],
};
