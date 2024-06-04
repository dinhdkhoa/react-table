import { INetwork } from '@/data/network/common/config/network.interface';
import { IAuthenticationRepository } from '@/domain/Application/Authentication/repositories/authenticationRepository.interface';
import { AuthenticateRepositoryRequest } from '@/domain/Application/Authentication/repositories/requests/AuthenticateRepositoryRequest';
import { AxiosResponse } from 'axios';
// import { FetchFunction } from '../../../common/types/network.types';
import { AUTHENTICATION_ENDPOINTS } from '../consts/AuthenticationEndpoints';
import { AuthenticatePayload } from '../consts/AuthenticationPayloads';
import { AuthenticationRest } from '../models/AuthenticationRest';
import { ApiPath } from '../../common/utils/ApiPath';
import { authenticationRestToAuthenticationDomain } from '../../shared/Authentication/mappers/authenticationRestToAuthenticationDomain';
import { FetchFunction } from '@/data/network/rest/common/types/network.types';
import { createRequest } from '../../common/utils/BaseRequest';

export const AuthenticationRepository = ({
  client,
}: INetwork<FetchFunction>): IAuthenticationRepository => ({
  authenticate: async (request: AuthenticateRepositoryRequest) => {
    const restClient = await client();
    const endpoint = AUTHENTICATION_ENDPOINTS.AUTHENTICATE();
    let apiURL = ApiPath(endpoint.path);
    if (apiURL.endsWith('/')) {
      apiURL = apiURL.slice(0, apiURL.length -1)
      }
    const baseRequest = createRequest(endpoint.method, null, request, endpoint.serviceCode, endpoint.endpointCode, 1)
    const { data, status } = await restClient.post<
      AuthenticationRest,
      any
    >(apiURL, baseRequest,
      {
        params: endpoint.getwayParams,
      }
    );

    if (status !== 200) {
      throw Error('TODO ERROR HANDLING');
    }

    return authenticationRestToAuthenticationDomain(data);
  },
});
