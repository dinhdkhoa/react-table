// import { AuthenticateRepositoryRequest } from '@/domain/Application/Authentication/repositories/requests/AuthenticateRepositoryRequest';
// import { Authentication } from 'domain/Application/Authentication/models/Authentication';

import { Authentication } from "../models/Authentication";
import { AuthenticateRepositoryRequest } from "./requests/AuthenticateRepositoryRequest";

export interface IAuthenticationRepository {
  authenticate(request: AuthenticateRepositoryRequest): Promise<Authentication>;
}
