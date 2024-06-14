import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useBaseFormContext,
  useFormField
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RHFSharedType, TextControl } from "@/core/anotations/hook-form"
import { ChangeEvent, FocusEvent } from "react"

type TextInputPropsType<T extends Record<string, unknown>> = {
  fieldName: keyof T & string
}
const TextInput = <TEntity extends RHFSharedType<TEntity, TextControl>>({ fieldName }: TextInputPropsType<TEntity>) => {
  const { form } = useBaseFormContext()
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={(params) => <TextInputItem {...params} fieldName={fieldName } />}
    />
  )
}

const TextInputItem = ({ field, fieldState, formState, ...props }: any) => {
  const { rhf, setAfterDataChanged, form } = useBaseFormContext()
  console.log(rhf)
  const { placeholder, label, disableFn } = rhf[props.name]

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    field.onChange(e)
    if (setAfterDataChanged)
      setAfterDataChanged(form, props.name, e.currentTarget.value)
  }
  const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    field.onBlur(e)
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
          disabled={disableFn ? disableFn(formState) : false}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default TextInput
