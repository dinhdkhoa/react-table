import { Control, DefaultCheckboxControl, DefaultTextAreaControl, DefaultTextControl, Direction, RHFField, SelectOption } from "@/core/anotations/hook-form";
import { BaseEntityForm } from "@/core/classes/base-entity-form";
import { BasicItem } from "@/core/classes/basic-item";
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

const weightData: BasicItem<number>[] = [
  {
    value: 40,
    text: "40 Kg",
  },
  {
    value: 45,
    text: "45 Kg",
  }, {
    value: 50,
    text: "50 Kg",
  }, {
    value: 55,
    text: "55 Kg",
  }, {
    value: 60,
    text: "60 Kg",
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

const weightSelectOption: SelectOption<BasicItem<number | undefined>, number | undefined> = {
  data: weightData,
  value: (data) => (data.value),
  valueString: (data) => (data.value ?? '').toString(),
  display: (data) => data.text ?? '',
}

export class LoginEntity extends BaseEntityForm<LoginEntity> {

  @RHFField({
    index: 0,
    label: "Email",
    type: DefaultTextControl,
    disableFn: (form, entity: LoginEntity) => {
      return entity.age == 39;
    }
  })
  username: string;

  @RHFField({
    index: 1,
    label: "Password",
    type: DefaultTextControl,
    validate: {
      required: (value, entity: LoginEntity) => {

        if (value.length < 6 && value.length < 10) {
          return 'required 6 - 10'
        }
        return true;
      }
    }
  })
  password: string;

  @RHFField({
    index: 2,
    label: "Your Name",
    type: DefaultTextControl
  })
  yourName: string | undefined;

  @RHFField({
    index: 3,
    label: "Email Type",
    type: {
      type: Control.Combobox,
      selectOption: emailSelectOption
    }
  })
  emailType: string | undefined;

  @RHFField({
    index: 4,
    label: "Age Range",
    type: { type: Control.Combobox, selectOption: ageSelectOption },
    disableFn: (form, entity: LoginEntity) => {
      return form.getValues('age') == 40;
    },
    visibleFn: (form, entity: LoginEntity) => {
      return form.getValues('age') != 35;
    },
    validate: {
      max30: (value, entity: LoginEntity) => {
        if (value > 30 && (entity.age ?? 0) > 37) {
          return 'max 30 nhe'
        }
        return true;
      },
      required: (value, entity: LoginEntity) => {
        if (!value) {
          return 'required'
        }
        return true;
      }
    }
  })
  ageRange?: number;

  @RHFField({
    index: 5,
    label: "Age",
    type: {
      type: Control.Number,
      min: 0,
      max: 100,
    }
  })
  age?: number;

  @RHFField({
    index: 5,
    label: "Sex",
    type: DefaultCheckboxControl
  })
  sex?: boolean;

  @RHFField({
    index: 6,
    label: "Date of Birth",
    type: {
      type: Control.Date,
      includeTime: true
    }
  })
  dob?: Date;

  @RHFField({
    index: 7,
    label: "Your Profile",
    type: DefaultTextAreaControl
  })
  profile?: string;

  @RHFField({
    index: 7,
    label: "Weight",
    type: {
      type: Control.RadioGroup,
      selectOption: weightSelectOption,
      direction: Direction.Column
    }
  })
  weightRange?: number;

  @RHFField({
    index: 8,
    label: "Homeless",
    type: { type: Control.Switch }
  })
  homeLess?: boolean;

  constructor(username?: string, password?: string) {
    super();
    this.username = username || '';
    this.password = password || ''
    this.yourName = ''
    this.emailType = '';
    this.age = 40;
    this.sex = true;
    // this.weightRange = 50;
  }

  // onChange = (form: UseFormReturn, fieldName: string, value: any) => {
  //   // console.log('onChange', fieldName, value);
  //   console.log('form.getValues()', form.getValues())
  //   console.log('this', this)
  //   // form.setValue('yourName', value + this.username)
  //   if (fieldName == 'username') {
  //     if (value.includes('hehehe')) {
  //       form.setValue('ageRange', 20)
  //     }
  //     else if (value.includes('hihihi')) {
  //       form.setValue('ageRange', 40)
  //     }

  //   }
  // }

  // onBlur = (form: UseFormReturn, fieldName: string, value: any) => {
  //   console.log('onBlur', fieldName, value);
  // }

  onSuperRefine(data: LoginEntity, ctx: z.RefinementCtx): void {


    // if ((data.ageRange ?? 0) > 30) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Max 30",
    //     path: ['ageRange']
    //   });
    // }
    // if (data.username?.includes('hao')) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Username chứa Hao",
    //     path: ['username']
    //   });
    // }
  }
}