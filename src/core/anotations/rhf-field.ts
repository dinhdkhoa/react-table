import {
  FieldValues,
  UseFormReturn,
  ValidateResult
} from "react-hook-form"
import "reflect-metadata"

export const RHF_FIELDS = "rhf:fields"

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

export type RHFOptions<TEntity extends FieldValues, ControlType> = RHFSharedType<TEntity, ControlType>

// Decorator factory for react-hook-form
export function RHF<TEntity extends FieldValues, ControlType>(
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