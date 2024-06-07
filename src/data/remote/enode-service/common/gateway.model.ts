import storageService from "@/data/storage/storage";
import { Guid } from "guid-typescript";
import { HttpMethodType } from "./types";

export interface GateWayRequestModel {
  credentials: object,
  requestInfo: object,
  requestData?: object,
  requestQuery?: object
}

export interface GatewayResponseModel<T = any> {
  value: T,
  status: number,
  message?: string,
  isResponseResult: boolean,
  responseId: string,
  endPointCode: string,
  success: boolean,
  code: number,
  errors: number,
  dataInput: number,
}

export const createGateWayRequestModel = (
  method: HttpMethodType,
  apiVersion: number,
  requestQuery?: any,
  requestData?: any,
  serviceCode?: string,
  endPointCode?: string,
): GateWayRequestModel => {

  const user = storageService.getUser()
  const language = storageService.getLanguage() || 'en-US';

  const obj: GateWayRequestModel = {
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