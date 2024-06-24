import {
  FieldValues,
  UseFormReturn,
  ValidateResult
} from "react-hook-form"
import "reflect-metadata"


export enum Direction {
  Column = 'Column',
  Row = 'Row',
}

export enum Control {
  Text = "Text",
  TextArea = "TextArea",
  Number = "Number",
  Checkbox = "Checkbox",
  Switch = 'Switch',
  Combobox = "Combobox",
  MultipleSelect = 'MultipleSelect',
  RadioGroup = 'RadioGroup',
  Date = "Date"
}

export type TextControl = {
  type: Control.Text,
  minLength?: number,
  maxLength?: number,
  minLine?: number,
}
export type TextAreaControl = {
  type: Control.TextArea,
  resize: boolean,
  minLength?: number,
  maxLength?: number,
}
export type NumberControl = {
  type: Control.Number,
  min?: number,
  max?: number,
}
export type CheckboxControl = { type: Control.Checkbox, }
export type SwitchControl = { type: Control.Switch, };
export type ComboboxControl<TOption = unknown, TOptionValue = unknown> = {
  type: Control.Combobox,
  selectOption: SelectOption<TOption, TOptionValue>,
}
export type MultipleSelectControl<TOption = unknown, TOptionValue = unknown> = {
  type: Control.MultipleSelect,
  selectOption: SelectOption<TOption, TOptionValue>
}
export type RadioGroupControl<TOption = unknown, TOptionValue = unknown> = {
  type: Control.RadioGroup,
  direction: Direction,
  selectOption: SelectOption<TOption, TOptionValue>,
}
export type DateControl = {
  type: Control.Date,
  includeTime: boolean,
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
  | TextAreaControl
  | NumberControl
  | ComboboxControl
  | DateControl
  | CheckboxControl
  | RadioGroupControl
  | SwitchControl
  | MultipleSelectControl

export type RHFOptions<TEntity extends FieldValues, ControlType> = RHFSharedType<TEntity, ControlType>

// Decorator factory for react-hook-form
export function RHFField<TEntity extends FieldValues, ControlType>(
  options: RHFOptions<TEntity, ControlType>
) {
  return function (target: any, propertyKey: keyof TEntity & string) {
    const fields = Reflect.getMetadata(RHF_FIELDS, target) || {}
    if (!options.placeholder)
      options.placeholder = options.label;
    fields[propertyKey] = { ...options }
    Reflect.defineMetadata(RHF_FIELDS, fields, target)
  }
}