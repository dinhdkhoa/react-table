"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { RHFOptions } from "@/core/anotations/hook-form"
import { onChangeFun } from "@/core/classes/base-entity-form"
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form"
import { BasicComboboxFormType } from "./basic-combobox-form"

export type BasicCheckboxFormType = {
    form: UseFormReturn,
    rhf: { name: string, options: RHFOptions },
    onChange?: onChangeFun,
    field: ControllerRenderProps<FieldValues, string>,
    formValue?: any
}


export function BasicCheckboxForm({ form,
    rhf,
    onChange, field }: BasicComboboxFormType) {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox id={rhf.name} checked={field.value} onCheckedChange={field.onChange} />
            <label
                htmlFor={rhf.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {rhf.options.label}
            </label>
        </div>
    )
}
