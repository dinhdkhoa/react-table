"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { UseFormReturn, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginEntity } from "@/domain/entities/login-entity"
import { Control, RHFOptions, RHF_FIELDS, ZOD_VALIDATIONS } from "@/core/anotations/hook-form"
import { z } from "zod"
import { onChangeFun, onBlurFun, BaseEntityForm } from "@/core/classes/base-entity-form"
import { BasicComboboxForm } from "../../../components/form-controls/basic-combobox-form"

export function useEntityForm<TEntity extends BaseEntityForm<TEntity>>(entity: TEntity) {
  const rhfFields = Reflect.getMetadata(RHF_FIELDS, entity);
  const zodValidations = Reflect.getMetadata(ZOD_VALIDATIONS, entity);
  const schema = z.object(zodValidations).superRefine((val, ctx) => {entity.onSuperRefine(val as TEntity, ctx);})

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
    options: rhfFields[fieldName] as RHFOptions
  }));

  // Sort fields by index
  fieldsArray.sort((a, b) => (a.options.index ?? 0) - (b.options.index ?? 0));

  return fieldsArray.map((rhf) => (
    <FormField
      key={rhf.name}
      control={form.control}
      name={rhf.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{rhf.options.label}</FormLabel>
          <FormControl>
            {
              rhf.options.type === Control.Text ? <Input placeholder={rhf.options.placeHolder} {...field}
                onChangeCapture={(e) => {
                  if (onChange) {
                    onChange(form, rhf.name, e.currentTarget.value)
                  }
                }}
                onBlurCapture={(e) => {
                  if (onBlur) {
                    onBlur(form, rhf.name, e.currentTarget.value)
                  }
                }}
              /> :

                BasicComboboxForm( {form, rhf, onChange})


            }
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ));
};


export function LoginForm() {
  const loginE = new LoginEntity('bound.hao@itlvn.com', '123');

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