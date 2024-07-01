import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from "react-hook-form"
import { BaseFormFieldPropsType } from "./types"
import { Switch } from "../../ui/switch"
import { useBaseFormContext } from ".."
import { SwitchControl } from "@/core/types/control.types"

const BaseSwitchInput = <TEntity extends FieldValues = FieldValues>({
    name
}: BaseFormFieldPropsType<TEntity>) => {
    const { form, rhf } = useBaseFormContext<TEntity>()
    const { visibleFn } = rhf[name];

    const [visibled, setVisibled] = useState<boolean>(() => {
        if (visibleFn) {
            return visibleFn(form, form.getValues());
        }
        return true;
    });

    useEffect(() => {
        if (visibleFn) {
            setVisibled(visibleFn(form, form.getValues()));
        }
    }, [form.watch()]);

    return (visibled &&
        <FormField
            control={form.control}
            name={name}
            render={(params) => <BaseSwitchItem visibled={visibled} {...params} />}
        />
    )
}

const BaseSwitchItem = <TEntity extends FieldValues = FieldValues, TControlType extends SwitchControl = SwitchControl>({ field, fieldState, formState, visibled = true }: { field: ControllerRenderProps<TEntity, Path<TEntity>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<TEntity>, visibled?: boolean }) => {
    const { rhf, setAfterDataChanged, form } = useBaseFormContext<TEntity>()
    const { label, disableFn, validate } = rhf[field.name];

    const [disabled, setDisabled] = useState<boolean>(() => {
        if (disableFn) {
            return disableFn(form, form.getValues());
        }
        return false;
    });

    useEffect(() => {
        if (disableFn) {
            setDisabled(disableFn(form, form.getValues()));
        }
    }, [form.watch()]);

    useEffect(() => {
        form.register(field.name, {
            validate: !((disableFn ? disableFn(form, form.getValues()) : false) || !visibled) ? validate : undefined
        })
        if (disabled) {
            form.clearErrors(field.name)
        }
    }, [disableFn, disabled, field.name, form, validate, visibled])


    const handleChange = (e: boolean) => {
        form.setValue(field.name, e as any);
        if (setAfterDataChanged)
            setAfterDataChanged(form, field.name, e, form.getValues())
    }

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <div className="flex items-center space-x-2">
                    <Switch id={field.name} {...field} onCheckedChange={handleChange} disabled={disabled} checked={form.getValues(field.name)} />
                    <label
                        htmlFor={field.name}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                    </label>
                </div>

            </FormControl>
            <FormMessage />
        </FormItem>
    )
}

export default BaseSwitchInput
