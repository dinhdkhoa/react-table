import { ControlType, RHFOptions } from "@/core/anotations/hook-form"
import { BaseEntityForm, onChangeFun } from "@/core/classes/base-entity-form"
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form"

// export type BasicReactHookField<TEntity, TOption, TOptionValue> = { name: string, options: RHFOptions<TEntity, TOption, TOptionValue> }

export type BasicControlFormType<TEntity, TControlType extends ControlType> = {
    entity: TEntity,
    form: UseFormReturn,
    rhf: RHFOptions<TEntity, TControlType>,
    field: ControllerRenderProps<FieldValues, string>,
    disabled : boolean
    formValue?: any,
}

// export type BasicCheckboxFormType = BasicControlFormType<any, any, any>;
// export type BasicInputFormType = BasicControlFormType<any, any, any> & { onBlur?: onBlurFun };
// export type BasicTextFormType = BasicInputFormType & { type: TextControl }
// export type BasicNumberFormType = BasicInputFormType & { type: NumberControl }
// export type BasicDateTimeFormType = BasicControlFormType<any, any, any> & { type: DateControl }
// export type BasicComboboxFormType<TEntity, TOption, TOptionValue> = BasicControlFormType<TEntity, TOption, TOptionValue> & { type: ComboboxControl<TOption, TOptionValue>};