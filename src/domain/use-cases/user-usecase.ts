import { LoginRequestModel } from "@/data/remote/enode-service/models/requests/login-request.model";
import { UserService2 } from "@/data/remote/enode-service/user-services";

export async function loginUsecase(request: LoginRequestModel) {
    const service = new UserService2()
    return await service.login(request)
}