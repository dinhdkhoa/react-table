import { IBaseData } from '@/core/classes/base-data'
import { ConvertResponseModelToEntityFieldsFunc, EntityFields } from '@/core/helper/type-helpers'
import { EnodeLogResponseModel } from '@/data/remote/enode-service/models/responses/enode-log-response.model'
import { Guid } from 'guid-typescript'

export interface EnodeLogEntity extends IBaseData<EnodeLogEntity> {
  id?: string
  url?: string
  method?: string
  timestamp?: Date
  serviceCode?: string
  apiCode?: string
  request?: string
  payload?: object
  response?: object
  ///
  originJsonData?: object
}

export const convertEnodeLogEntityFn: ConvertResponseModelToEntityFieldsFunc<Array<EnodeLogResponseModel>, Array<EnodeLogEntity>> = (
  res
) => {
  const result: Array<EnodeLogEntity> = [];
  if (res && res.length > 0) {
    res.forEach(_res => {
      result.push({
        __id__: Guid.create().toString(),
        id: _res.id,
        url: _res.url,
        method: _res.method,
        timestamp: _res.timestamp ? new Date(_res.timestamp) : undefined,
        serviceCode: _res.service_code,
        apiCode: _res.api_code,
        request: _res.request,
        payload: _res.payload,
        response: _res.response,
        originJsonData: _res
      })
    })
  }
  return result
}
