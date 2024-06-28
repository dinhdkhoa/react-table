'use server'

import { LoginRequestModel } from "@/data/remote/enode-service/models/requests/login-request.model";
import { UserService } from "@/data/remote/enode-service/user-services";
import { loginUsecase } from "@/domain/use-cases/user-usecase";

export async function loginAction(value: LoginRequestModel) {
    return UserService.login(value);
    // return loginUsecase(value);
  }