"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
// import { LoginForm } from "@/ui/Login/login-form"
import { LoginForm } from "./login-form"
import { LoginForm3 } from "./login-form-refactored"
// import { LoginForm2 } from "./login-form copy"

export default function Login() {
  return (
    <div className="items-center mt-40">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your infomation below to login your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm3 />
        </CardContent>
      </Card>
    </div>
  )
}
