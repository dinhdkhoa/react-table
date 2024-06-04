import { Authentication } from "@/domain/Application/Authentication/models/Authentication";
import { AuthenticatePresenterRequest } from "./request/AuthenticatePresenterRequest";

export interface IAuthenticationPresenter {
  authenticate: (
    request: AuthenticatePresenterRequest
  ) => Promise<Authentication>;
}
