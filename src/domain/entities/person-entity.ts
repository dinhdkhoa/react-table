import { Control, RHF, SelectOption } from "@/core/anotations/rhf";
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
    @RHF({
        label: "First Name",
        type: Control.Text,
    })
    firstName?: string;
    @RHF({
        label: "Last Name",
        type: Control.Text
    })
    lastName?: string;

    @RHF({
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

    @RHF({
        label: "Visits",
        type: Control.Number
    })
    visits?: number;

    @RHF({
        label: "Status",
        type: Control.Combobox,
        selectOption: statusSelectOption,
    })
    status?: string;

    @RHF({
        label: "Progress",
        type: Control.Number
    })
    progress?: number;

    @RHF({
        label: "Date",
        type: Control.Date,
        includeTime: true,
    })
    date?: Date;

    @RHF({
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

