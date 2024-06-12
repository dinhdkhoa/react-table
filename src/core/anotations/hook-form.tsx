import { FieldPathValue, UseFormReturn, Validate, ValidateResult } from "react-hook-form";
import "reflect-metadata";
import { z } from "zod";

type VisibleFun<TEntity> = (form: UseFormReturn, entity: TEntity) => boolean;
type DisableFun<TEntity> = (form: UseFormReturn, entity: TEntity) => boolean;

export enum Control {
  Text = 'Text',
  Number = 'Number',
  Checkbox = 'CheckBox',
  Combobox = 'Combobox',
  Date = "Date",
}

export type BasicControl = { type: Control }
export type TextControl = BasicControl & {
  type: Control.Text,
  minLength?: number,
  maxLength?: number,
  minLine?: number,
}
export type NumberControl = BasicControl & {
  type: Control.Number,
  min?: number,
  max?: number,
}
export type CheckboxControl = BasicControl;
export type ComboboxControl<TOption, TOptionValue> = BasicControl & {
  selectOption: SelectOption<TOption, TOptionValue>
}
export type DateControl = BasicControl & {
  type: Control.Date,
  includeTime: boolean
}

export const DefaultTextControl: TextControl = { type: Control.Text };
export const DefaultNumberControl: NumberControl = { type: Control.Number };
export const DefaultCheckboxControl: CheckboxControl = { type: Control.Checkbox };
export const DefaultDateControl: DateControl = { type: Control.Date, includeTime: false }
export const DefaultDateTimeControl: DateControl = { type: Control.Date, includeTime: true }

export const RHF_FIELDS = 'rhf:fields';
export const ZOD_VALIDATIONS = 'zod:validations';

export type SelectOption<TEntity, TValue> = {
  data: Array<TEntity>;
  value: (data: TEntity) => TValue;
  valueString: (data: TEntity) => string
  display: (data: TEntity) => string;
}

export type RHFOptions<TEntity, TOption, TOptionValue> = {
  required?: boolean;
  label: string;
  placeHolder?: string;
  type: TextControl | NumberControl | ComboboxControl<TOption, TOptionValue> | DateControl | CheckboxControl;
  index?: number;
  disableFn?: DisableFun<TEntity>;
  visibleFn?: VisibleFun<TEntity>;
  validate?: Record<string, (value: any, formValue: any) => ValidateResult | Promise<ValidateResult>>;
}

// Decorator factory for react-hook-form
export function RHFField<TEntity, TOption, TOptionValue>(options: RHFOptions<TEntity, TOption, TOptionValue>) {
  return function (target: any, propertyKey: string) {
    options.placeHolder = options.placeHolder || options.label;
    // options.type = options.type || Control.Text;
    options.index = options.index || 0;
    const fields = Reflect.getMetadata(RHF_FIELDS, target) || {};
    fields[propertyKey] = { options };
    Reflect.defineMetadata(RHF_FIELDS, fields, target);
  };
}

// Decorator factory for zod validation and transformation
export function ZodValidation(schema: z.ZodType<any, any>) {
  return function (target: any, propertyKey: string) {
    const validations = Reflect.getMetadata(ZOD_VALIDATIONS, target) || {};
    validations[propertyKey] = schema;
    Reflect.defineMetadata(ZOD_VALIDATIONS, validations, target);
  };
}
