'use client'

import { cn } from "@/lib/utils"
import { Textarea } from "../ui/textarea"
import { BasicTextAreaFormType } from "./types"
export function BasicTextAreaInputForm({ form,
    rhf,
    onChange, onBlur, field, type, disabled }: BasicTextAreaFormType) {
    return (
        <Textarea {...field}
            {...form.register(rhf.name, {
                onChange: (e) => {
                    if (onChange) {
                        onChange(form, rhf.name, e.currentTarget.value)
                    }
                },
                onBlur: (e) => {
                    if (onBlur) {
                        onBlur(form, rhf.name, e.currentTarget.value)
                    }
                }
            })}
            className={cn((type.resize ? '' : 'resize-none'))}
            disabled={disabled}
            placeholder={rhf.options.placeHolder}
            minLength={type.minLength}
            maxLength={type.maxLength}
        />
    )
}
