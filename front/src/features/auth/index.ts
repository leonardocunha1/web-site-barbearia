export { default as AuthPage } from "./components/auth-page";
export { loginSchema, registerSchema } from "./schemas/auth-schemas";
export type { LoginSchema, RegisterSchema } from "./schemas/auth-schemas";
export { useAuthActions } from "./hooks/use-auth-actions";
export { loginFields, registerFields } from "./config/auth-form-config";
