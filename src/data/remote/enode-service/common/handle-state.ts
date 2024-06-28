import { object } from "zod";
import { BaseResponse } from "../models/responses/base-response.model";
import { GatewayResponseModel } from "./gateway.model";
import { HttpStatusCode } from "./types";
import { IActivator } from "@/core/types/activator.types";
import { ConvertResponseModelToEntityFieldsFunc, EntityFields } from "@/core/helper/helper";

type ResponseValue<TEntity, TResValue extends BaseResponse<TEntity>> = {
    resValue?: TResValue,
    message?: string
}

export type HandleStateType<TEntity, TResValue extends BaseResponse<TEntity>> = {
    isError: boolean,
    message: string,
    value?: EntityFields<TEntity>,
}

export function handleSuccessFn<TEntity, TResValue extends BaseResponse<TEntity>>({ resValue, message }: ResponseValue<TEntity, TResValue>, convertFunc?: ConvertResponseModelToEntityFieldsFunc<TResValue, TEntity>): HandleStateType<TEntity, TResValue> {
    const state: HandleStateType<TEntity, TResValue> = {
        isError: false,
        message: message || 'Service call successful',
    }
    if(resValue && convertFunc){
        state.value = convertFunc(resValue);
    }
    return state;
}

export function handleFailedFn<TEntity, TResValue extends BaseResponse<TEntity>>({ resValue, message }: ResponseValue<TEntity, TResValue>): HandleStateType<TEntity, TResValue> {
    const state: HandleStateType<TEntity, TResValue> = {
        isError: true,
        message: message || 'Service call failed',
    }
    return state;
}

export function handleByResponseFn<TEntity, TResValue extends BaseResponse<TEntity>>(res: GatewayResponseModel<TResValue>, convertFunc?: ConvertResponseModelToEntityFieldsFunc<TResValue, TEntity>): HandleStateType<TEntity, TResValue> {
    if (res.status == HttpStatusCode.Ok) {
        let { value, message } = res;
        return handleSuccessFn({ resValue: value, message }, convertFunc)
    }
    else {
        let { value, message } = res;
        return handleFailedFn({ resValue: value, message })
    }
}

export class HandleState<TEntity, TResValue extends BaseResponse<TEntity>> {
    isError: boolean = true;
    message: string = "Service call failed";
    value?: TEntity;
    emptyResValue?: TResValue;

    constructor(classRes?: IActivator<TResValue>, isError?: boolean, message?: string, value?: TEntity) {
        this.isError = isError ?? this.isError;
        this.message = message ?? this.message;
        if (classRes) {
            this.emptyResValue = new classRes;
        }
        this.value = value;
    }

    success({ resValue, message }: ResponseValue<TEntity, TResValue>) {
        this.isError = false;
        if (this.emptyResValue) {
            Object.assign(this.emptyResValue, resValue);
            this.value = this.emptyResValue?.toEntity();
            console.log(this.value);
        }
        this.message = message ?? 'Service call successful';
        return this;
    }

    failed({ resValue, message }: ResponseValue<TEntity, TResValue>) {
        this.isError = true;
        if (this.emptyResValue) {
            Object.assign(this.emptyResValue, resValue);
            this.value = this.emptyResValue?.toEntity();
        }
        this.message = message ?? "Service call failed";
        return this;
    }

    byResponse(res: GatewayResponseModel<TResValue>) {
        if (res.status == HttpStatusCode.Ok) {
            let { value, message } = res;
            this.success({ resValue: value, message })
        }
        else {
            let { value, message } = res;
            this.failed({ resValue: value, message })
        }
        return this;
    }

    get isSuccess() {
        return !this.isError;
    }
}