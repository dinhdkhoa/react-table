// import { RHF } from "@/core/anotations/rhf-field";
// import { BaseEntityForm } from "@/core/classes/base-entity-form";
// import { BasicItem } from "@/core/classes/basic-item";
// import { Control, SelectOption } from "@/core/types/control.types";
// import { UseFormReturn } from "react-hook-form";

// const emailTypeData: BasicItem<string>[] = [
//   {
//     value: "gmail",
//     text: "xxx.Gmail.com",
//   },
//   {
//     value: "itlvn",
//     text: "xxx.itlvn.com",
//   },
//   {
//     value: "yahoo",
//     text: "xxx.yahoo.com",
//   }
// ]

// const ageData: BasicItem<number>[] = [
//   {
//     value: 10,
//     text: "10 tuổi",
//   },
//   {
//     value: 20,
//     text: "20 tuổi",
//   },
//   {
//     value: 30,
//     text: "30 tuổi",
//   },
//   {
//     value: 40,
//     text: "40 tuổi",
//   },
//   {
//     value: 50,
//     text: "50 tuổi",
//   },
// ]

// const weightData: BasicItem<number>[] = [
//   {
//     value: 40,
//     text: "40 Kg",
//   },
//   {
//     value: 45,
//     text: "45 Kg",
//   }, {
//     value: 50,
//     text: "50 Kg",
//   }, {
//     value: 55,
//     text: "55 Kg",
//   }, {
//     value: 60,
//     text: "60 Kg",
//   },
// ]


// const emailSelectOption: SelectOption<BasicItem<string>, string> = {
//   data: emailTypeData,
//   value: (data) => data.value ?? '',
//   valueString: (data) => (data.value ?? ''),
//   display: (data) => data.text ?? '',
// }

// const ageSelectOption: SelectOption<BasicItem<number | undefined>, number | undefined> = {
//   data: ageData,
//   value: (data) => (data.value),
//   valueString: (data) => (data.value ?? '').toString(),
//   display: (data) => data.text ?? '',
// }

// const weightSelectOption: SelectOption<BasicItem<number | undefined>, number | undefined> = {
//   data: weightData,
//   value: (data) => (data.value),
//   valueString: (data) => (data.value ?? '').toString(),
//   display: (data) => data.text ?? '',
// }

// export class LoginEntity extends BaseEntityForm {

//   @RHF({
//     label: "Email",
//     type: Control.Text,
//     placeholder: 'Email',
//     // visibleFn: (form: UseFormReturn, entity: LoginEntity) => {
//     //   return !entity.abc;
//     // },
//     disableFn: (form: UseFormReturn<LoginEntity>, entity: LoginEntity) => {
//       // console.log('disableFn', entity, form.getValues());
//       return false;
//     }
//   })
//   username: string;

//   @RHF({
//     label: "Password",
//     type: Control.Text,
//     placeholder: 'Password',
//     // visibleFn: (form: UseFormReturn, entity: LoginEntity) => {
//     //   return !entity.abc;
//     // },
//     disableFn: (form: UseFormReturn<LoginEntity>, entity: LoginEntity) => {
//       // console.log('disableFn', entity, form.getValues());
//       return entity.abc;
//     },

//   })
//   password: string;

//   @RHF({
//     label: "Age",
//     type: Control.Number,
//     placeholder: 'Age',
//     // visibleFn: (form: UseFormReturn, entity: LoginEntity) => {
//     //   return !entity.abc;
//     // },
//     disableFn: (form: UseFormReturn<LoginEntity>, entity: LoginEntity) => {
//       // console.log('disableFn', entity, form.getValues());
//       return entity.abc;
//     }
//   })
//   age?: number;

//   @RHF({
//     label: "Date of Birth",
//     type: Control.Date,
//     includeTime: true,
//     // visibleFn: (form: UseFormReturn, entity: LoginEntity) => {
//     //   return !entity.abc;
//     // },
//     disableFn: (form: UseFormReturn<LoginEntity>, entity: LoginEntity) => {
//       // console.log('disableFn', entity, form.getValues());
//       return entity.abc;
//     }
//   })
//   dob?: Date;

//   @RHF({
//     label: "Male",
//     type: Control.Checkbox,
//     // visibleFn: (form: UseFormReturn, entity: LoginEntity) => {
//     //   return !entity.abc;
//     // },
//     disableFn: (form: UseFormReturn<LoginEntity>, entity: LoginEntity) => {
//       // console.log('disableFn', entity, form.getValues());
//       return entity.abc;
//     }
//   })
//   male?: boolean;

//   @RHF({
//     label: "Email Type",
//     type: Control.StaticCombobox,
//     selectOption: emailSelectOption,
//     // visibleFn: (form: UseFormReturn, entity: LoginEntity) => {
//     //   return !entity.abc;
//     // },
//     disableFn: (form: UseFormReturn<LoginEntity>, entity: LoginEntity) => {
//       // console.log('disableFn', entity, form.getValues());
//       return entity.abc;
//     }
//   })
//   emailType?: string;

//   @RHF({
//     label: "Weight Range",
//     type: Control.RadioGroup,
//     selectOption: weightSelectOption,
//     // visibleFn: (form: UseFormReturn, entity: LoginEntity) => {
//     //   return !entity.abc;
//     // },
//     disableFn: (form: UseFormReturn<LoginEntity>, entity: LoginEntity) => {
//       // console.log('disableFn', entity, form.getValues());
//       return entity.abc;
//     }
//   })
//   weightRange?: number;

//   @RHF({
//     index: 8,
//     label: "Homeless",
//     type: Control.Switch,
//     disableFn: (form: UseFormReturn<LoginEntity>, entity: LoginEntity) => {
//       // console.log('disableFn', entity, form.getValues());
//       return entity.abc;
//     }
//   })
//   homeLess?: boolean;

//   @RHF({
//     index: 8,
//     label: "Your Profile",
//     type: Control.Switch,
//     disableFn: (form: UseFormReturn<LoginEntity>, entity: LoginEntity) => {
//       // console.log('disableFn', entity, form.getValues());
//       return entity.abc;
//     }
//   })
//   yourProfile?: string;

//   @RHF({
//     index: 4,
//     label: "Multiple Age Range",
//     type: Control.MultipleSelect, selectOption: ageSelectOption,
//     disableFn: (form: UseFormReturn<LoginEntity>, entity: LoginEntity) => {
//       // console.log('disableFn', entity, form.getValues());
//       return entity.abc;
//     }
//   })
//   multipleAgeRange?: number[];


//   abc: boolean;

//   constructor(username?: string) {
//     super();
//     this.username = username || '',
//       this.password = '';
//     this.abc = false;
//     this.dob = new Date();
//     this.male = true;
//     this.weightRange = 50;
//     this.emailType = 'gmail';
//   }



//   onChange = (form: UseFormReturn, fieldName: string | undefined, value: any) => {
//     // console.log('onChange', this.username, form.getValues(), this);
//     console.log('onChange', fieldName, form.getValues(), this);
//     this.abc = this.username == 'ccc'
//   }

//   onBlur = (form: UseFormReturn, fieldName: string | undefined, value: any) => {
//     // console.log('onBlur', this.username, form.getValues(), this)
//   }
// }