import { IBaseData } from "@/core/classes/base-data";
import { ConvertResponseModelToEntityFieldsFunc, EntityFields } from "@/core/helper/helper";
import { EnodeLogResponseModel } from "@/data/remote/enode-service/models/responses/enode-log-response.model";
import { Guid } from "guid-typescript";

export interface EnodeLogEntity extends IBaseData<EnodeLogEntity> {
    id?: string,
    url?: string,
    method?: string,
    timestamp?: Date,
    serviceCode?: string,
    apiCode?: string,
    request?: string,
    payload?: object,
    response?: object,
    ///
    originJsonData?: object,
}


export const convertEnodeLogEntityFn: ConvertResponseModelToEntityFieldsFunc<EnodeLogResponseModel, EnodeLogEntity> = (res) => {
    // const entityFields: EntityFields<EnodeLogEntity> = Object.assign<EntityFields<EnodeLogEntity>, EnodeLogResponseModel>({ __id__: Guid.create().toString(), timestamp: res.timestamp ? new Date(res.timestamp) : undefined, originJsonData: res }, res);
    const entityFields: EntityFields<EnodeLogEntity> = {
        __id__: Guid.create().toString(),
        id: res.id,
        url: res.url,
        method: res.method,
        timestamp: res.timestamp ? new Date(res.timestamp) : undefined,
        serviceCode: res.service_code,
        apiCode: res.api_code,
        request: res.request,
        payload: res.payload,
        response: res.response,
        originJsonData: res
    }

    return entityFields;
}