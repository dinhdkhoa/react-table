import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useBaseFormContext
} from "@/components/ui/form"
import { Direction, RadioGroupControl } from "@/core/anotations/hook-form-refac"
import { useEffect, useState } from "react"
import { ControllerFieldState, ControllerRenderProps, FieldValues, Path, UseFormStateReturn } from "react-hook-form"
import { FieldInputPropsType } from "./types"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { cn } from "@/lib/utils"

const directionCol = 'flex-col space-y-1';
const directionRow = 'flex-row';

const BaseRadioGroupInput = <TEntity extends FieldValues = FieldValues>({
    name
}: FieldInputPropsType<TEntity>) => {
    const { form, rhf, entity } = useBaseFormContext<RadioGroupControl, TEntity>()
    const { visibleFn } = rhf[name];

    const [visibled, setVisibled] = useState<boolean>(() => {
        if (visibleFn) {
            return visibleFn(form, entity);
        }
        return true;
    });

    useEffect(() => {
        if (visibleFn) {
            setVisibled(visibleFn(form, entity));
        }
    }, [form.watch()]);

    return (visibled &&
        <FormField
            control={form.control}
            name={name}
            render={(params) => <BaseRadioGroupItem visibled={visibled} {...params} />}
        />
    )
}

const BaseRadioGroupItem = <TEntity extends FieldValues = FieldValues,>({ field, fieldState, formState, visibled = true }: { field: ControllerRenderProps<TEntity, Path<TEntity>>, fieldState: ControllerFieldState, formState: UseFormStateReturn<TEntity>, visibled?: boolean }) => {
    const { rhf, setAfterDataChanged, form, entity } = useBaseFormContext<RadioGroupControl>()
    const { label, disableFn, validate, direction, selectOption } = rhf[field.name];
    const [directionItem] = useState(() => {
        if (direction == Direction.Column)
            return directionCol;
        return directionRow;
    })

    const [disabled, setDisabled] = useState<boolean>(() => {
        if (disableFn) {
            return disableFn(form, entity);
        }
        return false;
    });

    const handleChange = (e: string) => {
        form.setValue(field.name, getValue(e) as any);
        if (setAfterDataChanged)
            setAfterDataChanged(form, field.name, e)
    }

    const getKey = (item: any) => {
        return selectOption!.value(item)?.toString() || '';
    }

    const getValueString = (item: any) => {
        return getKey(item);
    }

    const getValue = (valueChange: any) => {
        if (valueChange) {
            const findItem = selectOption.data.find((item) => selectOption.valueString(item) == valueChange);
            if (findItem) {
                return selectOption.value(findItem);
            }
        }
        return undefined;
    }

    useEffect(() => {
        if (disableFn) {
            setDisabled(disableFn(form, entity));
        }
    }, [form.watch()]);

    useEffect(() => {
        form.register(field.name, {
            validate: !((disableFn ? disableFn(form, entity) : false) || !visibled) ? validate : undefined
        })
        if (disabled) {
            form.clearErrors(field.name)
        }
    }, [disableFn, disabled, entity, field.name, form, validate, visibled]);

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <RadioGroup
                    disabled={disabled}
                    onValueChange={handleChange}
                    defaultValue={form.getValues(field.name)?.toString()}
                    className={cn("flex", directionItem)}
                >{
                        selectOption.data.map(item => (
                            <FormItem key={getValueString(item)} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={getValueString(item)} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    {selectOption.display(item)}
                                </FormLabel>
                            </FormItem>
                        ))
                    }
                </RadioGroup>
            </FormControl>
            <FormMessage />
        </FormItem>
    )
}

export default BaseRadioGroupInput
