import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useEffect, useMemo, useState } from 'react'
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from 'react-hook-form'
import { BaseFormFieldPropsType } from './types'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Button } from '../../ui/button'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../ui/command'
import { cn } from '@/lib/utils'
import { Badge } from '../../ui/badge'
import { useBaseFormContext } from '..'
import { MultipleSelectControl } from '@/core/types/control.types'
import { RHFOptions } from '@/core/anotations/rhf-field'
import { SharedVariantProps, SharedVariants } from './shared-variants'
import { VariantProps, cva } from 'class-variance-authority'

// Variants

const MultipleSelectVariants = cva(null, {
  variants: {
    multipleSelectVariants: {
      default: ''
    }
  },
  defaultVariants: {
    multipleSelectVariants: 'default'
  }
})

// Types & Interface

type BaseMultipleSelectVariantsProps = VariantProps<typeof MultipleSelectVariants>

type BaseMultipleSelectProps<TEntity extends FieldValues = FieldValues> = BaseFormFieldPropsType<TEntity> &
  SharedVariantProps &
  BaseMultipleSelectVariantsProps

type BaseMultipleSelectItemsProps<TEntity extends FieldValues = FieldValues> = {
  field: ControllerRenderProps<TEntity, Path<TEntity>>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<TEntity>
  visibled?: boolean
} & SharedVariantProps &
  BaseMultipleSelectVariantsProps

// Components

const BaseMultipleSelect = <TEntity extends FieldValues = FieldValues>({
  name,
  ...props
}: BaseMultipleSelectProps<TEntity>) => {
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
        render={(params) => <BaseMultipleSelectItem visibled={visibled} {...params} {...props} />}
      />
    )
  )
}

const clearFilter = (onClick: () => void) => (
  <X
    onClick={(e) => {
      e.stopPropagation()
      onClick()
    }}
    className='ml-2 h-4 w-4 shrink-0'
  />
)

const BaseMultipleSelectItem = <
  TEntity extends FieldValues = FieldValues,
  TControlType extends MultipleSelectControl = MultipleSelectControl
>(
  props: BaseMultipleSelectItemsProps<TEntity>
) => {
  const { field, fieldState, formState, formVariant, multipleSelectVariants, showLabel, visibled = true } = props
  const { rhf, setAfterDataChanged, form } = useBaseFormContext<TEntity>()
  const { placeholder, label, disableFn, selectOption, validate } = rhf[field.name] as RHFOptions<TEntity, TControlType>
  const [open, setOpen] = useState(false)

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
      validate: !((disableFn ? disableFn(form, form.getValues()) : false) || !visibled) ? validate : undefined
    })
    if (disabled) {
      form.clearErrors(field.name)
    }
  }, [disableFn, disabled, field.name, form, validate, visibled, form.formState])

  const handleChange = (e: any) => {
    form.setValue(field.name, e)
    if (setAfterDataChanged) setAfterDataChanged(form, field.name, e, form.getValues())
  }

  const getKey = (item: any) => {
    return selectOption!.value(item)?.toString()
  }

  const getValue = (item: any) => {
    const value = selectOption.value(item)
    return value
  }

  const getItemDisplay = (item: any) => {
    const value = selectOption.display(item)
    return value
  }

  const onSelectItem = (item: any) => {
    const _value = getValue(item)
    if (_value) {
      let fieldValue = (form.getValues(field.name) || []) as any[]
      if (fieldValue.includes(_value)) {
        fieldValue = fieldValue.filter((w) => w != _value)
      } else {
        fieldValue.push(_value)
      }
      handleChange(fieldValue)
    }
  }

  const onUnSelectItem = (item: any) => {
    const _value = getValue(item)
    if (_value) {
      let fieldValue = (form.getValues(field.name) || []) as any[]
      if (fieldValue.includes(_value)) {
        fieldValue = fieldValue.filter((w) => w != _value)
        handleChange(fieldValue)
      }
    }
  }

  const { itemSelected, display } = useMemo(() => {
    const fieldValue = (form.getValues(field.name) || []) as any[]
    const itemSelected: any[] = []
    fieldValue.forEach((val) => {
      selectOption.data.forEach((e) => {
        const _eValue = selectOption.value(e)
        if (_eValue && val == _eValue) {
          itemSelected.push(e)
        }
      })
    })

    let display = (
      <div className='flex flex-wrap gap-1'>
        {itemSelected.map((item) => {
          return (
            <Badge key={getValue(item) as any} variant='secondary'>
              {getItemDisplay(item)}
              <X
                onClick={(e) => {
                  onUnSelectItem(item)
                  e.stopPropagation()
                }}
                className='ml-2 h-3 w-3 shrink-0'
              />
            </Badge>
          )
        })}
      </div>
    )

    return { itemSelected, display }
  }, [form.getValues(field.name)])

  return (
    <FormItem className={cn(!showLabel ? "" : "space-y-0")} >
      <FormLabel htmlFor={field.name} className={cn(SharedVariants({ showLabel }))}>{label}</FormLabel>
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={field.name}
              disabled={disabled}
              variant='outline'
              role='combobox'
              className={cn('flex h-auto justify-between bg-transparent hover:bg-secondary/30')}
            >
              {itemSelected.length > 0 ? display : placeholder}
              {itemSelected.length > 0 ? (
                clearFilter(() => {
                  handleChange([])
                })
              ) : (
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-0'>
            <Command>
              <CommandInput placeholder={`Search ${label}`} />
              <CommandList>
                <CommandEmpty>{`No ${label} found`}</CommandEmpty>
                <CommandGroup>
                  {selectOption.data.map((item) => (
                    <CommandItem
                      value={getItemDisplay(item)}
                      key={getKey(item)}
                      onSelect={() => {
                        onSelectItem(item)
                      }}
                    >
                      <Check
                        className={cn('mr-2 h-4 w-4', itemSelected.includes(item) ? 'opacity-100' : 'opacity-0')}
                      />
                      {getItemDisplay(item)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default BaseMultipleSelect
