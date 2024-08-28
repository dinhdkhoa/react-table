import { FieldValues, UseFormReturn } from "react-hook-form";
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
                        else {
                            form.setValue(_ff.fieldName as any, undefined as any)
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

export function searchParamsPaginationPipe(searchParams?: any) {
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

export function searchParamsMergeDefaultEntityPipe<E extends FieldValues = FieldValues>(defaultEntity: E, searchParams?: any) {
    if (searchParams) {
        const _searchParamskeys = Object.keys(searchParams);
        const __formfields__ = (defaultEntity as any)['__formfields__'] as (RHFOptions<E>[] | undefined);

        __formfields__?.forEach(_ff => {
            //Tìm trong searchParams, nếu có key thì không update từ defaultEntity vào searchParams
            //Ngược lại thì bổ sung default value từ defaultEntity vào searchParams
            if (_searchParamskeys.findIndex(w => w.toLowerCase() == _ff.fieldName.toString().toLowerCase()) == -1) {
                const _value = defaultEntity[_ff.fieldName];
                if (_value !== undefined && _value !== null) {
                    if (_ff.type == Control.Date) {
                        searchParams[_ff.fieldName] = new Date(_value);
                    }
                    else if (_ff.type == Control.Number) {
                        searchParams[_ff.fieldName] = _value;
                    }
                    else {
                        searchParams[_ff.fieldName] = _value.toString();
                    }
                }
            }
        })
    }
    return searchParams;
}

export function searchParamsToRequestModel<R>(searchParams?: any) {

}

export const convertSearchParamsToFilterModel = <FM>(mapper: Record<string, string>, searchParams?: any,): FM => {
    const filterModel = {};
    if (searchParams) {
        const mapperKeys = Object.keys(mapper);
        const searchParamsKeys = Object.keys(searchParams);
        mapperKeys.forEach(mk => {
            const _spKey = searchParamsKeys.find(w => w.toLowerCase() == mk.toLowerCase());
            if (_spKey) {
                const _spValue = searchParams[_spKey];
                const filterKey = (mapper as any)[mk];
                (filterModel as any)[filterKey] = _spValue;
            }
        })
    }
    console.log('filterModel', filterModel);
    return filterModel as FM;
}
