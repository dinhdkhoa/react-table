"use client"

let count = 0;
import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerRenderProps, FieldValues, UseFormReturn, useForm } from "react-hook-form"
import { DevTool } from '@hookform/devtools'
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
import { ComboboxControl, Control, TextControl, NumberControl, RHFOptions, RHF_FIELDS, ZOD_VALIDATIONS, DateControl, TextAreaControl, RadioGroupControl } from "@/core/anotations/hook-form"
import { z } from "zod"
import { onChangeFun, onBlurFun, BaseEntityForm } from "@/core/classes/base-entity-form"
import { BasicComboboxForm } from "../../../components/form-controls/base-combobox-form"
import { BasicCheckboxForm } from "@/components/form-controls/base-checkbox-form"
import { useEffect, useState } from "react"
import { BasicTextInputForm } from "@/components/form-controls/base-text-input-form"
import { BasicNumberInputForm } from "@/components/form-controls/base-number-input-form"
import { BasicDateTimeInputForm } from "@/components/form-controls/base-date-time-form"
import { Getters } from "@/core/helper/helper"
import { BasicTextAreaInputForm } from "@/components/form-controls/base-text-area-input-form"
import { BasicRadioGroupForm } from "@/components/form-controls/base-radio-group-form"
import { BasicSwitchForm } from "@/components/form-controls/base-switch-form";

export type ReactHookField<TEntity, TOption = unknown, TOptionValue = unknown> = {
  name: string,
  options: RHFOptions<TEntity, TOption, TOptionValue>
}

export function useEntityForm<TEntity extends BaseEntityForm<TEntity>>(entity: TEntity) {
  const rhfFields = Reflect.getMetadata(RHF_FIELDS, entity);
  const zodValidations = Reflect.getMetadata(ZOD_VALIDATIONS, entity);
  const schema = z.object(zodValidations).superRefine((val, ctx) => { entity.onSuperRefine(val as TEntity, ctx); })

  const form = useForm({
    // resolver: zodResolver(schema),
    defaultValues: entity as any
  });

  const { register, handleSubmit, formState: { errors } } = form;
  return {
    form,
    register,
    handleSubmit,
    errors,
    rhfFields
  };
};

export function generateFormControls<TEntity>(
  entity: TEntity,
  form: UseFormReturn,
  register: any,
  errors: any,
  rhfFields: any,
  onChange?: onChangeFun,
  onBlur?: onBlurFun
) {
  const fieldsArray = Object.keys(rhfFields).map((fieldName) => ({
    name: fieldName,
    options: rhfFields[fieldName]['options'] as RHFOptions<any, any, any>
  }));

  // Sort fields by index
  fieldsArray.sort((a, b) => (a.options.index ?? 0) - (b.options.index ?? 0));

  return fieldsArray.map((rhf) => (
    CreateControl(form, entity, rhf, onChange, onBlur)
  ));
};

type FormFieldType<T> = Getters<Omit<T, keyof BaseEntityForm<T>>, JSX.Element>
export function useBaseForm<TEntity>(
  entity: TEntity,
  form: UseFormReturn,
  register: any,
  errors: any,
  rhfFields: any,
  onChange?: onChangeFun,
  onBlur?: onBlurFun
) {
  const fieldsArray = Object.keys(rhfFields).map((fieldName) => ({
    name: fieldName,
    options: rhfFields[fieldName]["options"] as RHFOptions<any, any, any>
  }))

  // Sort fields by index
  fieldsArray.sort((a, b) => (a.options.index ?? 0) - (b.options.index ?? 0))

  const field: any = {}

  fieldsArray.forEach((rhf) => {
    field[rhf.name] = CreateControl(form, entity, rhf, onChange, onBlur) || null
  })

  return field as FormFieldType<TEntity>
}

