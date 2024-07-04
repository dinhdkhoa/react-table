import { DefaultValues, useForm } from 'react-hook-form'
import { useState } from 'react'
import { IBaseEntityForm } from '../classes/base-entity-form'
import { RHFOptions } from '../anotations/rhf-field'

function useBaseForm<TEntity extends IBaseEntityForm<TEntity>>(entity: TEntity, showLabel: boolean = true) {
  const [state] = useState(entity)
  const form = useForm({
    defaultValues: entity as DefaultValues<TEntity>
  })

  const [formFields] = useState<Record<string, RHFOptions<TEntity>>>(() => {
    const rhfs: Record<string, RHFOptions<TEntity>> = {}
    if (entity.__formfields__ && entity.__formfields__.length > 0) {
      entity.__formfields__.forEach((field) => {
        field.placeholder = field.placeholder || field.label
        rhfs[field.fieldName as string] = field
      })
    }
    return rhfs
  })

  return {
    rhf: formFields,
    form,
    showLabel,
    __onChange__: entity?.__onChange__,
    __onBlur__: entity?.__onBlur__
  }
}

export default useBaseForm
