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
import { RHFOptions, TextControl } from "@/core/anotations/hook-form-refac"
import { BaseEntityForm } from "@/core/classes/base-entity-form"
import { ChangeEvent, FocusEvent } from "react"
import { FieldPath, FieldValues, Path } from "react-hook-form"

type TextInputPropsType<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}
const TextInput = <TEntity extends BaseEntityForm>({
  name
}: TextInputPropsType<TEntity>) => {
  const { form } = useBaseFormContext<TEntity, TextControl>()
  return (
    <FormField
      control={form.control}
      name={name}
      render={(params) => <TextInputItem {...params} />}
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
          disabled={disableFn ? disableFn() : false}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default TextInput
