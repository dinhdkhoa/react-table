import { object } from "zod";
import { BaseResponse } from "../models/responses/base-response.model";
import { GatewayResponseModel } from "./gateway.model";
import { HttpStatusCode } from "./types";
import { IActivator } from "@/core/types/activator.types";

type ResponseValue<TEntity, TResValue extends BaseResponse<TEntity>> = {
    resValue?: TResValue,
    message?: string
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