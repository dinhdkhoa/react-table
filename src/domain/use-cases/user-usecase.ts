import { LoginRequestModel } from "@/data/remote/enode-service/models/requests/login-request.model";
import { UserService } from "@/data/remote/enode-service/user-services";

export const UserUsecase = {
    login: (request: LoginRequestModel) => UserService.login(request)
}