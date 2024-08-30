import { getFn } from './base-service'
import { HandleStateType, handleByResponseFn } from './common/handle-state'
import { BaseResponse } from './models/responses/base-response.model'
import { getEnodeLogRequestCode } from './common/request-code'
import { GetEnodeLogLimitRequestModel } from './models/requests/get-enode-log-request.model'
import { EnodeLogPaginationResponseModel } from './models/responses/enode-log-response.model'
import { convertEnodeLogPaginationEntityFn, EnodeLogPaginationEntity } from '@/domain/entities/enode-log/enode-log-entity'

type GetListLimit<TEntity, TResModel extends BaseResponse<TEntity>> = (request: GetEnodeLogLimitRequestModel) => Promise<HandleStateType<TEntity, TResModel>>;
type EnodeLogServiceType = {
  getListLimit: GetListLimit<EnodeLogPaginationEntity, EnodeLogPaginationResponseModel>
}

export const EnodeLogService: EnodeLogServiceType = {
  getListLimit: async function (request: GetEnodeLogLimitRequestModel): Promise<HandleStateType<EnodeLogPaginationEntity, EnodeLogPaginationResponseModel>> {
    let state: HandleStateType<EnodeLogPaginationEntity, EnodeLogPaginationResponseModel> = {
      isError: false,
      message: '',
    }
    try {
      const response = await getFn<EnodeLogPaginationResponseModel>({
        path: 'enode',
        request: { data: request, ...getEnodeLogRequestCode }
      })
      state = handleByResponseFn(response, convertEnodeLogPaginationEntityFn)
    } catch (error) {
      state.isError = true
      state.message = error?.toString() ?? 'Have an error!'
    }
    finally {
      return state
    }
  }
}