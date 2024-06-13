'use client'

import { BasicRadioGroupFormType } from "./types"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { FormControl, FormItem, FormLabel } from "../ui/form"
import { Direction } from "@/core/anotations/hook-form";
import { useState } from "react";
import { cn } from "@/lib/utils";

const directionCol = 'flex-col space-y-1';
const directionRow = 'flex-row';

export function BasicRadioGroupForm({ form,
    rhf,
    onChange, field, type, disabled }: BasicRadioGroupFormType<any, any, any>) {


    const [direct] = useState(() => {
        if (type.direction == Direction.Column)
            return directionCol;
        return directionRow;
    })

    const getKey = (item: any) => {
        return type.selectOption!.value(item)?.toString()
    }

    const getValueString = (item: any) => {
        return getKey(item);
    }

    const getValue = (valueChange: any) => {
        if (valueChange) {
            const findItem = type.selectOption.data.find((item) => type.selectOption.valueString(item) == valueChange);
            if (findItem) {
                return type.selectOption.value(findItem);
            }
        }
        return undefined;
    }

    return (
        <RadioGroup
            disabled={disabled}
            onValueChange={(value) => {
                field.onChange(value);
                form.setValue(rhf.name, getValue(value), { shouldValidate: true })
                if (onChange) {
                    onChange(form, rhf.name, value)
                }
            }}
            defaultValue={field.value?.toString()}
            className={cn("flex", direct)}
        >{
                type.selectOption.data.map(item => (
                    <FormItem key={getValueString(item)} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                            <RadioGroupItem value={getValueString(item)} />
                        </FormControl>
                        <FormLabel className="font-normal">
                            {type.selectOption.display(item)}
                        </FormLabel>
                    </FormItem>
                ))
            }
        </RadioGroup>
    )
}
