import {
  FieldValues,
  UseFormReturn,
  ValidateResult
} from "react-hook-form"
import "reflect-metadata"
import { ControlType } from "../types/control.types"
import { FieldNames } from "../helper/helper"

export const RHF_FIELDS = "rhf:fields"

export type RHFSharedType<TEntity extends FieldValues, TControlType extends ControlType = ControlType> = TControlType & {
  fieldName: FieldNames<TEntity>
  required?: boolean
  label?: string
  placeholder?: string
  index?: number
  disableFn?: (form: UseFormReturn<TEntity>, entity: TEntity) => boolean
  visibleFn?: (form: UseFormReturn<TEntity>, entity: TEntity) => boolean
  validate?: Record<
    string,
    (fieldValue: any, formValue: TEntity) => ValidateResult | Promise<ValidateResult>
  >
}

export type RHFOptions<TEntity extends FieldValues = FieldValues, TControlType extends ControlType = ControlType> = RHFSharedType<TEntity, TControlType>


// Decorator factory for react-hook-form
export function RHF<TEntity extends FieldValues>(
  options: RHFOptions<TEntity>
) {
  return function (target: any, propertyKey: keyof TEntity & string) {
    const fields = Reflect.getMetadata(RHF_FIELDS, target) || {}
    if (!options.placeholder)
      options.placeholder = options.label;
    fields[propertyKey] = { ...options }
    Reflect.defineMetadata(RHF_FIELDS, fields, target)
  }
}