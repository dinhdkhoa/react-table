import { UseFormReturn } from "react-hook-form";
import { BaseData } from "./base-data";

export type onChangeFun = (form: UseFormReturn, fieldName: string | undefined, value: any) => void;
export type onBlurFun = (form: UseFormReturn, fieldName: string | undefined, value: any) => void;
export abstract class BaseEntityForm extends BaseData {
    onChange: onChangeFun | undefined;
    onBlur?: onBlurFun | undefined;
}