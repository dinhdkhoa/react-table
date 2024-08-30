// 'use client'

import { EnodeLogService } from '@/data/remote/enode-service/enode-log-service'
import { GetEnodeLogLimitRequestModel } from '@/data/remote/enode-service/models/requests/get-enode-log-request.model'

export const EnodeLogUsecase = {
  getListLimit: (request: GetEnodeLogLimitRequestModel) => EnodeLogService.getListLimit(request),
}
