'use client'

import { BasicTextFormType } from "./types"
import { Input } from "../ui/input"
export function BasicTextInputForm({ form,
    rhf,
    onChange, onBlur, field, type, disabled }: BasicTextFormType) {
    return (
        <Input {...field}
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
            disabled={disabled}
            placeholder={rhf.options.placeHolder}
            type={'text'}
            minLength={type.minLength}
            maxLength={type.maxLength}
        />
    )
}
