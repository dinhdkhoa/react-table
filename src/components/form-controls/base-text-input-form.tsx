import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useBaseFormContext
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TextControl } from "@/core/anotations/hook-form-refac"
import { ChangeEvent, FocusEvent, useEffect, useState } from "react"
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from "react-hook-form"
import { FieldInputPropsType } from "./types"

const BaseTextInput = <TEntity extends FieldValues = FieldValues>({
  name
}: FieldInputPropsType<TEntity>) => {
  const { form, rhf, entity } = useBaseFormContext<TextControl, TEntity>()
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
      render={(params) => <BaseTextInputItem visibled={visibled} {...params} />}
    />
  )
}

const BaseTextInputItem = <TEntity extends FieldValues = FieldValues,>({ field, fieldState, formState, visibled = true }: { field: ControllerRenderProps<TEntity, Path<TEntity>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<TEntity>, visibled?: boolean }) => {
  const { rhf, setAfterDataChanged, form, entity, onBlur } = useBaseFormContext<TextControl>()
  const { placeholder, label, disableFn, validate, minLength, maxLength } = rhf[field.name];

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
      validate: !((disableFn ? disableFn(form, entity) : false) || !visibled) ? validate : undefined,
      onChange: handleChange,
      onBlur: handleBlur
    })
    if (disabled) {
      form.clearErrors(field.name)
    }
  }, [disableFn, disabled, entity, field.name, form, validate, visibled])


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (setAfterDataChanged)
      setAfterDataChanged(form, field.name, e.target.value)
  }
  const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (onBlur) {
      onBlur(form, field.name, e.target.value)
    }
  }
  
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          {...field}
          placeholder={placeholder}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default BaseTextInput
