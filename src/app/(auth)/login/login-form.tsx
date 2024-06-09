"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FieldValues, UseFormReturn, useForm } from "react-hook-form"

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
import { RHFOptions, RHF_FIELDS, ZOD_VALIDATIONS } from "@/core/anotations/hook-form"
import { z } from "zod"

export function useEntityForm<TEntity>(entity: TEntity) {
  const rhfFields = Reflect.getMetadata(RHF_FIELDS, entity as any);
  const zodValidations = Reflect.getMetadata(ZOD_VALIDATIONS, entity as any);

  const schema = z.object(zodValidations);

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

export function generateFormControls(form: UseFormReturn, register: any, errors: any, rhfFields: any) {
  const fieldsArray = Object.keys(rhfFields).map((fieldName) => ({
    name: fieldName,
    options: rhfFields[fieldName] as RHFOptions
  }));

  // Sort fields by index
  fieldsArray.sort((a, b) => (a.options.index ?? 0) - (b.options.index ?? 0));

  return fieldsArray.map((f) => (

    <FormField
      key={f.name}
      control={form.control}
      name={f.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{f.options.label}</FormLabel>
          <FormControl>
            <Input placeholder={f.options.placeHolder} {...field} />
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full max-w-[400px]">
        {generateFormControls(form, register, errors, rhfFields)}
        <Button type="submit" className="!mt-8 w-full" disabled={form.formState.isLoading}>
          Login
        </Button>
      </form>
    </Form>
  );
}
