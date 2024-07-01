"use client"
import BaseForm from "@/components/base-form"
import BaseTextInput from "@/components/base-form/form-controls/base-text-input-form"
import { Button } from "@/components/ui/button"
import useBaseForm from "@/core/hooks/useBaseForm"
// import { LoginEntity } from "@/domain/entities/login-entity"
import { loginAction } from "./_action/login-actions"
import { toast } from "sonner"
import { LoginEntity, fields, loginEntity } from "@/domain/entities/login-entity-refactor"
import BaseCheckboxInput from "@/components/base-form/form-controls/base-checkbox-form"
import BaseComboboxInput from "@/components/base-form/form-controls/base-combobox-form"
import BaseDateTimeInput from "@/components/base-form/form-controls/base-date-time-form"
import BaseMultipleSelectInput from "@/components/base-form/form-controls/base-multiple-select-form"
import BaseNumberInput from "@/components/base-form/form-controls/base-number-input-form"
import BaseRadioGroupInput from "@/components/base-form/form-controls/base-radio-group-form"
import BaseSwitchInput from "@/components/base-form/form-controls/base-switch-form"
import BaseTextAreaInput from "@/components/base-form/form-controls/base-text-area-input-form"
import { useState } from "react"
import { convertToSHA1 } from "@/core/utils/encryption"

let count = 0;

export function LoginForm3() {
  const [loginEntity2, setLoginEntity] = useState<LoginEntity>(() => {
    const entity: LoginEntity = {
      username: "",
      password: "",
      passwordEncode: function (entity: LoginEntity): string {
        return convertToSHA1(entity.password || '');
      },
      __formfields__: fields,
      __id__: "123",
      __keys__: [],
      __onChange__: (form, fieldname, value, formGetValues) => {
        form.setValue('abc', formGetValues.username == 'abc');
        console.log(fieldname, value, form.getValues(), formGetValues);
      },
    }
    return entity;
  })
  const { ...props } = useBaseForm<LoginEntity>(loginEntity2)

  const onSubmit = props.form.handleSubmit(async (data) => {
    loginAction({ username: data.username || '', password: data.passwordEncode(data) }).then(handleState => {
      if (!handleState.isError) {
        toast.success(`Login successful ${handleState.value?.token}`)
      }
      else {
        toast.error('Login failed')
      }
    });
  });

  return (
    <>
      <BaseForm<LoginEntity> {...props}>
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
