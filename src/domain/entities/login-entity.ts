// import { Control, DefaultCheckboxControl, DefaultDateControl, DefaultNumberControl, DefaultTextControl, RHFField, SelectOption, ZodValidation } from "@/core/anotations/hook-form";
// import { BaseEntityForm } from "@/core/classes/base-entity-form";
// import { BasicItem } from "@/core/classes/basic-item";
// import { UseFormReturn } from "react-hook-form";
// import { z } from "zod";

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

// export class LoginEntity extends BaseEntityForm<LoginEntity> {
//   @RHFField({
//     index: 0,
//     label: "Email",
//     type: DefaultTextControl,
//     placeholder: 'Email',
//     disableFn: (form, entity: LoginEntity) => {
//       return entity.age == 39;
//     }
//   })
//   @ZodValidation(z.string().trim().min(1, "This field is required").transform(value => value.trim()))
//   username: string;

//   @RHFField({
//     index: 1,
//     label: "Password",
//     type: DefaultTextControl,
//     validate: {
//       required: (value, entity: LoginEntity) => {
    
//          if(value.length < 6 && value.length < 10){
//           return 'required 6 - 10'
//         }
//         return true;
//       }
//     }
//   })
//   @ZodValidation(z.string().trim().min(2, "This field is required").transform(value => value.trim()))
//   password: string;

//   @RHFField({
//     index: 2,
//     label: "Your Name",
//     type: DefaultTextControl
//   })
//   @ZodValidation(z.string().max(5, 'Max length is 5'))
//   yourName: string | undefined;

//   @RHFField({
//     index: 3,
//     label: "Email Type",
//     placeholder: 'Email Type',
//     type: {
//       type: Control.Combobox,
//       selectOption: emailSelectOption
//     }
//   })
//   @ZodValidation(z.string().email())
//   emailType: string | undefined;

//   @RHFField({
//     index: 4,
//     label: "Age Range",
//     type: { type: Control.Combobox, selectOption: ageSelectOption },
//     disableFn: (form, entity: LoginEntity) => {
//       return form.getValues('age') == 40;
//     },
//     visibleFn: (form, entity: LoginEntity) => {
//       return form.getValues('age') != 35;
//     },
//     validate: {
//       max30: (value, entity: LoginEntity) => {
//         if (value > 30 && (entity.age ?? 0) > 37) {
//           return 'max 30 nhe'
//         }
//         return true;
//       },
//       required: (value, entity: LoginEntity) => {
//         if (!value) {
//           return 'required'
//         }
//         return true;
//       }
//     }
//   })
//   @ZodValidation(z.number().optional().transform(value => Number(value)))
//   ageRange?: number;

//   @RHFField({
//     index: 5,
//     label: "Age",
//     type: {
//       type: Control.Number,
//       min: 0,
//       max: 100,
//     }
//   })
//   @ZodValidation(z.number().transform(value => Number(value)))
//   age?: number;

//   @RHFField({
//     index: 5,
//     label: "Sex",
//     type: DefaultCheckboxControl
//   })
//   @ZodValidation(z.boolean())
//   sex?: boolean;

//   @RHFField({
//     index: 6,
//     label: "Date of Birth",
//     type: {
//       type: Control.Date,
//       includeTime: true
//     }
//   })
//   @ZodValidation(z.date())
//   dob?: Date;


//   constructor(username?: string, password?: string) {
//     super();
//     this.username = username || '';
//     this.password = password || ''
//     this.yourName = ''
//     this.emailType = '';
//     this.age = 40;
//     this.sex = true;
//   }

// <<<<<<< Updated upstream
//   onChange = (form: UseFormReturn, fieldName: string | undefined, value: any) => {
//     // console.log('onChange', fieldName, value);
//     // console.log('form.getValues()', form.getValues())
//     console.log(this.username)
//     // form.setValue('yourName', value + this.username)
 
// =======
//   onChange = (form: UseFormReturn, fieldName: string, value: any) => {
    
//     if (fieldName == 'username') {
//       if (value.includes('hehehe')) {
//         // form.setValue('ageRange', 20)
//         form.setValue('multipleAgeRange', [40, 20])
//       }
//       else if (value.includes('hihihi')) {
//         // form.setValue('ageRange', 40)
//       }

//     }
// >>>>>>> Stashed changes
//   }

//   // onBlur = (form: UseFormReturn, fieldName: string, value: any) => {
//   //   console.log('onBlur', fieldName, value);
//   // }

//   onSuperRefine(data: LoginEntity, ctx: z.RefinementCtx): void {


//     // if ((data.ageRange ?? 0) > 30) {
//     //   ctx.addIssue({
//     //     code: z.ZodIssueCode.custom,
//     //     message: "Max 30",
//     //     path: ['ageRange']
//     //   });
//     // }
//     // if (data.username?.includes('hao')) {
//     //   ctx.addIssue({
//     //     code: z.ZodIssueCode.custom,
//     //     message: "Username chứa Hao",
//     //     path: ['username']
//     //   });
//     // }
//   }
// }