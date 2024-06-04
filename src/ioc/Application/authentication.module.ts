import { DataModuleSymbols } from '@/data/DataModuleSymbols';
import { AuthenticationRepository } from '@/data/network/rest/enode-service/v1/Authentication/repositories/authentication.repository';
import { Authentication } from '@/domain/Application/Authentication/models/Authentication';
import { IAuthenticationRepository } from '@/domain/Application/Authentication/repositories/authenticationRepository.interface';
import { AuthenticateUserUseCase } from '@/domain/Application/Authentication/useCases/authenticateUser.useCase';
import { AuthenticateUserRequest } from '@/domain/Application/Authentication/useCases/requests/AuthenticateUserRequest';
import { IUseCase } from '@/domain/common/useCases/useCase.interface';
import { AuthenticationPresenter } from '@/presentation/Authentication/authentication.presenter';
import { IAuthenticationPresenter } from '@/presentation/Authentication/authenticationPresenter.interface';
import { PresentationModuleSymbols } from '@/presentation/PresentationModuleSymbols';
import { ContainerModule, interfaces } from 'inversify';
import { applyDependencies } from '../common/utils/ioc.utils';
import { DomainModuleSymbols } from '@/domain/DomainModuleSymbols';



const initializeModule = (bind: interfaces.Bind) => {
  bind<IAuthenticationRepository>(
    DataModuleSymbols.AUTH_REPOSITORY
  ).toConstantValue(
    applyDependencies(AuthenticationRepository, [DataModuleSymbols.REST_CLIENT])
  );

  bind<IUseCase<AuthenticateUserRequest, Promise<Authentication>>>(
    DomainModuleSymbols.AUTHENTICATE_USER_USE_CASE
  ).toConstantValue(
    applyDependencies(AuthenticateUserUseCase, [
      DataModuleSymbols.AUTH_REPOSITORY,
    ])
  );

  bind<IAuthenticationPresenter>(
    PresentationModuleSymbols.AUTHENTICATION_PRESENTER
  ).toConstantValue(
    applyDependencies(AuthenticationPresenter, [
      DomainModuleSymbols.AUTHENTICATE_USER_USE_CASE,
    ])
  );
};

/** @scope src/ioc */
export const AuthenticationModule = new ContainerModule(initializeModule);
