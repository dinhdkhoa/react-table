import { NumberControl } from "@/core/anotations/hook-form"
import { BaseEntityForm, onBlurFun } from "@/core/classes/base-entity-form"
import { ChangeEvent, FocusEvent } from "react"
import { BasicControlFormType } from "./types"
import { Input } from "../ui/input"
type BasicNumberFormTypeProps<TEntity> = BasicControlFormType<
  TEntity,
  NumberControl
> & {
  onBlur?: onBlurFun
}
export function BasicNumberInputForm<TEntity extends BaseEntityForm<TEntity>>({
  entity,
  form,
  rhf,
  field,
  disabled
}: BasicNumberFormTypeProps<TEntity>) {
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
        valueAsNumber: true,
        onChange: handleChange,
        onBlur: handleBlur
      })}
      disabled={disabled}
      placeholder={rhf.placeHolder}
      type={"number"}
      min={rhf.min}
      max={rhf.max}
    />
  )
}
