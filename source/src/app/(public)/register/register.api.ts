import http from '@/lib/https'
import { RegisterBodyType, RegisterResType } from '@/schemaValidations/auth.schema'

const registerAPI = {
  register: (body: RegisterBodyType) => http.post<RegisterResType>('auth/register', body)
}

export default registerAPI
