import { UserEntity } from "@/domain/entities/user-entity";
import { BaseService } from "./base-service";
import { LoginRequestModel } from "./models/requests/login-request.model";
import { UserLoginResponseModel } from "./models/responses/login-response.model";
import { HandleState } from "./common/handle-state";

export class UserService extends BaseService {
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
