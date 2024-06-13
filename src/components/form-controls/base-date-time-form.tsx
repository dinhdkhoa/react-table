import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { TimePickerDemo } from "../ui/date-time-input.tsx/time-picker-demo"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { BasicControlFormType } from "./types"
import { DateControl } from "@/core/anotations/hook-form"
import { BaseEntityForm } from "@/core/classes/base-entity-form"

type BasicDateTimeInputFormTypeProps<TEntity> = BasicControlFormType<
  TEntity,
  DateControl
>

export function BasicDateTimeInputForm<
  TEntity extends BaseEntityForm<TEntity>
>({
  entity,
  form,
  rhf,
  field,
  disabled
}: BasicDateTimeInputFormTypeProps<TEntity>) {
  const { onChange } = entity
  const handleSelect = (e: Date | undefined) => {
    field.onChange(e)
    if (onChange) {
      onChange(form, rhf.name, e)
    }
  }
  return (
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
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={handleSelect}
          initialFocus
        />
        {rhf.includeTime && (
          <div className="p-3 border-t border-border">
            <TimePickerDemo setDate={handleSelect} date={field.value} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
