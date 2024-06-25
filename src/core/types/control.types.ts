export enum Direction {
    Column = 'Column',
    Row = 'Row',
}

export enum Control {
    Text = "Text",
    TextArea = "TextArea",
    Number = "Number",
    Checkbox = "Checkbox",
    Switch = 'Switch',
    Combobox = "Combobox",
    MultipleSelect = 'MultipleSelect',
    RadioGroup = 'RadioGroup',
    Date = "Date"
}

export type TextControl = {
    type: Control.Text,
    minLength?: number,
    maxLength?: number,
    minLine?: number,
}
export type TextAreaControl = {
    type: Control.TextArea,
    resize: boolean,
    minLength?: number,
    maxLength?: number,
}
export type NumberControl = {
    type: Control.Number,
    min?: number,
    max?: number,
}
export type SelectOption<TEntity, TValue> = {
    data: Array<TEntity>;
    value: (data: TEntity) => TValue;
    valueString: (data: TEntity) => string
    display: (data: TEntity) => string;
}
export type CheckboxControl = { type: Control.Checkbox, }
export type SwitchControl = { type: Control.Switch, };
export type ComboboxControl<TOption = unknown, TOptionValue = unknown> = {
    type: Control.Combobox,
    selectOption: SelectOption<TOption, TOptionValue>,
}
export type MultipleSelectControl<TOption = unknown, TOptionValue = unknown> = {
    type: Control.MultipleSelect,
    selectOption: SelectOption<TOption, TOptionValue>
}
export type RadioGroupControl<TOption = unknown, TOptionValue = unknown> = {
    type: Control.RadioGroup,
    direction: Direction,
    selectOption: SelectOption<TOption, TOptionValue>,
}
export type DateControl = {
    type: Control.Date,
    includeTime: boolean,
}
export type ControlType =
    | TextControl
    | TextAreaControl
    | NumberControl
    | ComboboxControl
    | DateControl
    | CheckboxControl
    | RadioGroupControl
    | SwitchControl
    | MultipleSelectControl