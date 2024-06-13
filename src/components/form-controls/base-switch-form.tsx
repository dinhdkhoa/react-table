'use client'
import { BasicSwitchFormType } from "./types"
import { Switch } from "../ui/switch";

export function BasicSwitchForm({ form,
    rhf,
    onChange, field, disabled }: BasicSwitchFormType) {
    return (
        <div className="flex items-center space-x-2">
            <Switch id={rhf.name} {...field} onCheckedChange={(e) => {
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
