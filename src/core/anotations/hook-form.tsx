import "reflect-metadata";
import { z } from "zod";

export const RHF_FIELDS = 'rhf:fields';
export const ZOD_VALIDATIONS = 'zod:validations';

export enum Control {
  Text = 'Text',
  Number = 'Number',
  Checkbox = 'CheckBox',
  Combobox = 'Combobox',
}

export type SelectOption<TEntity = unknown, TValue = unknown> = {
  data: Array<TEntity>;
  value: (data: TEntity) => TValue;
  valueString: (data: TEntity) => string
  display: (data: TEntity) => string;
}

export type RHFOptions = {
  required?: boolean;
  label: string;
  placeHolder?: string;
  type?: Control;
  index?: number;
  // selectOption?: SelectOption<TOptionEntity, TOptionValue>;
}

// Decorator factory for react-hook-form
export function RHFField<TOptionEntity = unknown, TOptionValue = unknown>(options: RHFOptions, selectOption?: SelectOption<TOptionEntity, TOptionValue>) {
  return function (target: any, propertyKey: string) {
    options.placeHolder = options.placeHolder || options.label;
    options.type = options.type || Control.Text;
    options.index = options.index || 0;
    const fields = Reflect.getMetadata(RHF_FIELDS, target) || {};
    fields[propertyKey] = { options, selectOption };
    Reflect.defineMetadata(RHF_FIELDS, fields, target);
  };
}



export type RHFField = (<TOptionEntity, TOptionValue>(options: RHFOptions, selectOption: SelectOption<TOptionEntity, TOptionValue>) => void) | ((options: RHFOptions) => void);


// Decorator factory for zod validation and transformation
export function ZodValidation(schema: z.ZodType<any, any>) {
  return function (target: any, propertyKey: string) {
    const validations = Reflect.getMetadata(ZOD_VALIDATIONS, target) || {};
    validations[propertyKey] = schema;
    Reflect.defineMetadata(ZOD_VALIDATIONS, validations, target);
  };
}
