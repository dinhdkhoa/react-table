"use client"

import {
  useForm
} from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  BaseForm
} from "@/components/ui/form"
import {
  RHF_FIELDS
} from "@/core/anotations/hook-form"
import {
  BaseEntityForm
} from "@/core/classes/base-entity-form"
import { LoginEntity } from "@/domain/entities/login-entity"
import { useState } from "react"
import TextInput from "../register/_components/input"


const useBaseForm = <TEntity extends BaseEntityForm<TEntity>>(
  entity: TEntity
) => {
  const [state] = useState(entity)

  const rhf = Reflect.getMetadata(RHF_FIELDS, state)
  const form = useForm({
    defaultValues: state as any
  })
  return {
    rhf,
    form,
    entity : state
  }
}

export function LoginForm3() {
  const {...props} = useBaseForm(new LoginEntity("bound.hao@itlvn.com", "123"))

 

const onSubmit = () => {
  console.log()
}

  return (
    <BaseForm {...props}>
      <form onSubmit={onSubmit} className="space-y-2 w-full max-w-[400px]">
        <TextInput name="username" />
        <Button type="submit" className="!mt-8 w-full">
          Login
        </Button>
      </form>
    </BaseForm>
  )
}
