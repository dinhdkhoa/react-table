import { IBaseData } from '@/core/classes/base-data'
import { ConvertResponseModelToEntityFieldsFunc } from '@/core/helper/type-helpers'
import { EnodeLogPaginationResponseModel } from '@/data/remote/enode-service/models/responses/enode-log-response.model'
import { Guid } from 'guid-typescript'
import { PaginationEntity } from '../pagination-entity'
import { pageIndexDefault, pageSizeDefault } from '@/components/base-table/base-table-config'

export interface EnodeLogPaginationEntity extends PaginationEntity<EnodeLogEntity> { }
export interface EnodeLogEntity extends IBaseData<EnodeLogEntity> {
  id?: string
  url?: string
  method?: string
  timestamp?: Date
  serviceCode?: string
  apiCode?: string
  //
  messageId?: string;
  requestId?: string;
  destination?: string;
  httpStatus?: string;
  //
  request?: string
  payload?: object
  response?: object
  ///
  originJsonData?: object
}

export const convertEnodeLogPaginationEntityFn: ConvertResponseModelToEntityFieldsFunc<EnodeLogPaginationResponseModel, EnodeLogPaginationEntity> = (
  res
) => {
  const result: EnodeLogPaginationEntity = {
    page: res.pageNumber ?? (pageIndexDefault + 1),
    pageSize: res.postPerPage ?? pageSizeDefault,
    totalPage: res.totalPage ?? 1,
    data: []
  };

  if (res.data && res.data.length > 0) {
    res.data.forEach(_res => {
      result.data.push({
        __id__: Guid.create().toString(),
        id: _res.id,
        url: _res.url,
        method: _res.method,
        timestamp: _res.timestamp ? new Date(_res.timestamp) : undefined,
        serviceCode: _res.serviceCode,
        apiCode: _res.apiCode,
        request: _res.request,
        payload: _res.payload,
        response: _res.response,
        originJsonData: _res,
        destination: _res.desc,
        httpStatus: _res.httpStatus,
        messageId: _res.msgId,
        requestId: _res.requestId
      })
    })
  }
  return result
}

export interface EnodeLogBarChartDateInteractiveEntity {
  date: string,
  count: number
}

export const convertToEnodeLogBarChartDateInteractiveEntityFn = ({ data }: { data: EnodeLogEntity[] }): EnodeLogBarChartDateInteractiveEntity[] => {
  if (!data || data.length == 0) {
    return []
  }
  else {
    const _filteredData = data.filter((item) => item.timestamp !== undefined && item.timestamp !== null);
    const sortedData = _filteredData.sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp.getFullYear(), a.timestamp.getMonth(), a.timestamp.getDate()) : new Date(0);
      const dateB = b.timestamp ? new Date(b.timestamp.getFullYear(), b.timestamp.getMonth(), b.timestamp.getDate()) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    });

    const dateMap = new Map<string, number>();
    sortedData.forEach(item => {
      if (item.timestamp) {
        const dateKey = new Date(item.timestamp.getFullYear(), item.timestamp.getMonth(), item.timestamp.getDate()).toLocaleDateString();
        if (dateMap.has(dateKey)) {
          dateMap.set(dateKey, dateMap.get(dateKey)! + 1);
        } else {
          dateMap.set(dateKey, 1);
        }
      }
    });

    // Chuyển Map thành mảng EnodeLogBarChartInteractiveEntity[]
    const result: EnodeLogBarChartDateInteractiveEntity[] = Array.from(dateMap, ([date, count]) => ({
      date: date,
      count: count
    }));

    return result;
  }
}


export interface EnodeLogBarChartServiceCodeInteractiveEntity {
  serviceCode: string,
  count: number
}

export const convertToEnodeLogBarChartServiceCodeInteractiveEntityFn = ({ data }: { data: EnodeLogEntity[] }): EnodeLogBarChartServiceCodeInteractiveEntity[] => {
  if (!data || data.length == 0) {
    return []
  }
  else {

    const dataMap = new Map<string, number>();
    data.forEach(item => {
      const dataKey = item.serviceCode || '';
      if (dataMap.has(dataKey)) {
        dataMap.set(dataKey, dataMap.get(dataKey)! + 1);
      } else {
        dataMap.set(dataKey, 1);
      }
    })

    const result: EnodeLogBarChartServiceCodeInteractiveEntity[] = Array.from(dataMap, ([serviceCode, count]) => ({
      serviceCode: serviceCode,
      count: count
    }));

    return result;
  }
}
