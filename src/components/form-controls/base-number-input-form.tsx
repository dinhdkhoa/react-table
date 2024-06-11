"use client"

import { BasicNumberFormType } from "./types"
import { Input } from "../ui/input"
import { useEffect, useState } from "react";
export function BasicNumberInputForm({ entity, form,
    rhf,
    onChange, onBlur, field, type }: BasicNumberFormType) {

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
            disabled={disabled}
            placeholder={rhf.options.placeHolder}
            type={'number'}
            min={type.min}
            max={type.max}
        />
    )
}
