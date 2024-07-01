import { RHF, RHFOptions } from "@/core/anotations/rhf-field";
import { BaseEntityForm, IBaseEntityForm, onChangeFun } from "@/core/classes/base-entity-form";
import { BasicItem } from "@/core/classes/basic-item";
import { Control, SelectOption, StaticComboboxControl } from "@/core/types/control.types";
import { UseFormReturn } from "react-hook-form";

const statusData: BasicItem<string>[] = [
    {
        value: "InRelationship",
        text: "In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship",
    },
    {
        value: "Single",
        text: "Single",
    },
    {
        value: "Complicated",
        text: "Complicated",
    }
]

export const statusSelectOption: SelectOption<BasicItem<string>, string> = {
    data: statusData,
    value: (data) => data.value ?? '',
    valueString: (data) => (data.value ?? ''),
    display: (data) => data.text ?? '',
}

export const PersonEntityFields: RHFOptions<PersonEntity>[] = [
    {
        fieldName: "firstName",
        label: "First Name",
        type: Control.Text,
    },
    {
        fieldName: "lastName",
        label: "Last Name",
        type: Control.Text
    },
    {
        fieldName: "age",
        label: "Age",
        type: Control.Number,
        validate: {
            required: (value, entity) => {
                if (value > 10)
                    return true;
                return 'value must be larger than 10';
            }
        },
    },
    {
        fieldName: "visits",
        label: "Visits",
        type: Control.Number,
        disableFn: (form: UseFormReturn<PersonEntity>, entity: PersonEntity) => {
            return entity.visits == 50;
        }
    },
    {
        fieldName: "status",
        label: "Status",
        type: Control.StaticCombobox,
        selectOption: statusSelectOption,
        filterSelectOption: (item: BasicItem<string>, entity: PersonEntity) => {
            if (entity.firstName == 'tandy' || entity.firstName == 'hao') return false;
            return true;
        }
    },
    {
        fieldName: "progress",
        label: "Progress",
        type: Control.Number
    },
    {
        fieldName: "date",
        label: "Date",
        type: Control.Date,
        includeTime: true,
    },
    {
        fieldName: 'active',
        label: "Active",
        type: Control.Checkbox,
    }
]

export interface PersonEntity extends IBaseEntityForm<PersonEntity> {
    firstName?: string;
    lastName?: string;
    age?: number;
    visits?: number;
    status?: string;
    progress?: number;
    date?: Date;
    active?: boolean;
}

export const PersonEntityOnChange: onChangeFun<PersonEntity> = (form, fieldName, value, formGetValues) => {
    console.log('PersonEntityOnChange', formGetValues);
}

// export class PersonEntity2 extends BaseEntityForm {
//     // @Key
//     id: string | undefined;
//     @RHF({
//         label: "First Name",
//         type: Control.Text,
//     })
//     firstName?: string;
//     @RHF({
//         label: "Last Name",
//         type: Control.Text
//     })
//     lastName?: string;

//     @RHF({
//         label: "Age",
//         type: Control.Number,
//         validate: {
//             required: (value, entity: PersonEntity) => {
//                 if (value > 10)
//                     return true;
//                 return 'value must be larger than 10';
//             }
//         }
//     })
//     age?: number;

//     @RHF({
//         label: "Visits",
//         type: Control.Number,
//         disableFn: (form: UseFormReturn<PersonEntity>, entity: PersonEntity) => {
//             return entity.visits == 50;
//         }
//     })
//     visits?: number;

//     @RHF({
//         label: "Status",
//         type: Control.StaticCombobox,
//         selectOption: statusSelectOption,
//         filterSelectOption: (item: BasicItem<string>, entity: PersonEntity) => {
//             if (entity.firstName == 'tandy' || entity.firstName == 'hao') return false;
//             return true;
//         }
//     })
//     status?: string;

//     @RHF({
//         label: "Progress",
//         type: Control.Number
//     })
//     progress?: number;

//     @RHF({
//         label: "Date",
//         type: Control.Date,
//         includeTime: true,
//     })
//     date?: Date;

//     @RHF({
//         label: "Active",
//         type: Control.Checkbox,
//     })
//     active?: boolean;

//     constructor(id?: string,
//         firstName?: string,
//         lastName?: string,
//         age?: number,
//         visits?: number,
//         status?: string,
//         progress?: number,
//         date?: Date,
//         active?: boolean) {
//         super();
//         this.id = id;
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.age = age;
//         this.visits = visits;
//         this.status = status;
//         this.progress = progress;
//         this.date = date;
//         this.active = active;
//     }

//     onChange: onChangeFun = (form: UseFormReturn, fieldName: string | undefined, value: any) => {
//         console.log('fieldName', fieldName)
//         console.log('value', value)
//         console.log('form', form.getValues())
//         console.log('entity', this)
//     }
// }

