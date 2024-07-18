import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useEffect, useState } from 'react'
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from 'react-hook-form'
import { BaseFormFieldPropsType } from './types'
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group'
import { cn } from '@/lib/utils'
import { Direction, RadioGroupControl } from '@/core/types/control.types'
import { useBaseFormContext } from '..'
import { RHFOptions } from '@/core/anotations/rhf-field'
import { VariantProps, cva } from 'class-variance-authority'
import { SharedVariantProps, SharedVariants } from './shared-variants'

const directionCol = 'flex-col space-y-1'
const directionRow = 'flex-row'

// Variants

const BaseRadioVariants = cva(null, {
  variants: {
    radioVariants: {
      vertical: 'flex flex-col space-y-1',
      horizontal: 'flex flex-row'
    }
  },
  defaultVariants: {
    radioVariants: 'vertical'
  }
})

// Types & Interface

type BaseRadioVariantsProps = VariantProps<typeof BaseRadioVariants>

type BaseRadioProps<TEntity extends FieldValues = FieldValues> = BaseFormFieldPropsType<TEntity> &
  SharedVariantProps &
  BaseRadioVariantsProps

type BaseRadioGroupItemsProps<TEntity extends FieldValues = FieldValues> = {
  field: ControllerRenderProps<TEntity, Path<TEntity>>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<TEntity>
  visibled?: boolean
} & SharedVariantProps &
  BaseRadioVariantsProps

// Components

const BaseRadioGroup = <TEntity extends FieldValues = FieldValues>({ name, ...props }: BaseRadioProps<TEntity>) => {
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
        render={(params) => <BaseRadioGroupItem visibled={visibled} {...params} {...props} />}
      />
    )
  )
}

const BaseRadioGroupItem = <
  TEntity extends FieldValues = FieldValues,
  TControlType extends RadioGroupControl = RadioGroupControl
>(
  props: BaseRadioGroupItemsProps<TEntity>
) => {
  const { field, fieldState, formState, formVariant, showLabel, radioVariants, visibled = true } = props
  const { rhf, setAfterDataChanged, form } = useBaseFormContext<TEntity>()
  const { label, disableFn, validate, direction, selectOption } = rhf[field.name] as RHFOptions<TEntity, TControlType>
  const [directionItem] = useState(() => {
    if (direction == Direction.Column) return directionCol
    return directionRow
  })

  const [disabled, setDisabled] = useState<boolean>(() => {
    if (disableFn) {
      return disableFn(form, form.getValues())
    }
    return false
  })

  const handleChange = (e: string) => {
    form.setValue(field.name, getValue(e) as any)
    if (setAfterDataChanged) setAfterDataChanged(form, field.name, e, form.getValues())
  }

  const getKey = (item: any) => {
    return selectOption!.value(item)?.toString() || ''
  }

  const getValueString = (item: any) => {
    return getKey(item)
  }

  const getValue = (valueChange: any) => {
    if (valueChange) {
      const findItem = selectOption.data.find((item) => selectOption.valueString(item) == valueChange)
      if (findItem) {
        return selectOption.value(findItem)
      }
    }
    return undefined
  }

  useEffect(() => {
    if (disableFn) {
      setDisabled(disableFn(form, form.getValues()))
    }
  }, [form.watch()])

  useEffect(() => {
    form.register(field.name, {
      validate: !((disableFn ? disableFn(form, form.getValues()) : false) || !visibled) ? validate : undefined
    })
    if (disabled) {
      form.clearErrors(field.name)
    }
  }, [disableFn, disabled, field.name, form, validate, visibled])

  return (
    <FormItem>
      <FormLabel htmlFor={field.name} className={cn(SharedVariants({ showLabel }))}>{label}</FormLabel>
      <FormControl>
        <RadioGroup
          id={field.name}
          disabled={disabled}
          onValueChange={handleChange}
          defaultValue={form.getValues(field.name)?.toString()}
          className={cn(BaseRadioVariants({ radioVariants }))}
        >
          {selectOption.data.map((item) => (
            <FormItem key={getValueString(item)} className='flex items-center space-x-3 space-y-0'>
              <FormControl>
                <RadioGroupItem value={getValueString(item)} />
              </FormControl>
              <FormLabel className='font-normal'>{selectOption.display(item)}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default BaseRadioGroup
