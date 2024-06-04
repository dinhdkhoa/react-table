import { Authentication } from "@/domain/Application/Authentication/models/Authentication";
import { AuthenticateUserRequest } from "@/domain/Application/Authentication/useCases/requests/AuthenticateUserRequest";
import { IUseCase } from "@/domain/common/useCases/useCase.interface";
import { IAuthenticationPresenter } from "./authenticationPresenter.interface";
import { AuthenticatePresenterRequest } from "./request/AuthenticatePresenterRequest";
import { authenticationDomainToAuthenticationView } from "../shared/Authentication/mappers/authenticationDomainToAuthenticationView";

export const AuthenticationPresenter = (
  authenticateUserUseCase: IUseCase<
    AuthenticateUserRequest,
    Promise<Authentication>
  >
): IAuthenticationPresenter => ({
  authenticate: async ({ password, email }: AuthenticatePresenterRequest) => {
    const result = await authenticateUserUseCase.execute({
      username: email,
      password,
    });
    return authenticationDomainToAuthenticationView(result);
  },
});
