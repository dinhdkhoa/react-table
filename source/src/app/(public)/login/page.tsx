import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from './login-form'
import { LoginForm3 } from './login-form-refactored'

export default function Login() {
  return (
    <Card className='mx-auto max-w-md mt-56'>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>Enter your infomation below to login your account</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm3 />
      </CardContent>
    </Card>
  )
}
