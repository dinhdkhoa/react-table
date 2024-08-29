import storageService from '@/data/storage/storage'
import { Guid } from 'guid-typescript'
import { HttpMethodType } from './types'

export interface GateWayRequestModel {
  credentials: object
  requestInfo: object
  requestData?: object
  requestQuery?: object
}

export interface GatewayResponseModel<T = any> {
  value: T
  status: number
  message?: string
  isResponseResult: boolean
  responseId: string
  endPointCode: string
  success: boolean
  code: number
  errors: number
  dataInput: number
}

export const createGateWayRequestModel = (
  method: HttpMethodType,
  apiVersion: number,
  requestQuery?: any,
  requestData?: any,
  serviceCode?: string,
  endPointCode?: string
): GateWayRequestModel => {
  const user = storageService.getUser()
  const language = storageService.getLanguage() || 'en-US'

  const obj: GateWayRequestModel = {
    credentials: {
      tenantId: 1,
      tennantKey: '',
      token: ''
    },
    requestInfo: {
      channel: "Web",
      serviceCode: serviceCode,
      requestDate: new Date(),
      userRequest: "",
      requestId: Guid.create().toString(),
      userLanguage: "vi-VN",
      timeLocal: "GMT+07:00",
      apiCode: endPointCode,
      httpMethod: method,
      partnerId: "",
      extRoute: "",
      version: apiVersion,
      requestQuery: {}
    },
    requestData: requestData || {},
    requestQuery: requestQuery || {}
  }

  return obj
}
