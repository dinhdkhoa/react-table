import { Control, ControlType } from "@/core/anotations/hook-form-refac"
import { useBaseFormContext } from "../ui/form"
import { FieldValues } from "react-hook-form"
import BaseTextInput from "./base-text-input-form"
import BaseTextAreaInput from "./base-text-area-input-form"
import BaseNumberInput from "./base-number-input-form"
import BaseCheckboxInput from "./base-checkbox-form"
import BaseSwitchInput from "./base-switch-form"
import BaseComboboxInput from "./basic-combobox-form"
import BaseMultipleSelectInput from "./base-multiple-select-form"
import BaseRadioGroupInput from "./base-radio-group-form"
import BaseDateTimeInput from "./base-date-time-form"

type Props = {
    name: string
}

const BaseDynamicControl = <TEntity extends FieldValues = FieldValues,>(props: Props) => {
    const { rhf } = useBaseFormContext<ControlType, TEntity>()
    const { type } = rhf[props.name];

    const createControl = () => {
        switch (type) {
            case Control.Text:
                return <BaseTextInput<TEntity> name={props.name as any} />
            case Control.TextArea:
                return <BaseTextAreaInput<TEntity> name={props.name as any} />
            case Control.Number:
                return <BaseNumberInput<TEntity> name={props.name as any} />
            case Control.Checkbox:
                return <BaseCheckboxInput<TEntity> name={props.name as any} />
            case Control.Switch:
                return <BaseSwitchInput<TEntity> name={props.name as any} />
            case Control.Combobox:
                return <BaseComboboxInput<TEntity> name={props.name as any} />
            case Control.MultipleSelect:
                return <BaseMultipleSelectInput<TEntity> name={props.name as any} />
            case Control.RadioGroup:
                return <BaseRadioGroupInput<TEntity> name={props.name as any} />
            case Control.Date:
                return <BaseDateTimeInput<TEntity> name={props.name as any} />
            default:
                return <>Control Is Not Found</>
        }
    }
    return createControl();
}

export default BaseDynamicControl;