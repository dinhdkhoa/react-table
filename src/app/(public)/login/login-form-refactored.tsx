"use client"
import BaseForm from "@/components/base-form"
import BaseTextInput from "@/components/base-form/form-controls/base-text-input-form"
import { Button } from "@/components/ui/button"
import useBaseForm from "@/core/hooks/useBaseForm"
import { LoginEntity } from "@/domain/entities/login-entity-refactor"

let count = 0;

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
          <BaseTextInput<LoginEntity> name="password"/>
          {/* <BaseNumberInput<LoginEntity> name="age" />
          <BaseDateTimeInput<LoginEntity> name="dob"/>
          <BaseCheckboxInput<LoginEntity> name="male"/>
          <BaseComboboxInput<LoginEntity> name="emailType"/>
          <BaseRadioGroupInput<LoginEntity> name="weightRange"/>
          <BaseSwitchInput<LoginEntity> name="homeLess"/>
          <BaseTextAreaInput<LoginEntity> name="yourProfile"/>
          <BaseMultipleSelectInput<LoginEntity> name="multipleAgeRange"/> */}
          
          <Button type="submit" className="!mt-8 w-full">
            Login
          </Button>
        </form>
      </BaseForm>
    </>
  )
}
