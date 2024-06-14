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
import { ChangeEvent, FocusEvent } from "react"

type props = {
  name: string
}
const TextInput = ({ ...props }: props) => {
  const { form } = useBaseFormContext()
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={(params) => <TextInputItem {...params} {...props} />}
    />
  )
}

const TextInputItem = ({ field, fieldState, formState, ...props }: any) => {
  const { rhf, setAfterDataChanged, form } = useBaseFormContext()
  const {
    visibleFn,
    placeholder,
    label,
    disableFn
  } = rhf[props.name]

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
