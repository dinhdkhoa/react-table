import { TextControl } from "@/core/anotations/hook-form"
import { BaseEntityForm, onBlurFun } from "@/core/classes/base-entity-form"
import { ChangeEvent, FocusEvent } from "react"
import { Input } from "../ui/input"
import { BasicControlFormType } from "./types"

type BasicTextInputFormTypeProps<TEntity> = BasicControlFormType<
  TEntity,
  TextControl
> & {
  onBlur?: onBlurFun
}

export function BasicTextInputForm<TEntity extends BaseEntityForm<TEntity>>({
  form,
  rhf,
  entity,
  field,
  disabled
}: BasicTextInputFormTypeProps<TEntity>) {
  const { onChange, onBlur } = entity
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(form, rhf.name, e.currentTarget.value)
    }
  }
  const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (onBlur) {
      onBlur(form, rhf.name, e.currentTarget.value)
    }
  }
  return (
    <Input
      {...field}
      {...form.register(rhf.name as string, {
        onChange: handleChange,
        onBlur: handleBlur
      })}

      
      disabled={disabled}
      placeholder={rhf.placeHolder}
      type={"text"}
      onBlur={handleBlur}
      minLength={rhf.minLength}
      maxLength={rhf.maxLength}
    />
  )
}
