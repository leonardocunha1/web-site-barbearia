import type { DynamicFormProps } from "@/shared/components/form/types";
import type {
  loginSchema,
  registerSchema,
} from "@/features/auth/schemas/auth-schemas";

type LoginFields = DynamicFormProps<typeof loginSchema>["fields"];
type RegisterFields = DynamicFormProps<typeof registerSchema>["fields"];

type ClassNames = {
  input: string;
  label: string;
};

const classNames: ClassNames = {
  input:
    "h-12 rounded-none bg-background border-foreground/25 text-foreground placeholder:text-foreground/35 focus-visible:border-foreground focus-visible:ring-cobre-600/20 focus-visible:ring-2",
  label:
    "font-mono text-[10px] tracking-[0.25em] uppercase text-foreground/60",
};

export const loginFields: LoginFields = [
  {
    name: "email",
    label: "Email",
    placeholder: "Digite seu email",
    type: "email",
    className: classNames.input,
    labelProps: { className: classNames.label },
  },
  {
    name: "password",
    label: "Senha",
    placeholder: "Digite sua senha",
    type: "password",
    className: classNames.input,
    labelProps: { className: classNames.label },
  },
];

export const registerFields: RegisterFields = [
  {
    name: "name",
    label: "Nome",
    placeholder: "Digite seu nome completo",
    type: "text",
    className: classNames.input,
    labelProps: { className: classNames.label },
  },
  ...loginFields,
  {
    name: "confirmPassword",
    label: "Confirmar Senha",
    placeholder: "Confirme sua senha",
    type: "password",
    className: classNames.input,
    labelProps: { className: classNames.label },
  },
  {
    name: "phone",
    label: "Telefone",
    placeholder: "Digite seu telefone",
    type: "phone",
    className: classNames.input,
    labelProps: { className: classNames.label },
  },
];
