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
    "bg-stone-800 text-stone-100 border-stone-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  label: "text-stone-300 font-medium",
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
