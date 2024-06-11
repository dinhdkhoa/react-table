"use client"

import { BasicDateTimeFormType } from "./types"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { TimePickerDemo } from "../ui/date-time-input.tsx/time-picker-demo"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
export function BasicDateTimeInputForm({ entity, form,
    rhf,
    onChange, field, type }: BasicDateTimeFormType) {

    const [disabled, setDisabled] = useState<boolean>(false);
    const [visibled, setVisibled] = useState<boolean>(true);

    useEffect(() => {
        if (rhf.options.disableFn) {
            setDisabled(rhf.options.disableFn(form, entity))
        }
        if (rhf.options.visibleFn) {
            setVisibled(rhf.options.visibleFn(form, entity))
        }
    }, [form.getValues()]);

    return (visibled &&
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
                    onSelect={(e) => {
                        field.onChange(e);
                        if (onChange) {
                            onChange(form, rhf.name, e);
                        }
                    }}
                    initialFocus
                />
                {type.includeTime && <div className="p-3 border-t border-border">
                    <TimePickerDemo
                        setDate={(e) => {
                            field.onChange(e);
                            if (onChange) {
                                onChange(form, rhf.name, e);
                            }
                        }}
                        date={field.value}
                    />
                </div>}
            </PopoverContent>
        </Popover>
    )
}
