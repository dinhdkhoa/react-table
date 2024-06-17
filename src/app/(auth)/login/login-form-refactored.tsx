"use client"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { BaseForm } from "@/components/ui/form"
import { RHF_FIELDS } from "@/core/anotations/hook-form"
import { BaseEntityForm } from "@/core/classes/base-entity-form"
import { LoginEntity } from "@/domain/entities/login-entity"
import { createElement, useState } from "react"
import TextInput from "../register/_components/input"

const useBaseForm = <TEntity extends BaseEntityForm>(
  entity: TEntity
) => {
  const [state] = useState(entity)

  const rhf = Reflect.getMetadata(RHF_FIELDS, entity)
  const form = useForm({
    defaultValues: entity as any
  })
  return {
    rhf : rhf as TEntity,
    form,
    entity: entity
  }
}

export function LoginForm3() {
  const { ...props } = useBaseForm<LoginEntity>(
    new LoginEntity("bound.hao@itlvn.com", "123")
  )

  const onSubmit = () => {
    console.log()
  }

  return (
    <BaseForm {...props}>
      <form onSubmit={onSubmit} className="space-y-2 w-full max-w-[400px]">
        <TextInput name="" />
        <Button type="submit" className="!mt-8 w-full">
          Login
        </Button>
      </form>
    </BaseForm>
  )
}
