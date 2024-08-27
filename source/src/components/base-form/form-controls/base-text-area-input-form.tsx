import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ChangeEvent, FocusEvent, useEffect, useState } from 'react'
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from 'react-hook-form'
import { BaseFormFieldPropsType } from './types'
import { cn } from '@/lib/utils'
import { Textarea } from '../../ui/textarea'
import { useBaseFormContext } from '..'
import { TextAreaControl } from '@/core/types/control.types'
import { RHFOptions } from '@/core/anotations/rhf-field'
import { VariantProps, cva } from 'class-variance-authority'
import { SharedVariantProps, SharedVariants } from './shared-variants'

// Variants

const baseTextAreaVariants = cva(null, {
  variants: {
    baseTextAreaVariant: {
      default: ''
    },
    resizeable: {
      none: 'resize-none'
    }
  },
  defaultVariants: {
    baseTextAreaVariant: 'default'
  }
})

// Types & Interface

type BaseTextAreaVariantsProps = VariantProps<typeof baseTextAreaVariants>

type BaseTextAreaProps<TEntity extends FieldValues = FieldValues> = BaseFormFieldPropsType<TEntity> &
  SharedVariantProps &
  BaseTextAreaVariantsProps

type BaseTextAreaItemsProps<TEntity extends FieldValues = FieldValues> = {
  field: ControllerRenderProps<TEntity, Path<TEntity>>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<TEntity>
  visibled?: boolean
} & SharedVariantProps &
  BaseTextAreaVariantsProps

// Components

const BaseTextArea = <TEntity extends FieldValues = FieldValues>({ name, ...props }: BaseTextAreaProps<TEntity>) => {
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
        render={(params) => <BaseTextAreaItem visibled={visibled} {...params} {...props} />}
      />
    )
  )
}

const BaseTextAreaItem = <
  TEntity extends FieldValues = FieldValues,
  TControlType extends TextAreaControl = TextAreaControl
>(
  props: BaseTextAreaItemsProps<TEntity>
) => {
  const {
    field,
    fieldState,
    formState,
    formVariant,
    baseTextAreaVariant,
    resizeable,
    showLabel,
    visibled = true
  } = props
  const { rhf, setAfterDataChanged, form, onBlur } = useBaseFormContext<TEntity>()
  const { placeholder, label, disableFn, validate, minLength, maxLength, resize } = rhf[field.name] as RHFOptions<
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
  }, [disableFn, disabled, field.name, form, validate, visibled, form.formState])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (setAfterDataChanged) setAfterDataChanged(form, field.name, e.target.value, form.getValues())
  }
  const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (onBlur) {
      onBlur(form, field.name, e.target.value, form.getValues())
    }
  }

  return (
    <FormItem className={cn(!showLabel ? "" : "space-y-0")} >
      <FormLabel htmlFor={field.name} className={cn(SharedVariants({ showLabel }))}>{label}</FormLabel>
      <FormControl>
        <Textarea
          {...field}
          id={field.name}
          className={cn(baseTextAreaVariants({ resizeable }))}
          disabled={disabled}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default BaseTextArea
