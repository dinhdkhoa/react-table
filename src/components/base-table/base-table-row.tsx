'use client'

import { ColumnResizeMode, HeaderGroup, Row, SortDirection, flexRender } from "@tanstack/react-table";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import React from "react";
import { ArrowDownNarrowWide, ArrowUpDown, ArrowUpNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseTableConfig } from "./base-table-config";
import { BaseData } from "@/common/classes/base-data";
import { getCommonPinningStyles } from "./styles";
import { Filter } from "./base-table-filter";

function TableSortLabel(props: {
    active: boolean,
    direction: SortDirection
}) {
    const size = "ml-2 h-4 w-4";

    if (!props.active) {
        return (
            <ArrowUpDown className={size} />
        )
    }

    if (props.direction == 'asc') {
        return (
            <ArrowDownNarrowWide className={size} />
        )
    }

    if (props.direction == 'desc') {
        return <ArrowUpNarrowWide className={size} />
    }

}

export function BaseTableHeader<T extends BaseData>(props: {
    headerGroup: HeaderGroup<T>,
    columnResizeMode: ColumnResizeMode,
    tableConfig: BaseTableConfig<T>
}) {
    return (<TableRow>
        {props.headerGroup.headers.map(header => {
            const { column } = header
            const firstSort = column.getFirstSortDir();

            return (
                <TableHead
                    key={header.id}
                    className="border-r last:border-r-0"
                    style={{ ...getCommonPinningStyles(column) }}
                    colSpan={header.colSpan}
                >
                    {
                        header.isPlaceholder ?
                            null :
                            (column.getCanSort() ? (
                                <Button
                                    variant="ghost"
                                    onClick={column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}

                                    {TableSortLabel({
                                        active: column.getIsSorted() !== false,
                                        direction: (column.getIsSorted() == false ? firstSort : column.getIsSorted() as SortDirection)
                                    })}
                                </Button>
                            ) : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            ))
                    }
                    {header.column.getCanFilter() ? (
                        <div>
                            <Filter column={header.column} />
                        </div>
                    ) : null}
                </TableHead>
            )
        })}
    </TableRow>
    )
}

export function BaseTableRow<T extends BaseData>(props: {
    row: Row<T>,
    tableConfig: BaseTableConfig<T>
}) {
    return (
        <>
            <TableRow>
                {props.row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}
                        className="border-r  last:border-r-0"
                        style={{ ...getCommonPinningStyles(cell.column) }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}

            </TableRow>
            {props.row.getIsExpanded() && (
                <TableRow>
                    <TableCell colSpan={props.row.getVisibleCells().length}>
                        {JSON.stringify(props.row.original)}
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}

export function BaseTableFooter<T extends BaseData>(props: {
    footerGroup: HeaderGroup<T>,
    tableConfig: BaseTableConfig<T>
}) {
    return (<TableRow>
        {props.footerGroup.headers.map(header => (
            <TableCell
                key={header.id}
                style={{ ...getCommonPinningStyles(header.column) }}
            >
                {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                    )}
            </TableCell>
        ))}
    </TableRow>
    )
}
