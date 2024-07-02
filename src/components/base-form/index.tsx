import * as React from "react"
import {
  ControllerProps,
  FieldPath,
  FieldValues,
  UseFormReturn
} from "react-hook-form"


import { Form } from "../ui/form"
import { RHFOptions } from "@/core/anotations/rhf-field"
import { IBaseEntityFormBehavior } from "@/core/classes/base-entity-form"

type BaseFormPropsType<
  TEntity extends FieldValues = FieldValues
> = {
  form: UseFormReturn<TEntity>
  rhf: Record<string, RHFOptions<TEntity>>
  showLabel: boolean
  children?: React.ReactNode
} & IBaseEntityFormBehavior<TEntity>

const createBaseFormContext = <
  TEntity extends FieldValues = FieldValues
>() =>
  React.createContext<BaseFormPropsType<TEntity>>(
    {} as BaseFormPropsType<TEntity>
  )

const BaseFormContext = createBaseFormContext();

const useBaseFormContext = <
  TEntity extends FieldValues = FieldValues
>() => {
  const baseFormContext = React.useContext<
    BaseFormPropsType<TEntity>
  >(BaseFormContext as any)

  if (!baseFormContext) {
    throw new Error("useBaseFormContext should be used within <BaseForm>")
  }

  const { rhf, form, showLabel, __onChange__, __onBlur__} = baseFormContext

  return {
    setAfterDataChanged: __onChange__,
    form,
    rhf,
    showLabel,
    onBlur: __onBlur__
  }
}

const BaseForm = <
  TEntity extends FieldValues = FieldValues
>({
  ...props
}: BaseFormPropsType<TEntity>) => {
  return (
    <BaseFormContext.Provider
      value={{
        form: props.form as any,
        rhf: props.rhf as any,
        showLabel: props.showLabel,
        __onChange__: props.__onChange__ as any,
        __onBlur__: props.__onChange__ as any,
      }}
    >
      <Form {...props.form}>{props.children}</Form>
    </BaseFormContext.Provider>
  )
}

export { useBaseFormContext }
export default BaseForm

