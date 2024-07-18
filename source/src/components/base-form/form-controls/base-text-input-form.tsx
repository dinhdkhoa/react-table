import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ChangeEvent, FocusEvent, useEffect, useState } from 'react'
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from 'react-hook-form'
import { BaseFormFieldPropsType } from './types'
import { useBaseFormContext } from '..'
import { TextControl } from '@/core/types/control.types'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { SharedVariantProps, SharedVariants } from './shared-variants'
import { RHFOptions } from '@/core/anotations/rhf-field'

// Variants

const baseTextInputVariants = cva(null, {
  variants: {
    baseTextInputVariant: {
      default: ''
    }
  },
  defaultVariants: {
    baseTextInputVariant: 'default'
  }
})

// Types & Interfaces

type BaseTextInputVariantsProps = VariantProps<typeof baseTextInputVariants>

type BaseTextInputProps<TEntity extends FieldValues = FieldValues> = BaseFormFieldPropsType<TEntity> &
  SharedVariantProps &
  BaseTextInputVariantsProps

type BaseTextInputItemsProps<TEntity extends FieldValues = FieldValues> = {
  field: ControllerRenderProps<TEntity, Path<TEntity>>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<TEntity>
  visibled?: boolean
} & SharedVariantProps &
  BaseTextInputVariantsProps

// Components

const BaseTextInput = <TEntity extends FieldValues = FieldValues>({ name, ...props }: BaseTextInputProps<TEntity>) => {
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
        render={(params) => <BaseTextInputItem visibled={visibled} {...params} {...props} />}
      />
    )
  )
}

const BaseTextInputItem = <TEntity extends FieldValues = FieldValues, TControlType extends TextControl = TextControl>(
  props: BaseTextInputItemsProps<TEntity>
) => {
  const { field, fieldState, formState, formVariant, baseTextInputVariant, showLabel, visibled = true } = props

  const { rhf, setAfterDataChanged, form, onBlur } = useBaseFormContext<TEntity>()
  const { placeholder, label, disableFn, validate, minLength, maxLength } = rhf[field.name] as RHFOptions<
    TEntity,
    TControlType
  >

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
      validate: !((disableFn ? disableFn(form, form.getValues()) : false) || !visibled) ? validate : undefined,
      onChange: handleChange,
      onBlur: handleBlur
    })
    if (disabled) {
      form.clearErrors(field.name)
    }
  }, [disableFn, disabled, field.name, form, validate, visibled])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (setAfterDataChanged) setAfterDataChanged(form, field.name, e.target.value, form.getValues())
  }
  const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (onBlur) {
      onBlur(form, field.name, e.target.value, form.getValues())
    }
  }

  return (
    <FormItem>
      <FormLabel htmlFor={field.name} className={cn(SharedVariants({ showLabel }))}>{label}</FormLabel>
      <FormControl>
        <Input {...field} id={field.name} placeholder={placeholder} disabled={disabled} minLength={minLength} maxLength={maxLength} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default BaseTextInput
