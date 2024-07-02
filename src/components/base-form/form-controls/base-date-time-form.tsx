import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from "react-hook-form"
import { BaseFormFieldPropsType } from "./types"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Button } from "../../ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "../../ui/calendar"
import { TimePickerDemo } from "../../ui/date-time-input.tsx/time-picker-demo"
import { cn } from "@/lib/utils"
import { useBaseFormContext } from ".."
import { DateControl } from "@/core/types/control.types"
import { RHFOptions } from "@/core/anotations/rhf-field"

const BaseDateTimeInput = <TEntity extends FieldValues = FieldValues>({
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
      render={(params) => <BaseDateTimeInputItem visibled={visibled} {...params} />}
    />
  )
}

const BaseDateTimeInputItem = <TEntity extends FieldValues = FieldValues, TControlType extends DateControl = DateControl>({ field, fieldState, formState, visibled = true }: { field: ControllerRenderProps<TEntity, Path<TEntity>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<TEntity>, visibled?: boolean }) => {
  const { rhf, setAfterDataChanged, form, showLabel } = useBaseFormContext<TEntity>()
  const { placeholder, label, disableFn, validate, includeTime } = rhf[field.name] as RHFOptions<TEntity, TControlType>;

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
    form.register(field.name, {
      validate: !((disableFn ? disableFn(form, form.getValues()) : false) || !visibled) ? validate : undefined
    })
    if (disabled) {
      form.clearErrors(field.name)
    }
  }, [disableFn, disabled, field.name, form, validate, visibled])


  const handleChange = (e: Date | undefined) => {
    form.setValue(field.name, e as any);
    if (setAfterDataChanged)
      setAfterDataChanged(form, field.name, e, form.getValues())
  }

  const display = () => {
    const _value = form.getValues(field.name);
    if(_value){
      if ((_value as any) instanceof Date) {
        return _value?.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short'
      })
    }
      
    }
    
    return placeholder;
  }

  return (
    <FormItem>
      {showLabel && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant="outline"
              className={cn(
                "justify-start text-left font-normal w-full bg-transparent",
                !form.getValues(field.name) && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="truncate">{display()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">

            <Calendar
              mode="single"
              selected={form.getValues(field.name)}
              onSelect={handleChange}
              initialFocus
            />

            {includeTime && <div className="p-3 border-t border-border">
              <TimePickerDemo
                setDate={handleChange}
                date={form.getValues(field.name)}
              />
            </div>}
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default BaseDateTimeInput
