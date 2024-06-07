import { UserService } from "@/data/remote/enode-service/user-services";

export async function loginUsecase({ username, password }: { username: string, password: string }) {
    const service = new UserService()
    return await service.login({ email: username, password })
}