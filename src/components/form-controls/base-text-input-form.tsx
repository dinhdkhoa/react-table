"use client"

import { BasicInputFormType, BasicTextFormType } from "./types"
import { Input } from "../ui/input"
import { Control } from "@/core/anotations/hook-form"
export function BasicTextInputForm({ form,
    rhf,
    onChange, onBlur, field, type }: BasicTextFormType) {

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
            placeholder={rhf.options.placeHolder}
            type={'text'}
            minLength={type.minLength}
            maxLength={type.maxLength}
        />
    )
}
