import { z } from "zod"
import { SubmitHandler } from "react-hook-form"
import { ReactNode } from "react"

export type Option = {
  value: string
  label: string
}

// Tipos utilitários
type WithPlaceholder = {
  placeholder?: string
}

type WithIcon = {
  icon?: React.ElementType | React.JSXElementConstructor<{ className?: string }>;
};

type WithDescription = {
  description?: string
}

type WithDisabled = {
  disabled?: boolean
}

type WithReadOnly = {
  readOnly?: boolean
}

type WithMask = {
  mask?: string | string[]
}

type WithValidation = {
  validation?: z.ZodTypeAny
}

type WithGrid = {
  gridColumn?: number | string
  gridRow?: number | string
}

// Enumeração dos tipos válidos de campo
export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "textarea"
  | "cpf"
  | "cnpj"
  | "phone"
  | "cep"
  | "rg"

// Campo base genérico
export type BaseField<T = unknown, U extends FieldType = FieldType> = {
  name: string
  type: U
  label?: string
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
  required?: boolean
  className?: string
  defaultValue?: T
} & WithDescription & WithDisabled & WithReadOnly & WithGrid & WithIcon

// Campos específicos
export type TextField = BaseField<string, "text" | "email" | "password"> &
  WithPlaceholder 

export type NumberField = BaseField<number, "number"> &
  WithPlaceholder & {
    min?: number
    max?: number
    step?: number
  }

export type DateField = BaseField<string, "date"> & WithPlaceholder & {
  minDate?: string
  maxDate?: string
}

export type SelectField = BaseField<string | string[], "select"> &
  WithPlaceholder & {
    options: Option[]
    isMulti?: boolean
  }

export type CheckboxField = BaseField<boolean, "checkbox"> & {
  checked?: boolean
}

export type TextareaField = BaseField<string, "textarea"> &
  WithPlaceholder & {
    rows?: number
  }

export type CpfField = BaseField<string, "cpf"> &
  WithPlaceholder &
  WithValidation

export type PhoneField = BaseField<string, "phone"> &
  WithPlaceholder &
  WithMask

export type CurrencyField = Omit<NumberField, 'type'> & {
  type: 'currency'
  currencyOptions?: {
    decimalSeparator?: string
    groupSeparator?: string
    prefix?: string
    suffix?: string
    decimalsLimit?: number
  }
}

// Union com todos os tipos de campos válidos
export type FormField =
  | TextField
  | NumberField
  | DateField
  | SelectField
  | CheckboxField
  | TextareaField
  | CpfField
  | PhoneField
  | CurrencyField

// Props principais do formulário dinâmico
export type DynamicFormProps<T extends z.ZodTypeAny = z.ZodTypeAny> = {
  fields?: FormField[]
  sections?: { title?: string; fields: FormField[] }[] // opcional para agrupamento
  onSubmit: SubmitHandler<z.infer<T>>
  schema: T
  children?: ReactNode
  className?: string
  resetAfterSubmit?: boolean
  gridColumns?: number
  gridRows?: number
  button?: ReactNode
  defaultButton?: boolean
  buttonText?: string
  submittingText?: string
  buttonClassName?: string
}
