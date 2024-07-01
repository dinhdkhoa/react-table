import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ChangeEvent, FocusEvent, useEffect, useState } from "react"
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from "react-hook-form"
import { BaseFormFieldPropsType } from "./types"
import { useBaseFormContext } from ".."
import { NumberControl } from "@/core/types/control.types"
import { RHFOptions } from "@/core/anotations/rhf-field"

const BaseNumberInput = <TEntity extends FieldValues = FieldValues>({
  name
}: BaseFormFieldPropsType<TEntity>) => {
  const { form, rhf } = useBaseFormContext<TEntity>()
  const { visibleFn } = rhf[name];

  const [visibled, setVisibled] = useState<boolean>(() => {
    if (visibleFn) {
      return visibleFn(form, form.getValues());
    }
    return true;
  });

  useEffect(() => {
    if (visibleFn) {
      setVisibled(visibleFn(form, form.getValues()));
    }
  }, [form.watch()]);

  return (visibled &&
    <FormField
      control={form.control}
      name={name}
      render={(params) => <BaseNumberInputItem visibled={visibled} {...params} />}
    />
  )
}

const BaseNumberInputItem = <TEntity extends FieldValues = FieldValues, TControlType extends NumberControl = NumberControl>({ field, fieldState, formState, visibled = true }: { field: ControllerRenderProps<TEntity, Path<TEntity>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<TEntity>, visibled?: boolean }) => {
  const { rhf, setAfterDataChanged, form, onBlur } = useBaseFormContext<TEntity>()
  const { placeholder, label, disableFn, validate, min, max } = rhf[field.name] as RHFOptions<TEntity, TControlType>;

  const [disabled, setDisabled] = useState<boolean>(() => {
    if (disableFn) {
      return disableFn(form, form.getValues());
    }
    return false;
  });

  useEffect(() => {
    if (disableFn) {
      setDisabled(disableFn(form, form.getValues()));
    }
  }, [form.watch()]);

  useEffect(() => {
    if (disabled) {
      form.clearErrors(field.name)
    }
  }, [disableFn, disabled, field.name, form, validate, visibled])


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (setAfterDataChanged)
      setAfterDataChanged(form, field.name, e.target.value, form.getValues())
  }
  const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (onBlur) {
      onBlur(form, field.name, e.target.value, form.getValues())
    }
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          {...field}
          {...form.register(field.name, {
            valueAsNumber: true,
            validate: !((disableFn ? disableFn(form, form.getValues()) : false) || !visibled) ? validate : undefined,
            onChange: handleChange,
            onBlur: handleBlur
          })}
          disabled={disabled}
          placeholder={placeholder}
          type='number'
          min={min}
          max={max}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default BaseNumberInput
