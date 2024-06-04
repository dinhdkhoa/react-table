// import { ResourceDefinition } from 'data/network/rest/common/types/network.types';

import { ResourceDefinition } from "@/data/network/rest/common/types/network.types";
import { EndPointCode, ServiceCode } from "../../common/utils/BaseRequest";

export type AuthenticationEndpointsDefinition = {
  AUTHENTICATE: ResourceDefinition;
};

export const AUTHENTICATION_ENDPOINTS: AuthenticationEndpointsDefinition = {
  AUTHENTICATE: () => ({
    path: '',
    method: 'POST',
    apiVersion: 1,
    serviceCode: ServiceCode.Master,
    endpointCode: EndPointCode.LoginEOMS,
    getwayParams: {route: 'LoginEOMS'}
  }),
};
