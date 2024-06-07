import { UserEntity } from "@/domain/entities/user-entity";
import { BaseService, HandleState } from "./base-service";
import { LoginRequestModel } from "./models/requests/login-request.model";
import { UserLoginResponseModel } from "./models/responses/login-response.model";
import { HttpStatusCode } from "./common/types";

export class UserService extends BaseService {
  constructor(path?: string, apiVersion?: number) {
    super(path, apiVersion);
  }

  async login(request: LoginRequestModel) {
    const handleState = new HandleState<UserEntity, UserLoginResponseModel>();
    try {
      let response = await this.post<UserLoginResponseModel>({ data: request });
      return handleState.byResponse(response);
      // if (response.status == HttpStatusCode.Ok && response.value) {
      //   let { value, message } = response;
      //   handleState.success({ resValue: value, message })
      // }
    } catch (error) { }
    return handleState;
  }
}
