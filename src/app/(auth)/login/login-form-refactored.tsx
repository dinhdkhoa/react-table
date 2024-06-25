"use client"
import { DefaultValues, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { BaseForm } from "@/components/ui/form"
// import { RHF_FIELDS } from "@/core/anotations/hook-form"
import { BaseEntityForm } from "@/core/classes/base-entity-form"
import { LoginEntity } from "@/domain/entities/login-entity-refactor"
import { createElement, useState } from "react"
import BaseTextInput from "@/components/form-controls/base-text-input-form"
import BaseDateTimeInput from "@/components/form-controls/base-date-time-form"
import BaseCheckboxInput from "@/components/form-controls/base-checkbox-form"
import BaseComboboxInput from "@/components/form-controls/base-combobox-form"
import BaseRadioGroupInput from "@/components/form-controls/base-radio-group-form"
import { RHF_FIELDS } from "@/core/anotations/hook-form-refac"
import BaseSwitchInput from "@/components/form-controls/base-switch-form"
import BaseTextAreaInput from "@/components/form-controls/base-text-area-input-form"
import BaseMultipleSelectInput from "@/components/form-controls/base-multiple-select-form"
import BaseNumberInput from "@/components/form-controls/base-number-input-form"
// import TextInput from "../register/_components/input"

let count = 0;

function useBaseForm<TEntity>(
  entity: TEntity & Object
) {
  const [state] = useState(entity)

  const rhf = Reflect.getMetadata(RHF_FIELDS, entity)
  const form = useForm({
    defaultValues: entity as DefaultValues<TEntity>
  })
  return {
    rhf: rhf,
    form,
    entity: state
  }
}

export function LoginForm3() {
  const { ...props } = useBaseForm<LoginEntity>(
    new LoginEntity("bound.hao@itlvn.com")
  )

  const onSubmit = () => {
    console.log()
  }
  count++;
  return (
    <>
      <BaseForm {...props}>
        <form onSubmit={onSubmit} className="space-y-2 w-full max-w-[400px]">
          <BaseTextInput<LoginEntity> name="username" />
          <BaseTextInput<LoginEntity> name="password" />
          <BaseNumberInput<LoginEntity> name="age" />
          <BaseDateTimeInput<LoginEntity> name="dob"/>
          <BaseCheckboxInput<LoginEntity> name="male"/>
          <BaseComboboxInput<LoginEntity> name="emailType"/>
          <BaseRadioGroupInput<LoginEntity> name="weightRange"/>
          <BaseSwitchInput<LoginEntity> name="homeLess"/>
          <BaseTextAreaInput<LoginEntity> name="yourProfile"/>
          <BaseMultipleSelectInput<LoginEntity> name="multipleAgeRange"/>
          
          <Button type="submit" className="!mt-8 w-full">
            Login
          </Button>
        </form>
      </BaseForm>
    </>
  )
}
