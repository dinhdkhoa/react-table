'use client'

import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
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
    updateSearchParams: (values: { key: string, value: string }[]) => URLSearchParams;
}

const PageSearchParamsContext = createContext<PageSearchParamsContextProps | undefined>(undefined);

export const PageSearchParamsProvider = ({ children }: { children: ReactNode }) => {
    const { page, pageSize, urlSearchParams, setUrlSearchParams, updateSearchParams } = useCustomSearchParams('PageSearchParamsProvider');
    const [paginationParams, setPaginationParams] = useState<PaginationParams>({ page: page, pageSize: pageSize });
    useEffect(() => {
        setPaginationParams({ page: page, pageSize: pageSize });
    }, [page, pageSize])

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