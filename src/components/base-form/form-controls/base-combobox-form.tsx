import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useMemo, useState } from "react"
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from "react-hook-form"
import { BaseFormFieldPropsType } from "./types"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Button } from "../../ui/button"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../ui/command"
import { cn } from "@/lib/utils"
import { useBaseFormContext } from ".."
import { StaticComboboxControl } from "@/core/types/control.types"
import { RHFOptions } from "@/core/anotations/rhf-field"

const BaseComboboxInput = <TEntity extends FieldValues = FieldValues>({
  name
}: BaseFormFieldPropsType<TEntity>) => {
  const { form, rhf } = useBaseFormContext<TEntity>()
  const { visibleFn } = rhf[name];

  const [visibled, setVisibled] = useState<boolean>(() => {
    if (visibleFn) {
      return visibleFn(form, form.getValues());
    }
    return true;
  });

  useEffect(() => {
    if (visibleFn) {
      setVisibled(visibleFn(form, form.getValues()));
    }
  }, [form.watch()]);

  return (visibled &&
    <FormField
      control={form.control}
      name={name}
      render={(params) => <BaseComboboxInputItem visibled={visibled} {...params} />}
    />
  )
}


const clearFilter = (onClick: () => void) => (
  <X onClick={e => { e.stopPropagation(); onClick(); }} className="ml-2 h-4 w-4 shrink-0" />
);

const BaseComboboxInputItem = <TEntity extends FieldValues = FieldValues, TControlType extends StaticComboboxControl = StaticComboboxControl>({ field, fieldState, formState, visibled = true }: { field: ControllerRenderProps<TEntity, Path<TEntity>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<TEntity>, visibled?: boolean }) => {
  const { rhf, setAfterDataChanged, form } = useBaseFormContext<TEntity>()
  const { placeholder, label, disableFn, selectOption, validate, filterSelectOption } = rhf[field.name] as RHFOptions<TEntity, TControlType>;
  const [open, setOpen] = useState(false);
  const [inprocessData, setInprocessData] = useState(false);
  const [dataFiltered, setDataFiltered] = useState(() => {
    if (filterSelectOption) {
      setInprocessData(true);
      const filtered = selectOption.data.filter(w => filterSelectOption(w, form.getValues()));
      setInprocessData(false);
      return filtered;
    }
    setInprocessData(false);
    return selectOption.data;
  })

  const [disabled, setDisabled] = useState<boolean>(() => {
    if (disableFn) {
      return disableFn(form, form.getValues());
    }
    return false;
  });

  useEffect(() => {
    if (disableFn) {
      setDisabled(disableFn(form, form.getValues()));
    }
  }, [form.watch()]);

  useEffect(() => {
    if (filterSelectOption) {
      setInprocessData(true)
      const filtered = selectOption.data.filter(w => filterSelectOption(w, form.getValues()));
      setDataFiltered(filtered);
      setInprocessData(false)
    }
    else {
      setDataFiltered(selectOption.data);
      setInprocessData(false)
    }
  }, [filterSelectOption, form, open, selectOption.data])

  useEffect(() => {
    form.register(field.name, {
      validate: !((disableFn ? disableFn(form, form.getValues()) : false) || !visibled) ? validate : undefined,
    })
    if (disabled) {
      form.clearErrors(field.name)
    }
  }, [disableFn, disabled, field.name, form, validate, visibled])


  const handleChange = (e: any) => {
    form.setValue(field.name, e);
    if (setAfterDataChanged)
      setAfterDataChanged(form, field.name, e, form.getValues())
  }

  const display = useMemo(() => {
    const _value = form.getValues(field.name);
    if (_value) {
      const findItem = selectOption.data.find((basicItem) => selectOption.value(basicItem) == _value);
      if (findItem) {
        return selectOption.display(findItem) || '';
      }
      return 'N/A';
    }

    return placeholder;
  }, [form.getValues(field.name)])

  const getKey = (item: any) => {
    return selectOption!.value(item)?.toString()
  }

  const getValue = (item: any) => {
    const value = selectOption.value(item);
    return value;
  }

  const getItemDisplay = (item: any) => {
    const value = selectOption.display(item);
    return value;
  }

  return (
    <FormItem>
      <FormLabel id={field.name}>{label}</FormLabel>
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant="outline"
              role="combobox"
              className={cn(
                "justify-between w-full",
                !form.getValues(field.name) && "text-muted-foreground"
              )}
            >
              <span className="truncate">{form.getValues(field.name)
                ? display
                : placeholder}</span>
              {form.getValues(field.name) ? clearFilter(() => {
                handleChange(undefined);
              }) : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder={`Search ${label}`} />
              <CommandList>
                <CommandEmpty>{`No ${label} found`}</CommandEmpty>
                {inprocessData && <span>Data is inprocess...</span>}
                <CommandGroup>
                  {!inprocessData && dataFiltered.map((item) => (
                    <CommandItem
                      value={getItemDisplay(item)}
                      key={getKey(item)}
                      onSelect={() => {
                        const val = getValue(item);
                        handleChange(val)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          getValue(item) === form.getValues(field.name)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {selectOption!.display(item)}
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

export default BaseComboboxInput
