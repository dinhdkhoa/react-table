// "use client"
// import BaseForm from "@/components/base-form"
// import BaseTextInput from "@/components/base-form/form-controls/base-text-input-form"
// import { Button } from "@/components/ui/button"
// import useBaseForm from "@/core/hooks/useBaseForm"
// // import { LoginEntity } from "@/domain/entities/login-entity"
// import { loginAction } from "./_action/login-actions"
// import { toast } from "sonner"
// import { LoginEntity, fields } from "@/domain/entities/login-entity-refactor"
// import BaseCheckboxInput from "@/components/base-form/form-controls/base-checkbox-form"
// import BaseComboboxInput from "@/components/base-form/form-controls/base-combobox-form"
// import BaseDateTimeInput from "@/components/base-form/form-controls/base-date-time-form"
// import BaseMultipleSelectInput from "@/components/base-form/form-controls/base-multiple-select-form"
// import BaseNumberInput from "@/components/base-form/form-controls/base-number-input-form"
// import BaseRadioGroupInput from "@/components/base-form/form-controls/base-radio-group-form"
// import BaseSwitchInput from "@/components/base-form/form-controls/base-switch-form"
// import BaseTextAreaInput from "@/components/base-form/form-controls/base-text-area-input-form"
// import { useState } from "react"
// import { convertToSHA1 } from "@/core/utils/encryption"
// import loginAPI from "./login.api"
// import { useRouter } from "next/navigation"

// export function LoginForm3() {
//   const router = useRouter();
//   const [loginState, setLoginState] = useState(false);
//   const [loginEntity2] = useState<LoginEntity>(() => {
//     const entity: LoginEntity = {
//       username: "",
//       password: "",
//       passwordEncode: function (entity: LoginEntity): string {
//         return convertToSHA1(entity.password || '')
//       },
//       __formfields__: fields,
//       __id__: ""
//     }
//     return entity;
//   })
//   const { ...props } = useBaseForm<LoginEntity>(loginEntity2)

//   const onSubmit = props.form.handleSubmit(async (data) => {
//     setLoginState(true);
//     loginAction({ username: data.username || '', password: data.passwordEncode(data) }).then(async handleState => {
//       if (!handleState.isError) {
//         await loginAPI.setToken({ sessionToken: handleState.value?.token || '', expiresAt: handleState.value?.expiresTime || '' });
//         router.push('/demo');
//       }
//       else {
//         toast.error('Login failed')
//       }
//     }).catch((reason) => {
//       setLoginState(false);
//       toast.error('Login failed')
//     });
//   });

//   return (
//     <>
//       <BaseForm<LoginEntity> {...props}>
//         <form onSubmit={onSubmit} className="space-y-2 w-full max-w-[400px]">
//           <BaseTextInput<LoginEntity> name="username" />
//           <BaseTextInput<LoginEntity> name="password" />
//           {/* <BaseNumberInput<LoginEntity> name="age" />
//           <BaseDateTimeInput<LoginEntity> name="dob" />
//           <BaseCheckboxInput<LoginEntity> name="male" />
//           <BaseComboboxInput<LoginEntity> name="emailType" />
//           <BaseRadioGroupInput<LoginEntity> name="weightRange" />
//           <BaseSwitchInput<LoginEntity> name="homeLess" />
//           <BaseTextAreaInput<LoginEntity> name="yourProfile" />
//           <BaseMultipleSelectInput<LoginEntity> name="multipleAgeRange" /> */}

//           <Button type="submit" disabled={props.form.formState.isLoading || loginState} className="!mt-8 w-full">
//             Login
//           </Button>
//         </form>
//         <Button className="!mt-8 w-full" onClick={() => {
//           props.form.reset();
//         }}>
//           Reset
//         </Button>
//       </BaseForm>
//     </>
//   )
// }