export function CreateControl<TEntity>(form: UseFormReturn, entity: TEntity, rhf: ReactHookField<TEntity>, onChange?: onChangeFun,
  onBlur?: onBlurFun) {
  const [visibled, setVisibled] = useState<boolean>(() => {
    if (rhf.options.visibleFn) {
      return rhf.options.visibleFn(form, entity);
    }
    return true;
  });
  const [disabled, setDisabled] = useState<boolean>(() => {
    if (rhf.options.disableFn) {
      return rhf.options.disableFn(form, entity);
    }
    return false;
  });


  useEffect(() => {
    let sub = form.watch(() => {
      if (rhf.options.visibleFn) {
        setVisibled(rhf.options.visibleFn(form, entity));
      }
      if (rhf.options.disableFn) {
        setDisabled(rhf.options.disableFn(form, entity));
      }
    })

    return () => {
      sub.unsubscribe();
    }
  }, [])


  useEffect(() => {
    form.register(rhf.name, {
      // disabled: (rhf.options.disableFn ? rhf.options.disableFn(form, entity) : false) || !(rhf.options.visibleFn ? rhf.options.visibleFn(form, entity) : true),
      validate: !((rhf.options.disableFn ? rhf.options.disableFn(form, entity) : false) || !(rhf.options.visibleFn ? rhf.options.visibleFn(form, entity) : true)) ? rhf.options.validate : undefined,
    })
    if (disabled) {
      form.clearErrors(rhf.name)
    }
  }, [disabled, visibled])

  const getControl = (rhf: ReactHookField<TEntity>, field: ControllerRenderProps<FieldValues, string>) => {
    switch (rhf.options.type.type) {
      case Control.Text:
        return BasicTextInputForm({ entity, form, rhf, field, onChange, onBlur, type: (rhf.options.type as TextControl), disabled })
      case Control.TextArea:
        return BasicTextAreaInputForm({ entity, form, rhf, field, onChange, onBlur, type: (rhf.options.type as TextAreaControl), disabled })
      case Control.Number:
        return BasicNumberInputForm({ entity, form, rhf, field, onChange, onBlur, type: (rhf.options.type as NumberControl), disabled })
      case Control.Combobox:
        return BasicComboboxForm({ entity, form, rhf, field, onChange, type: (rhf.options.type as ComboboxControl<any, any>), disabled });
      case Control.RadioGroup:
        return BasicRadioGroupForm({ entity, form, rhf, field, onChange, type: (rhf.options.type as RadioGroupControl<any, any>), disabled });
      case Control.Checkbox:
        return BasicCheckboxForm({ entity, form, rhf, field, onChange, disabled });
      case Control.Switch:
        return BasicSwitchForm({ entity, form, rhf, field, onChange, disabled });
      case Control.Date:
        return BasicDateTimeInputForm({ entity, form, rhf, field, onChange, type: (rhf.options.type as DateControl), disabled });
      default:
        break;
    }
  }

  return (visibled &&
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
    />)
}


export function LoginForm() {
  const [loginE] = useState<LoginEntity>(new LoginEntity('bound.hao@itlvn.com', '123'))
  const { form, register, handleSubmit, errors, rhfFields } = useEntityForm(loginE);
  const field = useBaseForm<LoginEntity>(
    loginE,
    form,
    register,
    errors,
    rhfFields,
    loginE.onChange,
    loginE.onBlur
  )
  const onSubmit = (data: any) => {
    console.log(data);
  };
  count++;
  return (
    <>
      <Form {...form}>
        {/* <div>{JSON.stringify(form.watch())}</div>
        <div>{JSON.stringify(loginE)}</div> */}
        {/* {count} */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2 w-full max-w-[400px]"
        >
          <div className="w-25">{field.username}</div>

          {field.age}
          {field.ageRange}
          {field.dob}
          {field.yourName}
          {field.emailType}
          {field.sex}
          {field.password}
          {field.profile}
          {field.weightRange}
          {field.homeLess}
          <Button type="submit" className="!mt-8 w-full">
            Login
          </Button>
        </form>
        <Button
          className="!mt-8 w-full"
          onClick={(_) => {
            form.reset()
          }}
        >
          Reset
        </Button>
      </Form>
      {/* <DevTool control={form.control}/> */}
    </>
  )
}