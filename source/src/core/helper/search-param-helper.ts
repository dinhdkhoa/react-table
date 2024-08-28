import { UseFormReturn } from "react-hook-form";
import { IBaseEntityForm } from "../classes/base-entity-form";
import { RHFOptions } from "../anotations/rhf-field";
import { Control } from "../types/control.types";
import { defaultTablePaginatitonParams, pageSizeOptionsDefault } from "@/components/base-table/base-table-config";

export function setSearchParamsToBaseForm<T extends IBaseEntityForm<T>>(form: UseFormReturn<T, any, undefined>, urlSearchParams: URLSearchParams) {
    const keys = Object.keys(form.getValues());
    const __formfields__ = form.getValues('__formfields__' as any) as (RHFOptions<T>[] | undefined);
    urlSearchParams.forEach((value, key, parent) => {
        const fieldName = keys.find(_key => (_key || '').toLocaleLowerCase() == key.toLowerCase());
        if (fieldName) {
            if (__formfields__ && __formfields__.length > 0) {
                const _ff = __formfields__.find(ff => (ff?.fieldName || '').toString().toLowerCase() == key.toLowerCase())
                if (_ff && _ff.fieldName.toString()) {
                    if (_ff.type == Control.Date) {
                        if (value) {
                            form.setValue(_ff.fieldName as any, new Date(value) as any)
                        }
                    }
                    else {
                        form.setValue(_ff.fieldName as any, value as any);
                    }
                }
            }
        }
    })
}

export function searchParamsPaginationPipe (searchParams?: any){
    if (searchParams === undefined) {
        searchParams = {}
    }
    searchParams.pageSize = Number(searchParams?.pageSize ?? defaultTablePaginatitonParams.pageSize);
    searchParams.page = Number(searchParams?.page ?? defaultTablePaginatitonParams.page);
    if (!pageSizeOptionsDefault.includes(searchParams.pageSize)) {
        searchParams.pageSize = defaultTablePaginatitonParams.pageSize;
    }
    return searchParams;
}