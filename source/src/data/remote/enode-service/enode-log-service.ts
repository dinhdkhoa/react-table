import { getFn } from './base-service'
import { HandleStateType, handleByResponseFn } from './common/handle-state'
import { BaseResponse } from './models/responses/base-response.model'
import { getEnodeLogRequestCode } from './common/request-code'
import { GetEnodeLogLimitRequestModel, GetEnodeLogRequestModel } from './models/requests/get-enode-log-request.model'
import { EnodeLogResponseModel } from './models/responses/enode-log-response.model'
import { convertEnodeLogEntityFn, EnodeLogEntity } from '@/domain/entities/enode-log/enode-log-entity'

type GetList<TEntity, TResModel extends BaseResponse<TEntity>> = (request: GetEnodeLogRequestModel) => Promise<HandleStateType<TEntity, TResModel>>;
type GetListLimit<TEntity, TResModel extends BaseResponse<TEntity>> = (request: GetEnodeLogLimitRequestModel) => Promise<HandleStateType<TEntity, TResModel>>;
type EnodeLogServiceType = {
  getList: GetList<Array<EnodeLogEntity>, Array<EnodeLogResponseModel>>
  getListLimit: GetListLimit<Array<EnodeLogEntity>, Array<EnodeLogResponseModel>>
}

export const EnodeLogService: EnodeLogServiceType = {
  getList: async function (request: GetEnodeLogRequestModel): Promise<HandleStateType<EnodeLogEntity[], EnodeLogResponseModel[]>> {
    let state: HandleStateType<EnodeLogEntity[], EnodeLogResponseModel[]> = {
      isError: false,
      message: ''
    }
    try {
      const response = await getFn<Array<EnodeLogResponseModel>>({
        path: 'enode',
        request: { data: request, ...getEnodeLogRequestCode }
      })
      state = handleByResponseFn(response, convertEnodeLogEntityFn)
    } catch (error) {
      state.isError = true
      state.message = error?.toString() ?? 'Have an error!'
    }
    finally {
      return state
    }
  },
  getListLimit: async function (request: GetEnodeLogLimitRequestModel): Promise<HandleStateType<EnodeLogEntity[], EnodeLogResponseModel[]>> {
    let state: HandleStateType<EnodeLogEntity[], EnodeLogResponseModel[]> = {
      isError: false,
      message: ''
    }
    try {
      const response = await getFn<Array<EnodeLogResponseModel>>({
        path: 'enode',
        request: { data: request, ...getEnodeLogRequestCode }
      })
      state = handleByResponseFn(response, convertEnodeLogEntityFn)
    } catch (error) {
      // console.log(error)
      state.isError = true
      state.message = error?.toString() ?? 'Have an error!'
    }
    finally {
      return state
    }
  },
}