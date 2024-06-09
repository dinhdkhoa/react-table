import { RHFField, ZodValidation } from "@/core/anotations/hook-form";
import { BaseEntityForm, onBlurFun } from "@/core/classes/base-entity-form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export class LoginEntity extends BaseEntityForm {

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
    index: 1,
    label: "Your Name",
    // onChange: (event) => {
    //   console.log(event);
    // }
  })
  @ZodValidation(z.string().max(5, 'Max length is 5'))
  yourName: string | undefined;

  constructor(username?: string, password?: string) {
    super();
    this.username = username || '';
    this.password = password || ''
    this.yourName = ''
  }

  onChange = (form: UseFormReturn, fieldName: string, value: any) => {
    console.log('onChange', fieldName, value);
    form.setValue('yourName', value + this.username)
  }

  onBlur = (form: UseFormReturn, fieldName: string, value: any) => {
    console.log('onBlur', fieldName, value);
  }
}
