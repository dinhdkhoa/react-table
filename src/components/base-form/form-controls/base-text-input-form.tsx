import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ChangeEvent, FocusEvent, useEffect, useState } from "react"
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn
} from "react-hook-form"
import { BaseFormFieldPropsType } from "./types"
import { useBaseFormContext } from ".."
import { TextControl } from "@/core/types/control.types"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { SharedVariantProps, SharedVariants } from "./shared-variants"
import { RHFOptions } from "@/core/anotations/rhf-field"


const baseTextInputVariants = cva(
  null,
  {
    variants: {
      variant: {
        default:
          "",
      },
    },
    defaultVariants: {
      variant: "default"
    }
  }
)
type BaseTextInputVariantsProps = VariantProps<typeof baseTextInputVariants>
type BaseTextInputItemsProps<TEntity extends FieldValues = FieldValues> = {
  field: ControllerRenderProps<TEntity, Path<TEntity>>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<TEntity>
  visibled?: boolean
} & SharedVariantProps &
  BaseTextInputVariantsProps

const BaseTextInput = <TEntity extends FieldValues = FieldValues>({
  name,
  variant,
  labelVariant
}: BaseFormFieldPropsType<TEntity> &
  SharedVariantProps &
  BaseTextInputVariantsProps) => {
  const { form, rhf } = useBaseFormContext<TEntity>()
  const { visibleFn } = rhf[name]
  const [visibled, setVisibled] = useState<boolean>(() => {
    if (visibleFn) {
      return visibleFn(form, form.getValues())
    }
    return true
  })

  useEffect(() => {
    if (visibleFn) {
      setVisibled(visibleFn(form, form.getValues()))
    }
  }, [form.watch()])

  return (
    visibled && (
      <FormField
        control={form.control}
        name={name}
        render={(params) => (
          <BaseTextInputItem
            visibled={visibled}
            {...params}
            variant={variant}
            labelVariant={labelVariant}
          />
        )}
      />
    )
  )
}

const BaseTextInputItem = <TEntity extends FieldValues = FieldValues, TControlType extends TextControl = TextControl>(props: BaseTextInputItemsProps<TEntity>) => {
  const {
    field,
    fieldState,
    formState,
    variant,
    labelVariant,
    visibled = true
  } = props
  const { rhf, setAfterDataChanged, form, onBlur, showLabel } = useBaseFormContext<TEntity>();
  const { placeholder, label, disableFn, validate, minLength, maxLength } = rhf[field.name] as RHFOptions<TEntity, TControlType>;

  const [disabled, setDisabled] = useState<boolean>(() => {
    if (disableFn) {
      return disableFn(form, form.getValues())
    }
    return false
  })

  useEffect(() => {
    if (disableFn) {
      setDisabled(disableFn(form, form.getValues()))
    }
  }, [form.watch()])

  useEffect(() => {
    form.register(field.name, {
      validate: !((disableFn ? disableFn(form, form.getValues()) : false) || !visibled)
        ? validate
        : undefined,
      onChange: handleChange,
      onBlur: handleBlur
    })
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
      {showLabel && <FormLabel className={cn(SharedVariants({ labelVariant }))}>
        {label}
      </FormLabel>}
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
