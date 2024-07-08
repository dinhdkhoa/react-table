import * as React from 'react'
import { ControllerProps, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

import { Form } from '../ui/form'
import { RHFOptions } from '@/core/anotations/rhf-field'
import { IBaseEntityFormBehavior } from '@/core/classes/base-entity-form'
import BaseCheckbox from './form-controls/base-checkbox-form'
import BaseTextInput from './form-controls/base-text-input-form'
import BaseTextArea from './form-controls/base-text-area-input-form'
import BaseSwitch from './form-controls/base-switch-form'
import BaseRadioGroup from './form-controls/base-radio-group-form'
import BaseNumberInput from './form-controls/base-number-input-form'
import BaseMultipleSelect from './form-controls/base-multiple-select-form'
import BaseDateTimeInput from './form-controls/base-date-time-form'
import BaseCombobox from './form-controls/base-combobox-form'

type BaseFormPropsType<TEntity extends FieldValues = FieldValues> = {
  form: UseFormReturn<TEntity>
  rhf: Record<string, RHFOptions<TEntity>>
  children?: React.ReactNode
} & IBaseEntityFormBehavior<TEntity>

const createBaseFormContext = <TEntity extends FieldValues = FieldValues>() =>
  React.createContext<BaseFormPropsType<TEntity>>({} as BaseFormPropsType<TEntity>)

const BaseFormContext = createBaseFormContext()

const useBaseFormContext = <TEntity extends FieldValues = FieldValues>() => {
  const baseFormContext = React.useContext<BaseFormPropsType<TEntity>>(BaseFormContext as any)

  if (!baseFormContext) {
    throw new Error('useBaseFormContext should be used within <BaseForm>')
  }

  const { rhf, form, __onChange__, __onBlur__ } = baseFormContext

  return {
    setAfterDataChanged: __onChange__,
    form,
    rhf,
    onBlur: __onBlur__
  }
}

const BaseForm = <TEntity extends FieldValues = FieldValues>({ ...props }: BaseFormPropsType<TEntity>) => {
  return (
    <BaseFormContext.Provider
      value={{
        form: props.form as any,
        rhf: props.rhf as any,
        __onChange__: props.__onChange__ as any,
        __onBlur__: props.__onChange__ as any
      }}
    >
      <Form {...props.form}>
        <fieldset className='group' disabled={false}>
          {props.children}
        </fieldset>
      </Form>
    </BaseFormContext.Provider>
  )
}

const withEntity = <TEntity extends FieldValues,>(Component: React.ComponentType<{ form: UseFormReturn<TEntity> }>) => {
  return (props: { form: UseFormReturn<TEntity> }) => <Component {...props} />;
};

BaseForm.Checkbox =  BaseCheckbox
BaseForm.TextInput = BaseTextInput
BaseForm.TextArea = BaseTextArea
BaseForm.Switch = BaseSwitch
BaseForm.RadioGroup = BaseRadioGroup
BaseForm.NumberInput = BaseNumberInput
BaseForm.MultipleSelect = BaseMultipleSelect
BaseForm.DateTime = BaseDateTimeInput
BaseForm.Combobox = BaseCombobox

export { useBaseFormContext }
export default BaseForm
