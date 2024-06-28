// 'use server'

import { LoginRequestModel } from "@/data/remote/enode-service/models/requests/login-request.model";
import { loginUsecase } from "@/domain/use-cases/user-usecase";

export async function loginAction(value: LoginRequestModel) {
    return loginUsecase(value);
  }