"use client"
import BaseForm from "@/components/base-form"
import BaseTextInput from "@/components/base-form/form-controls/base-text-input-form"
import { Button } from "@/components/ui/button"
import useBaseForm from "@/core/hooks/useBaseForm"
import { loginAction } from "./_action/login-actions"
import { toast } from "sonner"
import { useState } from "react"
import loginAPI from "./login.api"
import { useRouter } from "next/navigation"
import { LoginEntity, defaultLoginEntity } from "@/domain/entities/login-entity"

export function LoginForm() {
  const router = useRouter();
  const [loginState, setLoginState] = useState(false);
  const { ...props } = useBaseForm<LoginEntity>(defaultLoginEntity)

  const onSubmit = props.form.handleSubmit(async (data) => {
    setLoginState(true);
    loginAction({ username: data.username || '', password: data.passwordEncode(data) }).then(async handleState => {
      if (!handleState.isError) {
        await loginAPI.setToken({ sessionToken: handleState.value?.token || '', expiresAt: handleState.value?.expiresTime || '' });
        router.push('/demo');
      }
      else {
        toast.error('Login failed')
      }
    }).catch((reason) => {
      setLoginState(false);
      toast.error('Login failed')
    });
  });

  return (
    <>
      <BaseForm<LoginEntity> {...props}>
        <form onSubmit={onSubmit} className="space-y-2 w-full max-w-[400px]">
          <BaseTextInput<LoginEntity> name="username" />
          <BaseTextInput<LoginEntity> name="password" />

          <Button type="submit" disabled={props.form.formState.isLoading || loginState} className="!mt-8 w-full">
            Login
          </Button>
        </form>
      </BaseForm>
    </>
  )
}
