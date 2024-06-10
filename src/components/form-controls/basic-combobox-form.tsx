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
import { RHFOptions } from "@/core/anotations/hook-form"
import { onChangeFun } from "@/core/classes/base-entity-form"

export type BasicComboboxFormType = {
  form: UseFormReturn,
  rhf: { name: string, options: RHFOptions },
  onChange?: onChangeFun
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

  const display = () => {
    if (value) {
      const findItem = rhf.options.selectOption?.data.find((basicItem) => rhf.options.selectOption?.value(basicItem) == value);
      if (findItem) {
        return rhf.options.selectOption?.display(findItem) || '';
      }
      return 'N/A';
    }

    return `Select ${rhf.options.label}`
  }

  const key = (item: any) => {
    return rhf.options.selectOption!.value(item)?.toString()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
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
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${rhf.options.label}`} />
          <CommandList>
            <CommandEmpty>{`No ${rhf.options.label} found`}</CommandEmpty>
            <CommandGroup>
              {rhf.options.selectOption?.data.map((basicItem) => (
                <CommandItem
                  key={key(basicItem)}
                  value={key(basicItem)}
                  onSelect={(currentValue) => {
                    const _value = (currentValue == value ? undefined : currentValue);
                    form.setValue(rhf.name, _value)
                    setValue(_value)
                    if (onChange) {
                      onChange(form, rhf.name, _value);
                    }
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value == rhf.options.selectOption!.value(basicItem) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {rhf.options.selectOption!.display(basicItem)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
