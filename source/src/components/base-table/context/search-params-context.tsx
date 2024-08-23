'use client'

import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { defaultTablePaginatitonParams, pageSizeDefault } from "../base-table-config";
import { useCustomSearchParams } from "@/core/hooks/useCustomSearchParams";


export type PaginationParams = {
    page?: number,
    pageSize?: number,
}

interface PageSearchParamsContextProps {
    paginationParams: PaginationParams;
    setPaginationParams: React.Dispatch<React.SetStateAction<PaginationParams>>;
    urlSearchParams: URLSearchParams;
    setUrlSearchParams: React.Dispatch<SetStateAction<URLSearchParams>>;
    updateSearchParams: (values: { key: string, value: string }[]) => void
}

const PageSearchParamsContext = createContext<PageSearchParamsContextProps | undefined>(undefined);

export const PageSearchParamsProvider = ({ initValue, children }: { initValue: (Record<string, string> | undefined); children: ReactNode }) => {
    const _value = initValue || {};
    const { page, pageSize, urlSearchParams, setUrlSearchParams, updateSearchParams } = useCustomSearchParams('PageSearchParamsProvider');
    const [paginationParams, setPaginationParams] = useState<PaginationParams>({ page: page, pageSize: pageSize });
    useEffect(() => {
        setPaginationParams({ page: page, pageSize: pageSize });
    }, [page, pageSize])


    // const [paginationParams, setPaginationParams] = useState<PaginationParams>(() => {
    //     let _paginationParams = defaultTablePaginatitonParams;
    //     const _searchKeys = Object.keys(_value);
    //     _searchKeys.forEach(k => {
    //         switch (k.toLowerCase()) {
    //             case 'pagesize':
    //                 const _pageSize = Number(_value[k]);
    //                 if (!isNaN(_pageSize)) {
    //                     _paginationParams.pageSize = _pageSize;
    //                 }
    //                 break;
    //             case 'page':
    //                 const _page = Number(_value[k]);
    //                 if (!isNaN(_page)) {
    //                     _paginationParams.pageSize = _page;
    //                 }
    //                 break;
    //             default:
    //                 break;
    //         }
    //     })
    //     return _paginationParams;
    // });

    return (
        <PageSearchParamsContext.Provider value={{ paginationParams: paginationParams, setPaginationParams: setPaginationParams, urlSearchParams: urlSearchParams, setUrlSearchParams: setUrlSearchParams, updateSearchParams: updateSearchParams }}>
            {children}
        </PageSearchParamsContext.Provider>
    );
};

export const usePageSearchParams = () => {
    const context = useContext(PageSearchParamsContext) as PageSearchParamsContextProps;
    return context;
};