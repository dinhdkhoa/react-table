import {
  FieldPathValue,
  UseFormReturn,
  Validate,
  ValidateResult
} from "react-hook-form"
import "reflect-metadata"
import { z } from "zod"


export enum Control {
  Text = "Text",
  Number = "Number",
  Checkbox = "CheckBox",
  Combobox = "Combobox",
  Date = "Date"
}

export type TextControl = {
  type: Control.Text
  minLength?: number
  maxLength?: number
  minLine?: number
}
export type NumberControl = {
  type:  Control.Number
  min?: number
  max?: number
}
export type CheckboxControl = { type: Control.Checkbox }
export type ComboboxControl<TOption = {}, TOptionValue = {}> = {
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
  data: Array<TEntity>
  value: (data: TEntity) => TValue
  valueString: (data: TEntity) => string
  display: (data: TEntity) => string
}

type RHFSharedType<TEntity, TControlType extends ControlType> = {
  required?: boolean
  label: string
  placeHolder?: string
  index?: number
  name?: keyof TEntity & string
  disableFn?: (form: UseFormReturn, entity: TEntity) => boolean
  visibleFn?: (form: UseFormReturn, entity: TEntity) => boolean
  validate?: Record<
    string,
    (value: any, formValue: TEntity) => ValidateResult | Promise<ValidateResult>
  >
} & TControlType

export type ControlType =
  | TextControl
  | NumberControl
  | ComboboxControl
  | DateControl
  | CheckboxControl

export type RHFOptions<TEntity, TControlType extends ControlType> = RHFSharedType<
TEntity,TControlType> 

// Decorator factory for react-hook-form
export function RHFField<TEntity, TControlType extends ControlType>(
  options: RHFOptions<TEntity, TControlType>
) {
  return function (target: any, propertyKey: keyof TEntity & string) {
    options.placeHolder = options.placeHolder || options.label
    // options.type = options.type || Control.Text;
    options.index = options.index || 0
    options.name = propertyKey
    const fields = Reflect.getMetadata(RHF_FIELDS, target) || {}
    fields[propertyKey] = { options }
    Reflect.defineMetadata(RHF_FIELDS, fields, target)
  }
}

// Decorator factory for zod validation and transformation
export function ZodValidation(schema: z.ZodType<any, any>) {
  return function (target: any, propertyKey: string) {
    const validations = Reflect.getMetadata(ZOD_VALIDATIONS, target) || {}
    validations[propertyKey] = schema
    Reflect.defineMetadata(ZOD_VALIDATIONS, validations, target)
  }
}
