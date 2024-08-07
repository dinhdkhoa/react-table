import { FieldValues } from 'react-hook-form'
import BaseTextInput from './base-text-input-form'
import BaseTextAreaInput from './base-text-area-input-form'
import BaseNumberInput from './base-number-input-form'
import BaseCheckboxInput from './base-checkbox-form'
import BaseSwitchInput from './base-switch-form'
import BaseMultipleSelectInput from './base-multiple-select-form'
import BaseRadioGroupInput from './base-radio-group-form'
import BaseDateTimeInput from './base-date-time-form'
import BaseComboboxInput from './base-combobox-form'
import { Control, ControlType } from '@/core/types/control.types'
import { useBaseFormContext } from '..'
import { SharedVariantProps } from './shared-variants'

type Props = {
  name: string
} & SharedVariantProps

const BaseDynamicControl = <TEntity extends FieldValues = FieldValues>(props: Props) => {
  const { rhf } = useBaseFormContext<TEntity>()
  const { type } = (rhf ?? {})[props.name] ?? {}
  const { showLabel } = props

  const createControl = () => {
    switch (type) {
      case Control.Text:
        return <BaseTextInput<TEntity> name={props.name as any} showLabel={showLabel} />
      case Control.TextArea:
        return <BaseTextAreaInput<TEntity> name={props.name as any} showLabel={showLabel} />
      case Control.Number:
        return <BaseNumberInput<TEntity> name={props.name as any} showLabel={showLabel} />
      case Control.Checkbox:
        return (
          <BaseCheckboxInput<TEntity> name={props.name as any} showLabel={showLabel} checkBoxVariants={'table-item'} />
        )
      case Control.Switch:
        return <BaseSwitchInput<TEntity> name={props.name as any} showLabel={showLabel} switchVariants={'table-item'} />
      case Control.StaticCombobox:
        return <BaseComboboxInput<TEntity> name={props.name as any} showLabel={showLabel} />
      case Control.MultipleSelect:
        return <BaseMultipleSelectInput<TEntity> name={props.name as any} showLabel={showLabel} />
      case Control.RadioGroup:
        return <BaseRadioGroupInput<TEntity> name={props.name as any} showLabel={showLabel} />
      case Control.Date:
        return <BaseDateTimeInput<TEntity> name={props.name as any} showLabel={showLabel} />
      default:
        return null
    }
  }
  return createControl()
}

export default BaseDynamicControl
