import { RHF } from "@/core/anotations/rhf-field";
import { BaseEntityForm } from "@/core/classes/base-entity-form";
import { BasicItem } from "@/core/classes/basic-item";
import { Control, SelectOption } from "@/core/types/control.types";
import { convertToSHA1 } from "@/core/utils/encryption";
import { UseFormReturn } from "react-hook-form";


export class LoginEntity extends BaseEntityForm {
    @RHF({
        label: "User name",
        type: Control.Text,
        validate: {
            required: (form: UseFormReturn, entity: LoginEntity) => {
                if (!entity.username)
                    return 'This field is required';
                return true;
            }
        }
    })
    username?: string;

    @RHF({
        label: "Password",
        type: Control.Text,
        validate: {
            required: (form: UseFormReturn, entity: LoginEntity) => {
                if (!entity.password)
                    return 'This field is required';
                return true;
            }
        }
    })
    password?: string;

    constructor(username?: string) {
        super();
        this.username = username;
    }

    get passwordEncode() {
        return convertToSHA1(this.password || '')
    }

    onChange = (form: UseFormReturn, fieldName: string | undefined, value: any) => {
        // console.log('onChange', this.username, form.getValues(), this);
        console.log('onChange', fieldName, form.getValues(), this);
    }
}