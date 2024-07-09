import { UserEntity, convertUserEntityFn } from '@/domain/entities/user-entity'
import { postFn } from './base-service'
import { LoginRequestModel } from './models/requests/login-request.model'
import { UserLoginResponseModel } from './models/responses/login-response.model'
import { HandleStateType, handleByResponseFn } from './common/handle-state'
import { BaseResponse } from './models/responses/base-response.model'
import { loginRequestCode } from './common/request-code'

type UserServiceType<TEntity, TResModel extends BaseResponse<TEntity>> = {
  login: (request: LoginRequestModel) => Promise<HandleStateType<TEntity, TResModel>>
}

export const UserService: UserServiceType<UserEntity, UserLoginResponseModel> = {
  login: async (request: LoginRequestModel): Promise<HandleStateType<UserEntity, UserLoginResponseModel>> => {
    const response = await postFn<UserLoginResponseModel>({
      path: undefined,
      request: { data: request, ...loginRequestCode }
    })

    const state = handleByResponseFn(response, convertUserEntityFn)
    return state
  }
}