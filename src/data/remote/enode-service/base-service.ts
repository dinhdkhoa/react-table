import { ApiPath } from "./common/api-path";
import { GatewayResponseModel, createGateWayRequestModel } from "./common/gateway.model";
import { clientSessionToken } from "./common/https";
import { HttpMethodType } from "./common/types";
import { prepareFileData } from "./models/requests/file-request.model";


export type BaseRequest = {
    query?: any;
    data?: any;
    endPointCode?: any;
    serviceCode?: any;
    extRoute?: any;
    file?: File;
    apiVersion?: number;
}

export type GateWayRequest = BaseRequest & { method: HttpMethodType }

export abstract class BaseService {
    path = "Gateway";
    apiVerson = 1;

    constructor(path?: string, apiVersion?: number) {
        this.path = (path ?? this.path)
        this.apiVerson = (apiVersion ?? this.apiVerson);
    }

    async callGateway<T>({ query,
        data,
        endPointCode,
        serviceCode,
        extRoute,
        method,
        file,
        apiVersion }: GateWayRequest): Promise<GatewayResponseModel<T>> {
        const objReq = createGateWayRequestModel(method, apiVersion ?? this.apiVerson, query, data, endPointCode, serviceCode);
        if (file && query) {
            try {
                objReq.requestData = await prepareFileData(file, query);
            } catch (error) {
                throw new Error('Failed to prepare file data');
            }
        }

        const baseHeader = {
            'Content-Type': 'application/json',
            Authorization: clientSessionToken.value
                ? `Bearer ${clientSessionToken.value}`
                : ''
        }

        let url = ApiPath(this.path);
        if (extRoute) {
            url += `?route=${extRoute}`;
        }
        try {
            const res = await fetch(url,
                {
                    headers: baseHeader,
                    body: JSON.stringify(objReq),
                    method: 'POST'
                }
            )
            if (res.ok) {
                const payload: GatewayResponseModel<T> = await res.json();
                return payload;
            }
            else {
                return Promise.reject(res);
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    get = <T>({
        query,
        data,
        endPointCode,
        serviceCode,
        extRoute,
        apiVersion }: BaseRequest) => {
        return this.callGateway<T>({ query, data, endPointCode, serviceCode, extRoute, method: "GET", file: undefined, apiVersion: apiVersion })
    }

    put = <T>({ query,
        data,
        endPointCode,
        serviceCode,
        extRoute,
        apiVersion }: BaseRequest) => {
        return this.callGateway<T>({ query, data, endPointCode, serviceCode, extRoute, method: 'PUT', file: undefined, apiVersion: apiVersion })
    }

    del = <T>({ query,
        data,
        endPointCode,
        serviceCode,
        extRoute,
        apiVersion }: BaseRequest) => {
        return this.callGateway<T>({ query, data, endPointCode, serviceCode, extRoute, method: 'DELETE', file: undefined, apiVersion: apiVersion })
    }

    post = <T>({ query,
        data,
        endPointCode,
        serviceCode,
        extRoute,
        apiVersion }: BaseRequest) => {
        return this.callGateway<T>({ query, data, endPointCode, serviceCode, extRoute, method: 'POST', file: undefined, apiVersion: apiVersion })
    }

    postFile = <T>({ query,
        data,
        endPointCode,
        serviceCode,
        extRoute,
        file,
        apiVersion }: BaseRequest) => {
        return this.callGateway<T>({ query, data, endPointCode, serviceCode, extRoute, method: 'POST', file: file, apiVersion: apiVersion })
    }
}