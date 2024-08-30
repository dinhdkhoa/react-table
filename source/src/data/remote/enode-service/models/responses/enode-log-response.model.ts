import { BaseResponse } from './base-response.model'
import { EnodeLogEntity } from '@/domain/entities/enode-log/enode-log-entity'
import { EnodePaginationResponseModel } from './enode-pagination.model'

export interface EnodeLogPaginationResponseModel extends EnodePaginationResponseModel<EnodeLogResponseModel> { }

export interface EnodeLogResponseModel extends BaseResponse<EnodeLogEntity> {
  id?: string
  url?: string
  method?: string
  timestamp?: string
  serviceCode?: string
  apiCode?: string
  request?: string
  payload?: object
  response?: object

  msgId: string;
  requestId: string;
  desc: string;
  httpStatus: string;
}