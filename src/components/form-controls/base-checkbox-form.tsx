'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { BasicCheckboxFormType } from "./types"

export function BasicCheckboxForm({ entity, form,
    rhf,
    onChange, field, disabled }: BasicCheckboxFormType) {
    return (
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
