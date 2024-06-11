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
import { BasicComboboxFormType } from "./types"

const clearFilter = (onClick: () => void) => (
  <X onClick={e => { e.stopPropagation(); onClick(); }} className="ml-2 h-4 w-4 shrink-0" />
);

export function BasicComboboxForm(
  { form,
    rhf,
    onChange, field, type }: BasicComboboxFormType<any, any>) {
  const [open, setOpen] = React.useState(false)

  const display = () => {
    const _value = field.value;
    if (_value) {
      const findItem = type.selectOption.data.find((basicItem) => type.selectOption.value(basicItem) == _value);
      if (findItem) {
        return type.selectOption.display(findItem) || '';
      }
      return 'N/A';
    }

    return `Select ${rhf.options.label}`
  }

  const getKey = (item: any) => {
    return type.selectOption!.value(item)?.toString()
  }

  const getValueString = (item: any) => {
    return getKey(item);
  }

  const getFieldValueString = () => {
    return form.getValues(rhf.name)?.toString();
  }

  const getValue = (item: any) => {
    const value = type.selectOption.value(item);
    return value;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "justify-between",
            !field.value && "text-muted-foreground"
          )}
        >
          <span className="truncate">{field.value
            ? display()
            : `Select ${rhf.options.label}`}</span>
          {field.value ? clearFilter(() => {
            form.setValue(rhf.name, undefined)
            if (onChange) {
              onChange(form, rhf.name, undefined);
            }
          }) : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={`Search ${rhf.options.label}`} />
          <CommandList>
            <CommandEmpty>{`No ${rhf.options.label} found`}</CommandEmpty>
            <CommandGroup>
              {type.selectOption.data.map((language) => (
                <CommandItem
                  value={getKey(language)}
                  key={getValueString(language)}
                  onSelect={() => {
                    form.setValue(rhf.name, getValue(language))
                    if (onChange) {
                      onChange(form, rhf.name, getValue(language));
                    }
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      getValue(language) === field.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {type.selectOption!.display(language)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
