import { UserEntity } from "@/domain/entities/user-entity";
import { BaseResponse } from "./base-response.model";

export class UserLoginResponseModel implements BaseResponse<UserEntity> {
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

    toEntity(): UserEntity {
        const entity = new UserEntity();
        Object.assign(entity, this);

        return entity;
    }
}
