'use client'

import { createContext, ReactNode, useContext, useState } from "react";
import { pageIndexDefault, pageSizeDefault } from "./base-table-config";
import { useSearchParams } from "next/navigation";


export type PaginationParams = {
    page?: number,
    pageSize?: number,
}

// interface PaginatitonParamsContextProps {
//     paginationParamsContext: PaginationParams;
//     setPaginationParamsContext: React.Dispatch<React.SetStateAction<PaginationParams>>;
// }

// const TablePaginationParamsContext = createContext<PaginatitonParamsContextProps | undefined>(undefined);

// export const TablePaginationParamsProvider = ({ initValue, children }: { initValue: PaginationParams; children: ReactNode }) => {
//     const query = useSearchParams();
//     const [paginationParams, setPaginationParams] = useState<PaginationParams>(initValue);

//     return (
//         <TablePaginationParamsContext.Provider value={{ paginationParamsContext: paginationParams, setPaginationParamsContext: setPaginationParams }}>
//             {children}
//         </TablePaginationParamsContext.Provider>
//     );
// };

// export const useTablePaginatitonParams = () => {
//     const context = useContext(TablePaginationParamsContext);
//     return context;
// };