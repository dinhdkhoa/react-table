import { Control, RHFField, SelectOption } from "@/core/anotations/hook-form";
import { BaseEntityForm } from "@/core/classes/base-entity-form";
import { BasicItem } from "@/core/classes/basic-item";
import { UseFormReturn } from "react-hook-form";

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

const ageData: BasicItem<number>[] = [
  {
    value: 10,
    text: "10 tuổi",
  },
  {
    value: 20,
    text: "20 tuổi",
  },
  {
    value: 30,
    text: "30 tuổi",
  },
  {
    value: 40,
    text: "40 tuổi",
  },
  {
    value: 50,
    text: "50 tuổi",
  },
]

const emailSelectOption: SelectOption<BasicItem<string>, string> = {
  data: emailTypeData,
  value: (data) => data.value ?? '',
  valueString: (data) => (data.value ?? ''),
  display: (data) => data.text ?? '',
}

const ageSelectOption: SelectOption<BasicItem<number | undefined>, number | undefined> = {
  data: ageData,
  value: (data) => (data.value),
  valueString: (data) => (data.value ?? '').toString(),
  display: (data) => data.text ?? '',
}

export class LoginEntity extends BaseEntityForm<LoginEntity> {

  @RHFField({
    label: "Email",
    type: Control.Text,
    placeholder: 'Email',

  })
  username: string;


  constructor(username?: string) {
    super();
    this.username = username || ''
  }

  onChange = (form: UseFormReturn, fieldName: string | undefined, value: any) => {
    console.log(this.username)

  }


  
}