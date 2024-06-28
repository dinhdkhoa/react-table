import { UserEntity, convertUserEntityFn } from "@/domain/entities/user-entity";
import { BaseService, postFn } from "./base-service";
import { LoginRequestModel } from "./models/requests/login-request.model";
import { UserLoginResponseModel } from "./models/responses/login-response.model";
import { HandleState, HandleStateType, handleByResponseFn } from "./common/handle-state";
import { BaseResponse } from "./models/responses/base-response.model";

type UserServiceType<TEntity, TResModel extends BaseResponse<TEntity>> = {
  login: (request: LoginRequestModel) => Promise<HandleStateType<TEntity, TResModel>>
}

export const UserService: UserServiceType<UserEntity, UserLoginResponseModel> = {
  login: async (request: LoginRequestModel): Promise<HandleStateType<UserEntity, UserLoginResponseModel>> => {
    const response = await postFn<UserLoginResponseModel>({ path: undefined, request: { data: request, extRoute: 'LoginEOMS', endPointCode: 'ENP002', serviceCode: 'SVC001' } });

    const state = handleByResponseFn(response, convertUserEntityFn);
    // if (response.value) {
    //   const entity = convertUserEntityFn(response.value);
    //   state.value = entity;
    // }
    return state;
  }
}


export class UserService2 extends BaseService {
  constructor(path?: string, apiVersion?: number) {
    super(path, apiVersion);
  }

  async login(request: LoginRequestModel) {
    const handleState = new HandleState<UserEntity, UserLoginResponseModel>(UserLoginResponseModel);
    try {
      let response = await this.post<UserLoginResponseModel>({ data: request, extRoute: 'LoginEOMS', endPointCode: 'ENP002', serviceCode: 'SVC001' });
      return handleState.byResponse(response);
    } catch (error) {
      console.log(error);
    }
    return handleState;
  }
}