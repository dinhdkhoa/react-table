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

const BaseDateTimeInput = <TEntity extends FieldValues = FieldValues>({
  name
}: BaseFormFieldPropsType<TEntity>) => {
  const { form, rhf, entity } = useBaseFormContext<DateControl, TEntity>()
  const { visibleFn } = rhf[name];

  const [visibled, setVisibled] = useState<boolean>(() => {
    if (visibleFn) {
      return visibleFn(form, entity);
    }
    return true;
  });

  useEffect(() => {
    if (visibleFn) {
      setVisibled(visibleFn(form, entity));
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

const BaseDateTimeInputItem = <TEntity extends FieldValues = FieldValues,>({ field, fieldState, formState, visibled = true }: { field: ControllerRenderProps<TEntity, Path<TEntity>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<TEntity>, visibled?: boolean }) => {
  const { rhf, setAfterDataChanged, form, entity } = useBaseFormContext<DateControl>()
  const { placeholder, label, disableFn, validate, includeTime } = rhf[field.name];

  const [disabled, setDisabled] = useState<boolean>(() => {
    if (disableFn) {
      return disableFn(form, entity);
    }
    return false;
  });

  useEffect(() => {
    if (disableFn) {
      setDisabled(disableFn(form, entity));
    }
  }, [form.watch()]);

  useEffect(() => {
    form.register(field.name, {
      validate: !((disableFn ? disableFn(form, entity) : false) || !visibled) ? validate : undefined
    })
    if (disabled) {
      form.clearErrors(field.name)
    }
  }, [disableFn, disabled, entity, field.name, form, validate, visibled])


  const handleChange = (e: Date | undefined) => {
    form.setValue(field.name, e as any);
    if (setAfterDataChanged)
      setAfterDataChanged(form, field.name, e)
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant="outline"
              className={cn(
                "justify-start text-left font-normal w-full",
                !form.getValues(field.name) && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="truncate">{form.getValues(field.name) ? (
                format(form.getValues(field.name), "PPP HH:mm:ss")
              ) : (
                placeholder
              )}</span>
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
