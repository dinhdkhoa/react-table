'use client'

import { createContext, ReactNode, useContext, useState } from "react";
import { BaseTableConfig } from "./base-table-config";
import { IBaseData } from "@/core/classes/base-data";


interface PaginatitonParamsContextProps<T extends IBaseData<T>> {
    tableConfigContext: BaseTableConfig<T>;
    setTableConfigContext: React.Dispatch<React.SetStateAction<BaseTableConfig<T>>>;
}

const TableConfigParamsContext = createContext<any>(undefined);

export const TableConfigProvider = <T extends IBaseData<T>>({ initValue, children }: { initValue: BaseTableConfig<T>; children: ReactNode }) => {
    const [tableConfig, setTableConfig] = useState<BaseTableConfig<T>>(initValue);

    return (
        <TableConfigParamsContext.Provider value={{ tableConfigContext: tableConfig, setTableConfigContext: setTableConfig }}>
            {children}
        </TableConfigParamsContext.Provider>
    );
};

export const useTableConfig = <T extends IBaseData<T>>() => {
    const context = useContext(TableConfigParamsContext) as PaginatitonParamsContextProps<T>;
    return context;
};