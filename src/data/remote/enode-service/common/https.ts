import { FileRequestModel } from '../models/requests/file-request.model'
import { GatewayResponseModel, createGateWayRequestModel } from './gateway.model'
import { HttpMethodType } from './types'
import { ApiPath } from './api-path'

class SessionToken {
  private token = ''
  private _expiresAt = ''
  get value() {
    return this.token
  }
  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (!isClient()) {
      throw new Error('Cannot set token on server side')
    }
    this.token = token
  }

  get expiresAt() {
    return this._expiresAt
  }
  set expiresAt(expireAt: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (!isClient()) {
      throw new Error('Cannot set _expiresAt on server side')
    }
    this._expiresAt = expireAt
  }
}
/**
 *  chỉ lấy đc ở client, với server
 * nếu muốn có gắn sessionToken vào header phải lấy từ cookies() - next/headers
 */
export const clientSessionToken = new SessionToken()

const isClient = (): boolean => {
  return typeof window !== 'undefined'
}

const handleUnthorizedResponseOnClient = async (baseHeader: HeadersInit | undefined): Promise<void | string> => {
  // handle 401 on client
  await fetch('api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({
      sessionExpired: true
    }),
    headers: {
      ...baseHeader
    }
  })
  clientSessionToken.value = ''
  clientSessionToken.expiresAt = ''
  location.href = '/login?sessionExpired=true'
}

const prepareFileData = (file: File, query: any): Promise<FileRequestModel> => {
  return new Promise((resolve, reject) => {
    //convert file data to base64
    const fileData: FileRequestModel = {
      fileName: file.name,
      efileClassCode: query.efileClassCode,
      fileType: file.name.split('.').pop() || ''
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      //remove data url
      fileData.content = String(reader.result).split(',').pop()
      resolve(fileData)
    }

    reader.onerror = function (error) {
      reject(error)
    }
  })
}

// const callGateway = async <T>(query: any, data: any, endPointCode: any, serviceCode: any, extRoute: any, method: HttpMethodType = 'POST', file?: File | null, apiVersion: number = 1): Promise<GatewayResponseModel<T>> => {
//     const objReq = createGateWayRequestModel(method, apiVersion, query, data, endPointCode, serviceCode);
//     if (file && query) {
//         try {
//             objReq.requestData = await prepareFileData(file, query);
//         } catch (error) {
//             throw new Error('Failed to prepare file data');
//         }
//     }

//     const baseHeader = {
//         'Content-Type': 'application/json',
//         Authorization: clientSessionToken.value
//             ? `Bearer ${clientSessionToken.value}`
//             : ''
//     }

//     let url = ApiPath(gateWay);
//     if (extRoute) {
//         url += `?route=${extRoute}`;
//     }
//     try {
//         const res = await fetch(url,
//             {
//                 headers: baseHeader,
//                 body: JSON.stringify(objReq),
//                 method: 'POST'
//             }
//         )
//         if (res.ok) {
//             const payload: GatewayResponseModel<T> = await res.json();
//             return payload;
//         }
//         else {
//             return Promise.reject(res);
//         }
//     } catch (error) {
//         return Promise.reject(error)
//     }
// }

// export const get = <T>(extRoute: string, query?: any, data?: any, endPointCode?: string, serviceCode?: string) => {
//     return callGateway<T>(query, data, endPointCode, serviceCode, extRoute, 'GET', null)
// }

// export const put = <T>(extRoute: string, query?: any, data?: any, endPointCode?: string, serviceCode?: string) => {
//     return callGateway<T>(query, data, endPointCode, serviceCode, extRoute, 'PUT', null)
// }
// export const del = <T>(extRoute: string, query?: any, data?: any, endPointCode?: string, serviceCode?: string) => {
//     return callGateway<T>(query, data, endPointCode, serviceCode, extRoute, 'DELETE', null)
// }

// export const post = <T>(extRoute?: string, query?: any, data?: any, endPointCode?: string, serviceCode?: string) => {
//     return callGateway<T>(query, data, endPointCode, serviceCode, extRoute, 'POST', null)
// }
// export const postFile = <T>(extRoute?: string, file?: File, query?: any, data?: any, endPointCode?: string, serviceCode?: string) => {
//     return callGateway<T>(query, data, endPointCode, serviceCode, extRoute, 'POST', file)
// }
