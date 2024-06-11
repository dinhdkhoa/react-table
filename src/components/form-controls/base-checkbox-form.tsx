"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { BasicCheckboxFormType } from "./types"
import { useEffect, useState } from "react";

export function BasicCheckboxForm({ entity, form,
    rhf,
    onChange, field }: BasicCheckboxFormType) {

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
        <div className="flex items-center space-x-2">
            <Checkbox id={rhf.name} {...field} onCheckedChange={(e) => {
                field.onChange(e);
                if (onChange) {
                    onChange(form, rhf.name, e)
                }
            }} disabled={disabled} checked={field.value} />
            <label
                htmlFor={rhf.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {rhf.options.label}
            </label>
        </div>
    )
}
