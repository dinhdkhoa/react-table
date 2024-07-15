import { BaseResponse } from './base-response.model'
import { EnodeLogEntity } from '@/domain/entities/enode-log-entity'

export interface EnodeLogResponseModel extends BaseResponse<EnodeLogEntity> {
  id?: string
  url?: string
  method?: string
  timestamp?: string
  service_code?: string
  api_code?: string
  request?: string
  payload?: object
  response?: object
  
  msg_id: string;
  request_id: string;
  desc: string;
  http_status: string;
}