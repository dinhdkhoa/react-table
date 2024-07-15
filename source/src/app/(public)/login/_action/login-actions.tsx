'use server'

import { LoginRequestModel } from '@/data/remote/enode-service/models/requests/login-request.model'
import { UserUsecase } from '@/domain/use-cases/user-usecase'

export async function loginAction(value: LoginRequestModel) {
  return UserUsecase.login(value)
}
