import { BaseData, IBaseData } from "@/core/classes/base-data";
import { ConvertResponseModelToEntityFieldsFunc, EntityFields } from "@/core/helper/helper";
import { UserLoginResponseModel } from "@/data/remote/enode-service/models/responses/login-response.model";
import { Guid } from "guid-typescript";


export interface UserEntity extends IBaseData<UserEntity> {
    storerKey?: string;
    userName?: string;
    whseid?: string;
    storeCode?: string;
    token?: string;
    loginTime?: string;
    expiresTime?: string;
    lan?: string;
    userGroup?: string;
    dateFromat?: string;
    name?: string;
    email?: string;

    // convert: ConvertResponseModelToEntityFieldsFunc<UserLoginResponseModel, UserEntity> = (res) => convertUserEntityFn(res);
}

export const convertUserEntityFn: ConvertResponseModelToEntityFieldsFunc<UserLoginResponseModel, UserEntity> = (res) => {
    const entityFields: EntityFields<UserEntity> = {
        __id__: Guid.create().toString(),
        storerKey: res.storerKey,
        userName: res.userName,
        whseid: res.whseid,
        storeCode: res.storeCode,
        token: res.token,
        loginTime: res.loginTime,
        expiresTime: res.expiresTime,
        lan: res.lan,
        userGroup: res.userGroup,
        dateFromat: res.dateFromat,
        name: res.name,
        email: res.email,
    }
    return entityFields;
}