import storageService from "@/data/storage/storage";
import { Guid } from "guid-typescript";

export type RequestGateway = {
  credentials: object,
  requestInfo: object,
  requestData?: object,
  requestQuery?: object
}

export const ServiceCode = {
  Master: "SVC001",
  eOMSAPI: "SVC002",
  InforWMS: "SVC003",
  ESB: "SVC004"
}

export const EndPointCode = {
  LoginEOMS: "ENP002",
}

export const createRequest = (
  method: string,
  requestQuery?: any,
  requestData?: any,
  serviceCode?: string,
  endPointCode?: string,
  apiVersion: number = 1,
): RequestGateway => {


  const user = storageService.getUser()
  const language = storageService.getLanguage() || 'en-US';


  const obj: RequestGateway = {
    credentials: {
      TenantId: 1,
      TennantKey: "",
      Token: '',
    },
    requestInfo: {
      ApiVersion: apiVersion,
      Channel: '',
      UserRequest: '',
      RequestUserId: user?.userId ?? '',
      ServiceCode: serviceCode,
      RequestDate: new Date(),
      RequestId: Guid.create().toString(),
      UserLanguage: language,
      TimeLocal: 'GMT+07:00',
      EndPointCode: endPointCode || '',
      Checksum: '',
      HttpMethod: method,
      WorkPlaceId: user?.currentWorkPlaceId,
    },
    requestData: requestData || {},
    requestQuery: requestQuery || {}
  }

  return obj
}