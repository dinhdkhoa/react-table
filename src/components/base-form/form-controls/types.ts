import { FieldPath, FieldValues } from "react-hook-form"

export type BaseFormFieldPropsType<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    name: TName
}