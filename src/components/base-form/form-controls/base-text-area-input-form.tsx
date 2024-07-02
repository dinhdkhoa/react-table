import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ChangeEvent, FocusEvent, useEffect, useState } from "react"
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from "react-hook-form"
import { BaseFormFieldPropsType } from "./types"
import { cn } from "@/lib/utils"
import { Textarea } from "../../ui/textarea"
import { useBaseFormContext } from ".."
import { TextAreaControl } from "@/core/types/control.types"
import { RHFOptions } from "@/core/anotations/rhf-field"

const BaseTextAreaInput = <TEntity extends FieldValues = FieldValues>({
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
            render={(params) => <BaseTextAreaInputItem visibled={visibled} {...params} />}
        />
    )
}

const BaseTextAreaInputItem = <TEntity extends FieldValues = FieldValues, TControlType extends TextAreaControl = TextAreaControl>({ field, fieldState, formState, visibled = true }: { field: ControllerRenderProps<TEntity, Path<TEntity>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<TEntity>, visibled?: boolean }) => {
    const { rhf, setAfterDataChanged, form, onBlur, showLabel } = useBaseFormContext<TEntity>()
    const { placeholder, label, disableFn, validate, minLength, maxLength, resize } = rhf[field.name] as RHFOptions<TEntity, TControlType>;

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
            validate: !((disableFn ? disableFn(form, form.getValues()) : false) || !visibled) ? validate : undefined,
            onChange: handleChange,
            onBlur: handleBlur
        })
        if (disabled) {
            form.clearErrors(field.name)
        }
    }, [disableFn, disabled, field.name, form, validate, visibled])


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (setAfterDataChanged)
            setAfterDataChanged(form, field.name, e.target.value, form.getValues())
    }
    const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
        if (onBlur) {
            onBlur(form, field.name, e.target.value, form.getValues())
        }
    }

    return (
        <FormItem>
            {showLabel && <FormLabel>{label}</FormLabel>}
            <FormControl>
                <Textarea {...field}
                    className={cn((resize ? '' : 'resize-none'))}
                    disabled={disabled}
                    placeholder={placeholder}
                    minLength={minLength}
                    maxLength={maxLength}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    )
}

export default BaseTextAreaInput
