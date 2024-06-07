"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { handleApiError } from "@/lib/utils"
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { loginUsecase } from "@/domain/use-cases/user-usecase"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      password: "",
      email: ""
    }
  })
  const params = useSearchParams()

  useEffect(() => {
    if (params.get("sessionExpired")) {
      toast.error("Expired Session")
    }
  }, [])

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    if (isLoading) return
    setIsLoading(true)
    try {
      // const resp = await loginAPI.login(values)
      const state = await loginUsecase({ username: values.email, password: values.password });
      if (state.isSuccess)
        toast.success(state.message)
      else {
        toast.error(state.message)
      }

      // await loginAPI.setToken({sessionToken: resp.payload.data.token, expiresAt: resp.payload.data.expiresAt})

      router.push('/me')
      router.refresh()
    } catch (error: any) {
      handleApiError(error, form.setError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 w-full max-w-[400px]"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="!mt-8 w-full" disabled={isLoading}>
          Login
        </Button>
      </form>
    </Form>
  )
}
