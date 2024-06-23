import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useBaseFormContext
} from "@/components/ui/form"
import { DateControl } from "@/core/anotations/hook-form-refac"
import { useEffect, useState } from "react"
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from "react-hook-form"
import { FieldInputPropsType } from "./types"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { TimePickerDemo } from "../ui/date-time-input.tsx/time-picker-demo"
import { cn } from "@/lib/utils"

const BaseDateTimeInput = <TEntity extends FieldValues = FieldValues>({
  name
}: FieldInputPropsType<TEntity>) => {
  const { form, rhf, entity } = useBaseFormContext<DateControl, TEntity>()
  const { visibleFn } = rhf[name]['options'];

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
      render={(params) => <DateTimeInputItem visibled={visibled} {...params} />}
    />
  )
}

const DateTimeInputItem = <TEntity extends FieldValues = FieldValues,>({ field, fieldState, formState, visibled = true }: { field: ControllerRenderProps<TEntity, Path<TEntity>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<TEntity>, visibled?: boolean }) => {
  const { rhf, setAfterDataChanged, form, entity } = useBaseFormContext<DateControl>()
  const { placeholder, label, disableFn, validate, includeTime } = rhf[field.name]['options'];

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
    field.onChange(e)
    if (setAfterDataChanged)
      setAfterDataChanged(form, field.name, e)
  }

  console.log("includeTime", includeTime);

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
                "justify-start text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? (
                format(field.value, "PPP HH:mm:ss")
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={handleChange}
              initialFocus
            />
            
            {includeTime && <div className="p-3 border-t border-border">
              <TimePickerDemo
                setDate={handleChange}
                date={field.value}
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
