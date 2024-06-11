"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerRenderProps, FieldValues, UseFormReturn, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { LoginEntity } from "@/domain/entities/login-entity"
import { ComboboxControl, Control, TextControl, NumberControl, RHFOptions, RHF_FIELDS, ZOD_VALIDATIONS, DateControl } from "@/core/anotations/hook-form"
import { z } from "zod"
import { onChangeFun, onBlurFun, BaseEntityForm } from "@/core/classes/base-entity-form"
import { BasicComboboxForm } from "../../../components/form-controls/basic-combobox-form"
import { BasicCheckboxForm } from "@/components/form-controls/base-checkbox-form"
import { useState } from "react"
import { BasicTextInputForm } from "@/components/form-controls/base-text-input-form"
import { BasicNumberInputForm } from "@/components/form-controls/base-number-input-form"
import { BasicDateTimeInputForm } from "@/components/form-controls/base-date-time-form"

export type ReactHookField<TOption = unknown, TOptionValue = unknown> = {
  name: string,
  options: RHFOptions<TOption, TOptionValue>
}

export function useEntityForm<TEntity extends BaseEntityForm<TEntity>>(entity: TEntity) {
  const rhfFields = Reflect.getMetadata(RHF_FIELDS, entity);
  const zodValidations = Reflect.getMetadata(ZOD_VALIDATIONS, entity);
  const schema = z.object(zodValidations).superRefine((val, ctx) => { entity.onSuperRefine(val as TEntity, ctx); })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: entity as any
  });

  return {
    form,
    register: form.register,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    rhfFields
  };
};

export function generateFormControls(
  form: UseFormReturn,
  register: any,
  errors: any,
  rhfFields: any,
  onChange?: onChangeFun,
  onBlur?: onBlurFun
) {
  const fieldsArray = Object.keys(rhfFields).map((fieldName) => ({
    name: fieldName,
    options: rhfFields[fieldName]['options'] as RHFOptions<any, any>
  }));

  // Sort fields by index
  fieldsArray.sort((a, b) => (a.options.index ?? 0) - (b.options.index ?? 0));

  const getControl = (rhf: ReactHookField, field: ControllerRenderProps<FieldValues, string>) => {

    switch (rhf.options.type.type) {
      case Control.Text:
        return BasicTextInputForm({ form, rhf, field, onChange, onBlur, type: (rhf.options.type as TextControl) })
      case Control.Number:
        return BasicNumberInputForm({ form, rhf, field, onChange, onBlur, type: (rhf.options.type as NumberControl) })
      case Control.Combobox:
        return BasicComboboxForm({ form, rhf, field, onChange, type: (rhf.options.type as ComboboxControl<any, any>) });
      case Control.Checkbox:
        return BasicCheckboxForm({ form, rhf, field, onChange });
      case Control.Date:
        return BasicDateTimeInputForm({ form, rhf, field, onChange, type: (rhf.options.type as DateControl) });
      default:
        break;
    }
  }

  return fieldsArray.map((rhf) => (
    <FormField
      key={rhf.name}
      control={form.control}
      name={rhf.name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{rhf.options.label}</FormLabel>
          <FormControl>
            {
              getControl(rhf, field)
            }
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ));
};


export function LoginForm() {
  const [loginE] = useState<LoginEntity>(new LoginEntity('bound.hao@itlvn.com', '123'))

  const { form, register, handleSubmit, errors, rhfFields } = useEntityForm(loginE);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <div>{JSON.stringify(form.watch())}</div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full max-w-[400px]">
        {generateFormControls(form, register, errors, rhfFields, loginE.onChange, loginE.onBlur)}
        <Button type="submit" className="!mt-8 w-full" disabled={form.formState.isLoading}>
          Login
        </Button>
      </form>
    </Form>
  );
}