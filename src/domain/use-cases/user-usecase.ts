import { LoginRequestModel } from "@/data/remote/enode-service/models/requests/login-request.model";
import { UserService } from "@/data/remote/enode-service/user-services";

export async function loginUsecase(request: LoginRequestModel) {
    const service = new UserService()
    return await service.login(request)
}