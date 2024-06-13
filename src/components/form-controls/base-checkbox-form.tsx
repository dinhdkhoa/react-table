import { Checkbox } from "@/components/ui/checkbox"
import {  BasicControlFormType } from "./types"
import { CheckboxControl } from "@/core/anotations/hook-form"
import { BaseEntityForm } from "@/core/classes/base-entity-form"
import { CheckedState } from "@radix-ui/react-checkbox"

type BasicCheckboxFormProps<TEntity> = BasicControlFormType<
  TEntity,
  CheckboxControl
> 
export function BasicCheckboxForm<TEntity extends BaseEntityForm<TEntity>>({
  entity,
  form,
  rhf,
  field,
  disabled
}: BasicCheckboxFormProps<TEntity>) {
  const {onChange} = entity
  const handleCheckedChange = (e: CheckedState) => {
          field.onChange(e)
          if (onChange) {
            onChange(form, rhf.name, e)
          }
        }
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={rhf.name}
        {...field}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        checked={field.value}
      />
      <label
        htmlFor={rhf.name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {rhf.label}
      </label>
    </div>
  )
}
