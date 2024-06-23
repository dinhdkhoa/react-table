import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  UseFormReturn,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { ControlType, RHFOptions, TextControl } from "@/core/anotations/hook-form-refac"
import { BaseEntityForm } from "@/core/classes/base-entity-form"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName,
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const BaseFormFieldContext = React.createContext<BaseFormContextValue>(
  {} as BaseFormContextValue
)
type BaseFormContextValue = {
  rhf: any
  form: any
  entity: any
}

const createBaseFormContext = <TEntity extends FieldValues = FieldValues, TControlType extends ControlType  = ControlType>() => React.createContext<BaseFormPropsType<TEntity,TControlType> >(
  {} as BaseFormPropsType<TEntity,TControlType>
)

const BaseFormContext = createBaseFormContext()

type BaseFormPropsType<TEntity extends FieldValues = FieldValues, TControlType extends ControlType = ControlType> = {
  form: UseFormReturn<TEntity>
  rhf: Record<string, Record<string, RHFOptions<TEntity, TControlType>>>
  // rhf: RHFOptions<TEntity, TControlType>,
  entity: TEntity 
  children?: React.ReactNode
}

const BaseForm = <
  TEntity extends FieldValues = FieldValues,
  TControlType extends ControlType = ControlType,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: BaseFormPropsType<TEntity, TControlType> &
  Partial<ControllerProps<TFieldValues, TName>>) => {
  return (
    <BaseFormContext.Provider
      value={{
        form: props.form as any,
        rhf: props.rhf as any,
        entity: props.entity
      }}
    >
      <Form {...props.form}>{props.children}</Form>
    </BaseFormContext.Provider>
  )
}

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useBaseFormContext = <TControlType extends ControlType, TEntity extends FieldValues = FieldValues>() => {
  const baseFormContext = React.useContext<BaseFormPropsType<TEntity, TControlType>>(BaseFormContext as any)
  
  if (!baseFormContext) {
    throw new Error("useBaseFormContext should be used within <BaseForm>")
  }

  const { rhf, form, entity } = baseFormContext

  return { setAfterDataChanged: entity?.onChange ?? null, form, rhf, entity, onBlur: entity?.onBlur }
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }
  

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  useBaseFormContext,
  BaseForm,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
