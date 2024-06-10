"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UseFormReturn } from "react-hook-form"
import { RHFOptions, SelectOption } from "@/core/anotations/hook-form"
import { onChangeFun } from "@/core/classes/base-entity-form"
import { useEffect } from "react"

export type BasicComboboxFormType = {
  form: UseFormReturn,
  rhf: { name: string, options: RHFOptions, selectOption?: SelectOption },
  onChange?: onChangeFun,
  formValue?: any
}

const clearFilter = (onClick: () => void) => (
  <X onClick={e => { e.stopPropagation(); onClick(); }} className="ml-2 h-4 w-4 shrink-0" />
);

export function BasicComboboxForm(
  { form,
    rhf,
    onChange }: BasicComboboxFormType) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<any>(form.getValues(rhf.name))

  useEffect(() => {
    setValue(form.getValues(rhf.name))
    // if (onChange) {
    //   onChange(form, rhf.name, form.getValues(rhf.name))
    // }
  }, [form.getValues(rhf.name)])

  const display = () => {
    if (value) {
      const findItem = rhf.selectOption?.data.find((basicItem) => rhf.selectOption?.value(basicItem) == value);
      if (findItem) {
        return rhf.selectOption?.display(findItem) || '';
      }
      return 'N/A';
    }

    return `Select ${rhf.options.label}`
  }

  const getKey = (item: any) => {
    return rhf.selectOption!.value(item)?.toString()
  }

  const getValueString = (item: any) => {
    return getKey(item);
  }

  const getValue = (item: any) => {
    rhf.selectOption?.value(item);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <span className="truncate">{value
            ? display()
            : `Select ${rhf.options.label}`}</span>
          {value ? clearFilter(() => {
            setValue(undefined)
            form.setValue(rhf.name, undefined)
            if (onChange) {
              onChange(form, rhf.name, undefined);
            }
          }) : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full	p-0">
        <Command>
          <CommandInput placeholder={`Search ${rhf.options.label}`} />
          <CommandList>
            <CommandEmpty>{`No ${rhf.options.label} found`}</CommandEmpty>
            <CommandGroup>
              {rhf.selectOption?.data.map((basicItem) => (
                <CommandItem
                  key={getKey(basicItem)}
                  value={getValueString(basicItem)}
                  onSelect={(currentValue) => {
                    const _valueString = (currentValue == value ? undefined : currentValue);
                    const _value = getValue(basicItem);
                    form.setValue(rhf.name, _value)
                    setValue(_valueString)
                    if (onChange) {
                      onChange(form, rhf.name, _value);
                    }
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value == rhf.selectOption!.value(basicItem) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {rhf.selectOption!.display(basicItem)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
