import { ComboboxControl, DateControl, NumberControl, RHFOptions, SelectOption, TextControl } from "@/core/anotations/hook-form"
import { onBlurFun, onChangeFun } from "@/core/classes/base-entity-form"
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form"

export type BasicReactHookField<TEntity, TOption, TOptionValue> = { name: string, options: RHFOptions<TEntity, TOption, TOptionValue> }

export type BasicControlFormType<TEntity, TOption, TOptionValue> = {
    entity: TEntity,
    form: UseFormReturn,
    rhf: BasicReactHookField<TEntity, TOption, TOptionValue>,
    onChange?: onChangeFun,
    field: ControllerRenderProps<FieldValues, string>,
    formValue?: any
}

export type BasicCheckboxFormType = BasicControlFormType<any, any, any>;
export type BasicInputFormType = BasicControlFormType<any, any, any> & { onBlur?: onBlurFun };
export type BasicTextFormType = BasicInputFormType & { type: TextControl }
export type BasicNumberFormType = BasicInputFormType & { type: NumberControl }
export type BasicDateTimeFormType = BasicControlFormType<any, any, any> & { type: DateControl }
export type BasicComboboxFormType<TEntity, TOption, TOptionValue> = BasicControlFormType<TEntity, TOption, TOptionValue> & { type: ComboboxControl<TOption, TOptionValue> };