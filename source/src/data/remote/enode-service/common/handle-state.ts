import { BaseResponse } from '../models/responses/base-response.model'
import { GatewayResponseModel } from './gateway.model'
import { HttpStatusCode } from './types'
import { ConvertResponseModelToEntityFieldsFunc, EntityFields } from '@/core/helper/type-helpers'

type ResponseValue<TEntity, TResValue extends BaseResponse<TEntity>> = {
  resValue?: TResValue
  message?: string
}

export type HandleStateType<TEntity, TResValue extends BaseResponse<TEntity>> = {
  isError: boolean
  message: string
  value?: TEntity
}

export function handleSuccessFn<TEntity, TResValue extends BaseResponse<TEntity>>(
  { resValue, message }: ResponseValue<TEntity, TResValue>,
  convertFunc?: ConvertResponseModelToEntityFieldsFunc<TResValue, TEntity>
): HandleStateType<TEntity, TResValue> {
  const state: HandleStateType<TEntity, TResValue> = {
    isError: false,
    message: message || 'Service call successful'
  }
  if (resValue && convertFunc) {
    state.value = convertFunc(resValue)
  }
  return state
}

export function handleFailedFn<TEntity, TResValue extends BaseResponse<TEntity>>({
  resValue,
  message
}: ResponseValue<TEntity, TResValue>): HandleStateType<TEntity, TResValue> {
  const state: HandleStateType<TEntity, TResValue> = {
    isError: true,
    message: message || 'Service call failed'
  }
  return state
}

export function handleByResponseFn<TEntity, TResValue extends BaseResponse<TEntity>>(
  res: GatewayResponseModel<TResValue>,
  convertFunc?: ConvertResponseModelToEntityFieldsFunc<TResValue, TEntity>
): HandleStateType<TEntity, TResValue> {
  if (res.code == HttpStatusCode.Ok) {
    let { value, message } = res
    return handleSuccessFn({ resValue: value, message }, convertFunc)
  } else {
    let { value, message } = res
    return handleFailedFn({ resValue: value, message })
  }
}