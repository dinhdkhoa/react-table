'use client'

// import { TableSortLabel } from "@mui/material";
import { ColumnResizeMode, HeaderGroup, Row, SortDirection, flexRender } from "@tanstack/react-table";
// import { Box } from "mdi-material-ui";
// import { visuallyHidden } from '@mui/utils'
// import { TableRow, TableCell, getCommonPinningStyles } from "./styles";
import { BaseGridConfig, BaseGridData } from "./types";
import { Filter } from "./enode-grid-filter";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import React, { ReactNode } from "react";
import { ArrowDownNarrowWide, ArrowUpDown, ArrowUpNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCommonPinningStyles } from "./styles";

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

export function GridHeader<T extends BaseGridData>(props: {
    headerGroup: HeaderGroup<T>,
    columnResizeMode: ColumnResizeMode,
    gridConfig: BaseGridConfig<T>
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
                    {/* <div
                        {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className: `resizer ${props.gridConfig.table!.options.columnResizeDirection
                                } ${header.column.getIsResizing() ? 'isResizing' : ''
                                }`,
                            style: {
                                transform:
                                    props.columnResizeMode === 'onEnd' &&
                                        header.column.getIsResizing()
                                        ? `translateX(${(props.gridConfig.table!.options.columnResizeDirection ===
                                            'rtl'
                                            ? -1
                                            : 1) *
                                        (props.gridConfig.table!.getState().columnSizingInfo
                                            .deltaOffset ?? 0)
                                        }px)`
                                        : '',
                            },
                        }}
                    ></div> */}
                </TableHead>
            )
        })}
    </TableRow>
    )
}

export function GridRow<T extends BaseGridData>(props: {
    row: Row<T>,
    gridConfig: BaseGridConfig<T>
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

export function GridFooter<T extends BaseGridData>(props: {
    footerGroup: HeaderGroup<T>,
    gridConfig: BaseGridConfig<T>
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
