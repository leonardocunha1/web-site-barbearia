export type PostAuthRegisterBodyRole =
  (typeof PostAuthRegisterBodyRole)[keyof typeof PostAuthRegisterBodyRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthRegisterBodyRole = {
  CLIENTE: "CLIENTE",
  PROFISSIONAL: "PROFISSIONAL",
  ADMIN: "ADMIN",
} as const;
