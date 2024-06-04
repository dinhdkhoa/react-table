import { Container } from 'inversify';
import { AuthenticationModule } from './Application/authentication.module';
import { NetworkModule } from './shared/network.module';

const ApplicationContainer = new Container({
  skipBaseClassChecks: true,
  defaultScope: 'Singleton',
});

const initializeContainer = () => {
  // Global modules ( Core )

  // App wide modules
  ApplicationContainer.load(NetworkModule);

  // Shared domain modules

  // Domain specific modules
  ApplicationContainer.load(AuthenticationModule);
};

initializeContainer();

export { ApplicationContainer, initializeContainer };