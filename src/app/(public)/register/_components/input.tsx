import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useBaseFormContext
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TextControl } from "@/core/anotations/rhf"
import { ChangeEvent, FocusEvent, useEffect, useState } from "react"
import { ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, Path, UseFormStateReturn } from "react-hook-form"

type TextInputPropsType<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}
const TextInput = <TEntity extends FieldValues = FieldValues>({
  name
}: TextInputPropsType<TEntity>) => {
  const { form, rhf, entity } = useBaseFormContext<TextControl, TEntity>()
  const { visibleFn } = (rhf as any)[name]['options'];

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
      render={(params) => <TextInputItem visibled={visibled} {...params} />}
    />
  )
}

const TextInputItem = <TEntity extends FieldValues = FieldValues,>({ field, fieldState, formState, visibled = true }: { field: ControllerRenderProps<TEntity, Path<TEntity>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<TEntity>, visibled?: boolean }) => {
  const { rhf, setAfterDataChanged, form, entity, onBlur } = useBaseFormContext<TextControl>()
  const { placeholder, label, disableFn } = (rhf as any)[field.name]['options'];

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
      validate: !((disableFn ? disableFn(form, entity) : false) || !visibled) ? rhf.validate : undefined,
    })
    if (disabled) {
      form.clearErrors(field.name)
    }
  }, [disableFn, disabled, entity, field.name, form, rhf.validate, visibled])


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    field.onChange(e)
    if (setAfterDataChanged)
      setAfterDataChanged(form, field.name, e.currentTarget.value)
  }
  const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    field.onBlur();
    if (onBlur) {
      onBlur(form, field.name, e.currentTarget.value)
    }
  }
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          {...field}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          minLength={rhf.minLength}
          maxLength={rhf.maxLength}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default TextInput
