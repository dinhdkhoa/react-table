// 'use client'

import { EnodeLogService } from '@/data/remote/enode-service/enode-log-service'
import { GetEnodeLogLimitRequestModel, GetEnodeLogRequestModel } from '@/data/remote/enode-service/models/requests/get-enode-log-request.model'

export const EnodeLogUsecase = {
  getList: (request: GetEnodeLogRequestModel) => EnodeLogService.getList(request),
  getListLimit: (request: GetEnodeLogLimitRequestModel) => EnodeLogService.getListLimit(request),
}
