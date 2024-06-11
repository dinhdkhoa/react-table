import { ComboboxControl, DateControl, NumberControl, RHFOptions, SelectOption, TextControl } from "@/core/anotations/hook-form"
import { onBlurFun, onChangeFun } from "@/core/classes/base-entity-form"
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form"

export type BasicReactHookField<TOption, TOptionValue> = { name: string, options: RHFOptions<TOption, TOptionValue> }

export type BasicControlFormType<TOption, TOptionValue> = {
    form: UseFormReturn,
    rhf: BasicReactHookField<TOption, TOptionValue>,
    onChange?: onChangeFun,
    field: ControllerRenderProps<FieldValues, string>,
    formValue?: any
}

export type BasicCheckboxFormType = BasicControlFormType<unknown, unknown>;
export type BasicInputFormType = BasicControlFormType<unknown, unknown> & { onBlur?: onBlurFun };
export type BasicTextFormType = BasicInputFormType & {type: TextControl}
export type BasicNumberFormType = BasicInputFormType & {type: NumberControl}
export type BasicDateTimeFormType = BasicControlFormType<unknown, unknown> & {type: DateControl}
export type BasicComboboxFormType<TOption, TOptionValue> = BasicControlFormType<TOption, TOptionValue> & {type: ComboboxControl<TOption, TOptionValue>} ;