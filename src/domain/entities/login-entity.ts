import { Control, RHFField, SelectOption, ZodValidation } from "@/core/anotations/hook-form";
import { BaseEntityForm } from "@/core/classes/base-entity-form";
import { BasicItem } from "@/core/classes/basic-item";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const emailTypeData: BasicItem<string>[] = [
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

const emailSelectOption: SelectOption = {
  data: emailTypeData,
  value: (data) => data.value ?? '',
  display: (data) => data.text ?? '',
}

export class LoginEntity extends BaseEntityForm<LoginEntity> {

  @RHFField({
    index: 0,
    label: "Email"
  })
  @ZodValidation(z.string().trim().min(1, "This field is required").transform(value => value.trim()))
  username: string;

  @RHFField({
    index: 1,
    label: "Password"
  })
  @ZodValidation(z.string().trim().min(2, "This field is required").transform(value => value.trim()))
  password: string;

  @RHFField({
    index: 2,
    label: "Your Name",
  })
  @ZodValidation(z.string().max(5, 'Max length is 5'))
  yourName: string | undefined;

  @RHFField({
    index: 3,
    label: "Email Type",
    type: Control.Combobox,
    selectOption: emailSelectOption
  })
  @ZodValidation(z.string())
  emailType: string | undefined;

  @RHFField({
    index: 4,
    label: "Agee",

  })
  @ZodValidation(z.number())
  age?: number;


  constructor(username?: string, password?: string) {
    super();
    this.username = username || '';
    this.password = password || ''
    this.yourName = ''
    this.emailType = '';
  }

  onChange = (form: UseFormReturn, fieldName: string, value: any) => {
    console.log('onChange', fieldName, value);
    form.setValue('yourName', value + this.username)
  }

  onBlur = (form: UseFormReturn, fieldName: string, value: any) => {
    console.log('onBlur', fieldName, value);
  }

  onSuperRefine(data: LoginEntity, ctx: z.RefinementCtx): void {
    if (data.username.includes('hao')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username chứa Hao",
        path: ['username']
      });
    }
  }
}