import { RHFOptions } from '@/core/anotations/rhf-field'
import { IBaseEntityForm, IBaseEntityFormBehavior } from '@/core/classes/base-entity-form'
import { Control } from '@/core/types/control.types'
import { convertToSHA1 } from '@/core/utils/encryption'

export interface LoginEntity extends IBaseEntityForm<LoginEntity>, LoginEntityBehavior {
  username: string
  password: string
  age?: number | null
}

export interface LoginEntityBehavior extends IBaseEntityFormBehavior<LoginEntity> {
  passwordEncode: (entity: LoginEntity) => string
}

export const Loginfields: RHFOptions<LoginEntity>[] = [
  {
    fieldName: 'username',
    label: 'User name',
    type: Control.Text,
    validate: {
      required: (fieldValue, entity) => {
        if (!entity.password) return 'This field is required'
        return true
      }
    }
  },
  {
    type: Control.Text,
    fieldName: 'password',
    label: 'Password',
    validate: {
      required: (fieldValue, entity) => {
        if (!entity.password) return 'This field is required'
        return true
      }
    }
  },
  {
    fieldName: 'age',
    label: 'age',
    type: Control.Number,
    validate: {
      required: (fieldValue, entity) => {
        if ((entity.age ?? 0) < 10) return 'This field is required'
        return true
      }
    }
  },
]

export const defaultLoginEntity: LoginEntity = {
  __id__: '',
  __formfields__: Loginfields,
  __keys__: [],
  __onChange__: (form, fieldname, value, formGetValues) => {},
  username: '',
  password: '',
  passwordEncode: function (entity: LoginEntity): string {
    return convertToSHA1(entity.password || '')
  }
}
