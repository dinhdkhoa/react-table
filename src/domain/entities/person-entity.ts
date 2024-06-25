import { Control, RHFField, SelectOption } from "@/core/anotations/hook-form-refac";
import { BaseEntityForm } from "@/core/classes/base-entity-form";
import { BasicItem } from "@/core/classes/basic-item";

const statusData: BasicItem<string>[] = [
    {
        value: "gmail",
        text: "xxx.Gmail.com",
    },
    {
        value: "itlvn",
        text: "xxx.itlvn.com",
    },
    {
        value: "yahoo",
        text: "xxx.yahoo.com",
    }
]

const statusSelectOption: SelectOption<BasicItem<string>, string> = {
    data: statusData,
    value: (data) => data.value ?? '',
    valueString: (data) => (data.value ?? ''),
    display: (data) => data.text ?? '',
}

export class PersonEntity extends BaseEntityForm {
    // @Key
    id: string | undefined;
    @RHFField({
        label: "First Name",
        type: Control.Text,
    })
    firstName?: string;
    @RHFField({
        label: "Last Name",
        type: Control.Text
    })
    lastName?: string;

    @RHFField({
        label: "Age",
        type: Control.Number,
        validate: {
            required: (value, entity: PersonEntity) => {
                if (value > 10)
                    return true;
                return 'value must be larger than 10';
            }
        }
    })
    age?: number;

    @RHFField({
        label: "Visits",
        type: Control.Number
    })
    visits?: number;

    @RHFField({
        label: "Status",
        type: Control.Combobox,
        selectOption: statusSelectOption,
    })
    status?: string;

    @RHFField({
        label: "Progress",
        type: Control.Number
    })
    progress?: number;

    @RHFField({
        label: "Date",
        type: Control.Date,
        includeTime: true,
    })
    date?: Date;

    @RHFField({
        label: "Active",
        type: Control.Checkbox,
    })
    active?: boolean;

    constructor(id?: string,
        firstName?: string,
        lastName?: string,
        age?: number,
        visits?: number,
        status?: string,
        progress?: number,
        date?: Date,
        active?: boolean) {
        super();
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.visits = visits;
        this.status = status;
        this.progress = progress;
        this.date = date;
        this.active = active;
    }
}

