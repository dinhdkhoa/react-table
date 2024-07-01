"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterBody, RegisterBodyType } from "@/schemaValidations/auth.schema"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LoginEntity } from "@/domain/entities/login-entity-refactor"
import BaseForm from "@/components/base-form"
let count = 0 

export function RegisterForm() {
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [state] =useState<LoginEntity>( new LoginEntity('sdfsdfsf'))
  // const router = useRouter()
  // const form = useForm<RegisterBodyType>({
  //   resolver: zodResolver(RegisterBody),
  //   defaultValues: {
  //     name: "",
  //     confirmPassword: "",
  //     password: "",
  //     email: ""
  //   }
  // })

  // // 2. Define a submit handler.
  // async function onSubmit() {
  //   count++
  //   form.setValue("email", String(count))
    
  // }  
  // // console.log(form.getValues())
  // const props : any = {
  //   form,
    
  // }

  return (
    <></>
    // <BaseForm {...props}>
    //   <form
    //     onSubmit={form.handleSubmit(onSubmit)}
    //     className="space-y-2 w-full max-w-[400px]"
    //   >
    //     {/* <TextInput name="email" /> */}
    //     <FormField
    //       control={form.control}
    //       name="email"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Email</FormLabel>
    //           <FormControl>
    //             <Input placeholder="Email" {...field} />
    //           </FormControl>

    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <FormField
    //       control={form.control}
    //       name="password"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Password</FormLabel>
    //           <FormControl>
    //             <Input placeholder="Password" {...field} />
    //           </FormControl>

    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <FormField
    //       control={form.control}
    //       name="confirmPassword"
    //       render={({ field, fieldState, formState }) => {
    //         // console.log(field.value)
    //         return (
    //           <FormItem>
    //             <FormLabel>Confirm Password</FormLabel>
    //             <FormControl>
    //               <Input placeholder="Confirm Password" {...field} />
    //             </FormControl>

    //             <FormMessage />
    //           </FormItem>
    //         )
    //       }}
    //     />
    //     <Button type="button" onClick={onSubmit} className="!mt-8 w-full">
    //       Register
    //     </Button>
    //   </form>
    // </BaseForm>
  )
}
