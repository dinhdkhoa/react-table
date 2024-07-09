import { BaseRequestCode } from '../base-service'

export const loginRequestCode: BaseRequestCode = {
  extRoute: 'LoginEOMS',
  serviceCode: 'SVC001',
  endPointCode: 'ENP002'
}

export const getEnodeLogRequestCode: BaseRequestCode = {
  extRoute: '',
  serviceCode: 'eOMS001',
  endPointCode: 'LIST'
}