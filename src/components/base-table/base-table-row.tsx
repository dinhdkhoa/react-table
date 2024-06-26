'use client'

import { Cell, ColumnResizeMode, HeaderGroup, Row, SortDirection, flexRender } from "@tanstack/react-table";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { ArrowDownNarrowWide, ArrowUpDown, ArrowUpNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseTableConfig } from "./base-table-config";
import { BaseData } from "@/core/classes/base-data";
import { getCommonPinningStyles } from "./styles";
import { Filter } from "./base-table-filter";
import { DefaultValues, useForm } from "react-hook-form";
import BaseDynamicControl from "../base-form/form-controls/base-dynamic-control-form";
import { rowActionId, rowSelectionId } from "./base-table";
import { cn } from "@/lib/utils";
import BaseForm from "../base-form";
import { RHF_FIELDS } from "@/core/anotations/rhf-field";

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
                    style={{ ...getCommonPinningStyles(column) }}

                    className={cn("border-r last:border-r-0", column.getIsPinned() ? "bg-background" : "")}
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

function useBaseForm<TEntity>(
    entity: TEntity & Object
) {
    const [state] = useState(entity)

    const rhf = Reflect.getMetadata(RHF_FIELDS, entity)
    const form = useForm({
        defaultValues: entity as DefaultValues<TEntity>
    })
    return {
        rhf: rhf,
        form,
        entity: state
    }
}

export function BaseTableRow<T extends BaseData>(props: {
    row: Row<T>,
    tableConfig: BaseTableConfig<T>
}) {
    const [entity, setEntity] = useState<T>(() => (props.tableConfig.getEntityByRow(props.row.original, props.row.index, props.row.getParentRow())!));
    const { ...baseFormProps } = useBaseForm<T>(entity);

    const buildCell = (cell: Cell<T, unknown>) => {
        const { editable } = cell.column.columnDef.meta ?? {};

        return (props.tableConfig.rowsEditing[(props.row.id)] !== undefined
            && (editable ?? true))
            ? <BaseDynamicControl name={cell.column.id} />
            : flexRender(cell.column.columnDef.cell, cell.getContext())
    }
    return (
        <>
            <TableRow>
                <BaseForm {...baseFormProps}>
                    {props.row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}
                            style={{ ...getCommonPinningStyles(cell.column) }}
                            className={cn("border-r last:border-r-0", cell.column.getIsPinned() ? "bg-background" : "")}
                        >
                            {buildCell(cell)}
                        </TableCell>
                    ))}
                </BaseForm>

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
