import { getFn } from './base-service'
import { HandleStateType, handleByResponseFn } from './common/handle-state'
import { BaseResponse } from './models/responses/base-response.model'
import { getEnodeLogRequestCode } from './common/request-code'
import { GetEnodeLogRequestModel } from './models/requests/get-enode-log-request.model'
import { EnodeLogResponseModel } from './models/responses/enode-log-response.model'
import { convertEnodeLogEntityFn, EnodeLogEntity } from '@/domain/entities/enode-log-entity'

type EnodeLogServiceType<TEntity, TResModel extends BaseResponse<TEntity>> = {
  getList: (request: GetEnodeLogRequestModel) => Promise<HandleStateType<TEntity, TResModel>>
}

export const EnodeLogService: EnodeLogServiceType<Array<EnodeLogEntity>, Array<EnodeLogResponseModel>> = {
    getList: async (request: GetEnodeLogRequestModel): Promise<HandleStateType<Array<EnodeLogEntity>, Array<EnodeLogResponseModel>>> => {
    const response = await getFn<Array<EnodeLogResponseModel>>({
      path: 'enode',
      request: { data: request, ...getEnodeLogRequestCode }
    })
    const state = handleByResponseFn(response, convertEnodeLogEntityFn)
    return state
  }
}
