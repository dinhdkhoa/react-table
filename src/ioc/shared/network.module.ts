import { DataModuleSymbols } from '@/data/DataModuleSymbols';
import { INetwork } from '@/data/network/common/config/network.interface';
import { RestClient } from '@/data/network/rest/common/config/rest.client';
import { FetchFunction } from '@/data/network/rest/common/types/network.types';
import { ContainerModule, interfaces } from 'inversify';



const initializeModule = (bind: interfaces.Bind) => {
  bind<INetwork<FetchFunction>>(DataModuleSymbols.REST_CLIENT).toDynamicValue(
    () => {
      return RestClient();
    }
  );
};
/** @scope src/ioc */
export const NetworkModule = new ContainerModule(initializeModule);
