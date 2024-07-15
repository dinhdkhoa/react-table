import { RHFOptions } from '@/core/anotations/rhf-field'
import { IBaseEntityForm, IBaseEntityFormBehavior } from '@/core/classes/base-entity-form'
import { BasicItem } from '@/core/classes/basic-item'
import { Control, Direction, SelectOption } from '@/core/types/control.types'
import { convertToSHA1 } from '@/core/utils/encryption'
import { FieldValue } from 'react-hook-form'

const emailTypeData: BasicItem<string>[] = [
  {
    value: 'gmail',
    text: 'xxx.Gmail.com'
  },
  {
    value: 'itlvn',
    text: 'xxx.itlvn.com'
  },
  {
    value: 'yahoo',
    text: 'xxx.yahoo.com'
  }
]

const ageData: BasicItem<number>[] = [
  {
    value: 10,
    text: '10 tuổi'
  },
  {
    value: 20,
    text: '20 tuổi'
  },
  {
    value: 30,
    text: '30 tuổi'
  },
  {
    value: 40,
    text: '40 tuổi'
  },
  {
    value: 50,
    text: '50 tuổi'
  }
]

const weightData: BasicItem<number>[] = [
  {
    value: 40,
    text: '40 Kg'
  },
  {
    value: 45,
    text: '45 Kg'
  },
  {
    value: 50,
    text: '50 Kg'
  },
  {
    value: 55,
    text: '55 Kg'
  },
  {
    value: 60,
    text: '60 Kg'
  }
]

const emailSelectOption: SelectOption<BasicItem<string>, string> = {
  data: emailTypeData,
  value: (data) => data.value ?? '',
  valueString: (data) => data.value ?? '',
  display: (data) => data.text ?? ''
}

const ageSelectOption: SelectOption<BasicItem<number | undefined>, number | undefined> = {
  data: ageData,
  value: (data) => data.value,
  valueString: (data) => (data.value ?? '').toString(),
  display: (data) => data.text ?? ''
}

const weightSelectOption: SelectOption<BasicItem<number | undefined>, number | undefined> = {
  data: weightData,
  value: (data) => data.value,
  valueString: (data) => (data.value ?? '').toString(),
  display: (data) => data.text ?? ''
}

export interface LoginEntityRefactor extends IBaseEntityForm<LoginEntityRefactor>, LoginEntityBehavior {
  username: string
  password: string
  age?: number
  dob?: Date
  male?: boolean
  emailType?: string
  weightRange?: number
  homeLess?: boolean
  yourProfile?: string
  multipleAgeRange?: number[]
  abc?: boolean
}

interface LoginEntityBehavior extends IBaseEntityFormBehavior<LoginEntityRefactor> {
  passwordEncode: (entity: LoginEntityRefactor) => string
}

export const fields: RHFOptions<LoginEntityRefactor>[] = [
  {
    fieldName: 'username',
    label: 'User name',
    type: Control.Text,
    validate: {
      required: (fieldValue, entity) => {
        if (!entity.password) return 'This field is required'
        return true
      }
    },
    disableFn: (form, entity) => {
      return false
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
    },
    disableFn: (form, entity) => {
      // console.log('disableFn', entity, form.getValues());
      return entity.abc || false
    }
  },
  {
    fieldName: 'age',
    label: 'Age',
    type: Control.Number,
    placeholder: 'Age',
    // visibleFn: (form: UseFormReturn, entity: LoginEntity) => {
    //   return !entity.abc;
    // },
    disableFn: (form, entity) => {
      // console.log('disableFn', entity, form.getValues());
      return entity.abc || false
    }
  },
  {
    fieldName: 'dob',
    label: 'Date of Birth',
    type: Control.Date,
    includeTime: true,
    // visibleFn: (form: UseFormReturn, entity: LoginEntity) => {
    //   return !entity.abc;
    // },
    disableFn: (form, entity) => {
      // console.log('disableFn', entity, form.getValues());
      return entity.abc || false
    }
  },
  {
    fieldName: 'male',
    label: 'Male',
    type: Control.Checkbox,
    // visibleFn: (form: UseFormReturn, entity: LoginEntity) => {
    //   return !entity.abc;
    // },
    disableFn: (form, entity) => {
      // console.log('disableFn', entity, form.getValues());
      return entity.abc || false
    }
  },
  {
    fieldName: 'emailType',
    label: 'Email Type',
    type: Control.StaticCombobox,
    selectOption: emailSelectOption,
    filterSelectOption: (value, entity: LoginEntityRefactor) => {
      if (entity.username == 'abc') return false
      return true
    },
    // visibleFn: (form: UseFormReturn, entity: LoginEntity) => {
    //   return !entity.abc;
    // },
    disableFn: (form, entity) => {
      // console.log('disableFn', entity, form.getValues());
      return entity.abc || false
    }
  },
  {
    fieldName: 'weightRange',
    label: 'Weight Range',
    type: Control.RadioGroup,
    selectOption: weightSelectOption,
    direction: Direction.Column,
    disableFn: (form, entity) => {
      // console.log('disableFn', entity, form.getValues());
      return entity.abc || false
    }
  },
  {
    fieldName: 'homeLess',
    index: 8,
    label: 'Homeless',
    type: Control.Switch,
    disableFn: (form, entity) => {
      // console.log('disableFn', entity, form.getValues());
      return entity.abc || false
    }
  },
  {
    fieldName: 'yourProfile',
    index: 8,
    label: 'Your Profile',
    type: Control.TextArea,
    disableFn: (form, entity) => {
      // console.log('disableFn', entity, form.getValues());
      return entity.abc || false
    }
  },
  {
    fieldName: 'multipleAgeRange',
    index: 4,
    label: 'Multiple Age Range',
    type: Control.MultipleSelect,
    selectOption: ageSelectOption,
    disableFn: (form, entity) => {
      // console.log('disableFn', entity, form.getValues());
      return entity.abc || false
    }
  }
]

export const loginEntity: LoginEntityRefactor = {
  __id__: '',
  __formfields__: fields,
  __keys__: [],
  __onChange__: (form, fieldname, value, formGetValues) => {
    console.log(fieldname, value, form.getValues(), formGetValues)
  },
  username: '',
  password: '',
  passwordEncode: function (entity: LoginEntityRefactor): string {
    return convertToSHA1(entity.password || '')
  }
}
