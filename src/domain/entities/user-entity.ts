import { BaseData } from "@/core/classes/base-data";

export class UserEntity extends BaseData {
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
}