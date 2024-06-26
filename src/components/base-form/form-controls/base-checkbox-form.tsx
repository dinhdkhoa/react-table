import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from "react-hook-form"
import { BaseFormFieldPropsType } from "./types"
import { Checkbox } from "../../ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox"
import { useBaseFormContext } from ".."
import { CheckboxControl } from "@/core/types/control.types"

const BaseCheckboxInput = <TEntity extends FieldValues = FieldValues>({
  name
}: BaseFormFieldPropsType<TEntity>) => {
  const { form, rhf, entity } = useBaseFormContext<CheckboxControl, TEntity>()
  const { visibleFn } = rhf[name];

  const [visibled, setVisibled] = useState<boolean>(() => {
    if (visibleFn) {
      return visibleFn(form, entity);
    }
    return true;
  });

  useEffect(() => {
    if (visibleFn) {
      setVisibled(visibleFn(form, entity));
    }
  }, [form.watch()]);

  return (visibled &&
    <FormField
      control={form.control}
      name={name}
      render={(params) => <BaseCheckboxItem visibled={visibled} {...params} />}
    />
  )
}

const BaseCheckboxItem = <TEntity extends FieldValues = FieldValues,>({ field, fieldState, formState, visibled = true }: { field: ControllerRenderProps<TEntity, Path<TEntity>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<TEntity>, visibled?: boolean }) => {
  const { rhf, setAfterDataChanged, form, entity } = useBaseFormContext<CheckboxControl>()
  const { label, disableFn, validate } = rhf[field.name];

  const [disabled, setDisabled] = useState<boolean>(() => {
    if (disableFn) {
      return disableFn(form, entity);
    }
    return false;
  });

  useEffect(() => {
    if (disableFn) {
      setDisabled(disableFn(form, entity));
    }
  }, [form.watch()]);

  useEffect(() => {
    form.register(field.name, {
      validate: !((disableFn ? disableFn(form, entity) : false) || !visibled) ? validate : undefined
    })
    if (disabled) {
      form.clearErrors(field.name)
    }
  }, [disableFn, disabled, entity, field.name, form, validate, visibled])


  const handleChange = (e: CheckedState) => {
    form.setValue(field.name, e as any);
    if (setAfterDataChanged)
      setAfterDataChanged(form, field.name, e)
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="flex items-center space-x-2">
          <Checkbox id={field.name} onCheckedChange={handleChange} disabled={disabled} checked={form.getValues(field.name)} />
          <label
            htmlFor={field.name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default BaseCheckboxInput
