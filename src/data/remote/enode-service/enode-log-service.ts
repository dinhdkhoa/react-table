import { getFn } from './base-service'
import { HandleStateType, handleByResponseFn } from './common/handle-state'
import { BaseResponse } from './models/responses/base-response.model'
import { getEnodeLogRequestCode } from './common/request-code'
import { GetEnodeLogRequestModel } from './models/requests/get-enode-log-request.model'
import { EnodeLogResponseModel } from './models/responses/enode-log-response.model'
import { convertEnodeLogEntityFn, EnodeLogEntity } from '@/domain/entities/enode-log-entity'


type GetList<TEntity, TResModel extends BaseResponse<TEntity>> = (request: GetEnodeLogRequestModel) => Promise<HandleStateType<TEntity, TResModel>>;
type EnodeLogServiceType = {
  getList: GetList<Array<EnodeLogEntity>, Array<EnodeLogResponseModel>>
}

export const EnodeLogService: EnodeLogServiceType = {
  getList: async function (request: GetEnodeLogRequestModel): Promise<HandleStateType<EnodeLogEntity[], EnodeLogResponseModel[]>> {
    const response = await getFn<Array<EnodeLogResponseModel>>({
      path: 'enode',
      request: { data: request, ...getEnodeLogRequestCode }
    })
    const state = handleByResponseFn(response, convertEnodeLogEntityFn)
    return state
  }
}