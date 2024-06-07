import { BaseResponse } from "../models/responses/base-response.model";
import { GatewayResponseModel } from "./gateway.model";
import { HttpStatusCode } from "./types";

type ResponseValue<TEntity, TResValue extends BaseResponse<TEntity>> = {
    resValue?: TResValue,
    message?: string
}

export class HandleState<TEntity, TResValue extends BaseResponse<TEntity>> {
    isError: boolean = true;
    message: string = "Service call failed";
    value?: TEntity;

    constructor(isError?: boolean, message?: string, value?: TEntity) {
        this.isError = isError ?? this.isError;
        this.message = message ?? this.message;
        this.value = value;
    }

    success({ resValue, message }: ResponseValue<TEntity, TResValue>) {
        this.isError = false;
        this.value = resValue?.toEntity();
        this.message = message ?? 'Service call successful';
        return this;
    }

    failed({ resValue, message }: ResponseValue<TEntity, TResValue>) {
        this.isError = true;
        this.value = resValue?.toEntity();
        this.message = message ?? "Service call failed";
        return this;
    }

    byResponse(res: GatewayResponseModel<TResValue>){
        if(res.status == HttpStatusCode.Ok){
            let { value, message } = res;
            this.success({ resValue: value, message })
        }
        else{
            let { value, message } = res;
            this.failed({resValue: value, message})
        }
        return this;
    }

    get isSuccess() {
        return !this.isError;
    }
}