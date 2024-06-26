import * as React from "react"
import {
    ControllerProps,
    FieldPath,
    FieldValues,
    UseFormReturn
} from "react-hook-form"


import { Form } from "../ui/form"
import { ControlType } from "@/core/types/control.types"
import { RHFOptions } from "@/core/anotations/rhf-field"

type BaseFormPropsType<
  TEntity extends FieldValues = FieldValues,
  TControlType extends ControlType = ControlType
> = {
  form: UseFormReturn<TEntity>
  rhf: Record<string, RHFOptions<TEntity, TControlType>>
  entity: TEntity
  children?: React.ReactNode
}

const createBaseFormContext = <
  TEntity extends FieldValues = FieldValues,
  TControlType extends ControlType = ControlType
>() =>
  React.createContext<BaseFormPropsType<TEntity, TControlType>>(
    {} as BaseFormPropsType<TEntity, TControlType>
  )

const BaseFormContext = createBaseFormContext()

const useBaseFormContext = <
  TControlType extends ControlType,
  TEntity extends FieldValues = FieldValues
>() => {
  const baseFormContext = React.useContext<
    BaseFormPropsType<TEntity, TControlType>
  >(BaseFormContext as any)

  if (!baseFormContext) {
    throw new Error("useBaseFormContext should be used within <BaseForm>")
  }

  const { rhf, form, entity } = baseFormContext

  return {
    setAfterDataChanged: entity?.onChange ?? null,
    form,
    rhf,
    entity,
    onBlur: entity?.onBlur
  }
}

const BaseForm = <
  TEntity extends FieldValues = FieldValues,
  TControlType extends ControlType = ControlType,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: BaseFormPropsType<TEntity, TControlType> &
  Partial<ControllerProps<TFieldValues, TName>>) => {
  return (
    <BaseFormContext.Provider
      value={{
        form: props.form as any,
        rhf: props.rhf as any,
        entity: props.entity
      }}
    >
      <Form {...props.form}>{props.children}</Form>
    </BaseFormContext.Provider>
  )
}

export { useBaseFormContext }
export default BaseForm

