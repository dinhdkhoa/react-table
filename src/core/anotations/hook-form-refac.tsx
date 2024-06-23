import {
  FieldValue,
  FieldValues,
  UseFormReturn,
  ValidateResult
} from "react-hook-form"
import "reflect-metadata"
import { BaseEntityForm } from "../classes/base-entity-form"


export enum Control {
  Text = "Text",
  Number = "Number",
  Checkbox = "CheckBox",
  Combobox = "Combobox",
  Date = "Date"
}

export type TextControl = {
  type: Control.Text
  minLength: number
  maxLength?: number
  minLine?: number
}
export type NumberControl = {
  type:  Control.Number
  min?: number
  max?: number
}
export type CheckboxControl = { type: Control.Checkbox }
export type ComboboxControl<TOption = unknown, TOptionValue = unknown> = {
  type: Control.Combobox
  selectOption: SelectOption<TOption, TOptionValue>
}
export type DateControl = {
  type: Control.Date
  includeTime: boolean
}

export const RHF_FIELDS = "rhf:fields"
export const ZOD_VALIDATIONS = "zod:validations"

export type SelectOption<TEntity, TValue> = {
  data: Array<TEntity>;
  value: (data: TEntity) => TValue;
  valueString: (data: TEntity) => string
  display: (data: TEntity) => string;
}

export type RHFSharedType<TEntity extends FieldValues, ControlType> = {
  required?: boolean
  label?: string
  placeholder?: string
  index?: number
  disableFn?: (form: UseFormReturn<TEntity>, entity: TEntity) => boolean
  visibleFn?: (form: UseFormReturn<TEntity>, entity: TEntity) => boolean
  validate?: Record<
    string,
    (value: any, formValue: TEntity) => ValidateResult | Promise<ValidateResult>
  >
} & ControlType

export type ControlType =
  | TextControl
  | NumberControl
  | ComboboxControl
  | DateControl
  | CheckboxControl

export type RHFOptions<TEntity extends FieldValues , ControlType> = RHFSharedType<TEntity, ControlType> 

// Decorator factory for react-hook-form
export function RHFField<TEntity extends FieldValues, ControlType>(
  options: RHFOptions<TEntity, ControlType>
) {
  return function (target: any, propertyKey: keyof TEntity & string) {
    const fields = Reflect.getMetadata(RHF_FIELDS, target) || {}
    fields[propertyKey] = { ...options }
    Reflect.defineMetadata(RHF_FIELDS, fields, target)
  }
}