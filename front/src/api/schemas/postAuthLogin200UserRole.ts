export type PostAuthLogin200UserRole =
  (typeof PostAuthLogin200UserRole)[keyof typeof PostAuthLogin200UserRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthLogin200UserRole = {
  CLIENTE: "CLIENTE",
  PROFISSIONAL: "PROFISSIONAL",
  ADMIN: "ADMIN",
} as const;
