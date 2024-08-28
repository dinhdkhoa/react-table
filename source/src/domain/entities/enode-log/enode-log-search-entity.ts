import { RHFOptions } from '@/core/anotations/rhf-field'
import { Control } from '@/core/types/control.types'
import { IBaseEntityForm, IBaseEntityFormBehavior } from '@/core/classes/base-entity-form'


export const EnodeLogSearchEntityFields: RHFOptions<EnodeLogSearchEntity>[] = [
  {
    fieldName: 'quickSearch',
    label: 'Quick search',
    type: Control.Text,
  },
  {
    fieldName: 'fromTime',
    label: 'From',
    type: Control.Date,
    includeTime: true,
    validate: {
      lessThanOrEqual: (fieldValue, entity) => {
        const result = entity.fromTime <= entity.toTime;
        if (result) {
          return true;
        }
        const _toTime = entity.toTime.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
        return `Value must be less than or equal ${_toTime}`
      }
    }
  },
  {
    fieldName: 'toTime',
    label: 'To',
    type: Control.Date,
    includeTime: true,
    validate: {
      greaterThanOrEqual: (fieldValue, entity) => {
        const result = entity.fromTime <= entity.toTime;
        if (result) {
          return true;
        }
        const _fromTime = entity.fromTime.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
        return `Value must be greater than or equal ${_fromTime}`
      }
    }
  },
  {
    fieldName: 'id',
    label: 'Id',
    type: Control.Text,

  },
  {
    fieldName: 'serviceCode',
    label: 'Service code',
    type: Control.Text,
  },
  {
    fieldName: 'apiCode',
    label: 'API code',
    type: Control.Text,
  },
  {
    fieldName: 'requestId',
    label: 'Request Id',
    type: Control.Text,
  },
  {
    fieldName: 'httpStatusCode',
    label: 'Status Code',
    type: Control.Number,
  },

]

export interface EnodeLogSearchEntity extends IBaseEntityForm<EnodeLogSearchEntity>, IBaseEntityFormBehavior<EnodeLogSearchEntity> {
  quickSearch?: string
  fromTime: Date
  toTime: Date
  id: string
  serviceCode: string
  apiCode: string
  requestId: string
  httpStatusCode: number | string
}


export const defaultEnodeLogSearchEntity = (): EnodeLogSearchEntity => {
  const dateNow = new Date();
  const from = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
  const to = new Date(from);
  to.setDate(from.getDate() + 1)
  to.setSeconds(from.getMilliseconds() - 1);
  const _searchEntity: EnodeLogSearchEntity = {
    quickSearch: "",
    fromTime: from,
    toTime: to,
    id: '',
    apiCode: '',
    serviceCode: '',
    requestId: '',
    httpStatusCode: '',
    __id__: "EnodeLogSearchEntity",
    __formfields__: EnodeLogSearchEntityFields
  }
  return _searchEntity;
}