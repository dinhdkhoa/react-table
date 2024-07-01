import { FieldValues, UseFormReturn } from "react-hook-form";
import { BaseData, IBaseData } from "./base-data";
import { RHFOptions } from "../anotations/rhf-field";

export type onChangeFun<TEnity extends FieldValues = FieldValues> = (form: UseFormReturn<TEnity>, fieldName: string | undefined, value: any, formGetValues: TEnity) => void;
export type onBlurFun<TEnity extends FieldValues = FieldValues> = (form: UseFormReturn<TEnity>, fieldName: string | undefined, value: any, formGetValues: TEnity) => void;

export interface IBaseEntityForm<TEntity extends FieldValues> extends IBaseData<TEntity>, IBaseEntityFormBehavior<TEntity> {
    __formfields__?: RHFOptions<TEntity>[];
}

export interface IBaseEntityFormBehavior<TEntity extends FieldValues> {
    __onChange__?: onChangeFun<TEntity> | undefined;
    __onBlur__?: onBlurFun<TEntity> | undefined;
}

export abstract class BaseEntityForm extends BaseData {
    onChange: onChangeFun | undefined;
    onBlur?: onBlurFun | undefined;
}