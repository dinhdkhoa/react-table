"use client"

import { BasicNumberFormType } from "./types"
import { Input } from "../ui/input"
export function BasicNumberInputForm({ form,
    rhf,
    onChange, onBlur, field, type }: BasicNumberFormType) {

    return (
        <Input {...field}
            {...form.register(rhf.name, {
                valueAsNumber: true,
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
            placeholder={rhf.options.placeHolder}
            type={'number'}
            min={type.min}
            max={type.max}
        />
    )
}
