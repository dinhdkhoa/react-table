import http from "@/lib/https";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const loginAPI = {
    login: (body: LoginBodyType) => http.post<LoginResType>('auth/login', body),
    setToken: (body: { sessionToken: string, expiresAt: string }) => http.post('api/auth', body, {baseUrl: ''})
}

export default loginAPI