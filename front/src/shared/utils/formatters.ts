/**
 * Formata um valor numérico para moeda brasileira (BRL)
 */
export const formatCurrency = (value?: number | null) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value ?? 0);

/**
 * Formata uma data ISO string para formato brasileiro (dd/MM/yyyy)
 */
export const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
};

/**
 * Formata uma data para formato de exibição completo
 */
export const formatDateLong = (value?: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date(value));
};

/**
 * Formata número de telefone brasileiro
 */
export const formatPhone = (phone?: string | null) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  
  return phone;
};

/**
 * Formata CPF
 */
export const formatCPF = (cpf?: string | null) => {
  if (!cpf) return "";
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

/**
 * Formata duração em minutos para formato legível (Xh Ymin)
 */
export const formatDuration = (minutes?: number | null) => {
  if (!minutes) return "0 min";
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  
  if (hours && remaining) return `${hours}h ${remaining}min`;
  if (hours) return `${hours}h`;
  return `${remaining}min`;
};

/**
 * Formata porcentagem
 */
export const formatPercentage = (value?: number | null) => {
  if (value === null || value === undefined) return "0%";
  return `${value}%`;
};
