'use client'

import * as React from 'react'
import tableEventEmitter from './events';

import {
    ColumnDef,
    ColumnFiltersState,
    ColumnPinningState,
    ColumnResizeMode,
    filterFns,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    PaginationState,
    Row,
    RowSelectionState,
    SortingState,
    useReactTable,
    Table,
    RowData,
} from '@tanstack/react-table'

import { useEffect, useMemo, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { TableBody, TableFooter, Table as ShadcnTable, TableHeader } from '@/components/ui/table'
import { CheckedState } from '@radix-ui/react-checkbox'
import { BaseData } from '@/core/classes/base-data'
import { FormatColumnType, ModeType, RowSelectType } from './enums'
import TableActionColumn from './base-table-action'
import { BaseTableConfig, rowIdsEditingChangeEvent } from './base-table-config'
import TableHeaderActions from './base-table-header-action'
import { BaseTableFooter, BaseTableHeader, BaseTableRow } from './base-table-row'
import BaseTablePagination from './base-table-pagination'

export const rowActionId = 'rowAction';
export const rowSelectionId = 'rowSelection';

declare module '@tanstack/react-table' {

    // allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
        formatColumnType?: FormatColumnType,
        editable?: boolean
    }
}

type TableProps<T extends BaseData> = {
    data: Array<T>
    tableConfig: BaseTableConfig<T>
}
function handleRowsSelectionChange<T extends BaseData>(
    oldState: RowSelectionState,
    newState: RowSelectionState,
    props: TableProps<T>
) {
    const oldKeys = Object.keys(oldState)
    const newKeys = Object.keys(newState)
    const rows: Row<T>[] = []
    const arrData: T[] = []
    if (oldKeys.length == newKeys.length) return

    const isSelected = oldKeys.length < newKeys.length
    let keys: string[] = []
    if (isSelected) {
        keys = newKeys.filter(w => oldKeys.indexOf(w) < 0)
    } else {
        keys = oldKeys.filter(w => newKeys.indexOf(w) < 0)
    }

    const rowsById = props.tableConfig.table?.getRowModel().rowsById
    if (rowsById && keys.length > 0) {
        keys.forEach(key => {
            const row = rowsById[key]
            if (row) {
                rows.push(row)
                arrData.push(row.original)
            }
        })
    }

    if (rows.length == 0 || arrData.length == 0) return

    if (props.tableConfig.handleRowsSelectionChange) {
        props.tableConfig.handleRowsSelectionChange(isSelected, rows, arrData)
    }
}


function GetActions<T extends BaseData>(
    row: Row<T>,
    props: TableProps<T>,
    mode: ModeType
) {
    return (
        <TableActionColumn
            tableAction={{
                isExpanded: row.getIsExpanded(),
                toggleExpandedHandler: row.getToggleExpandedHandler(),
                data: row.original,
                actions: props.tableConfig.getActions()
            }}
            menuList={props.tableConfig.isActionColumListType}
            mode={mode}
        />
    )
}

function handleSelection<T extends BaseData>(
    checked: CheckedState,
    rowSelectType: RowSelectType,
    row?: Row<T>,
    table?: Table<T>,
    props?: TableProps<T>
) {
    switch (rowSelectType) {
        case RowSelectType.Row:
            row?.toggleSelected(!!checked)
            break
        case RowSelectType.AllPages:
            table?.toggleAllRowsSelected(!!checked)
            break
        case RowSelectType.OnePage:
            table?.toggleAllPageRowsSelected(!!checked)
            break
    }

    if (props?.tableConfig.onSelect) {
        props?.tableConfig.onSelect(checked, rowSelectType, row?.original as any, row?.id)
    }
}

export function BaseTable<T extends BaseData>(props: {
    data: Array<T>,
    tableConfig: BaseTableConfig<T>
}) {
    const [rowsEditing, setRowsEditing] = useState<Record<string, T>>({...props.tableConfig.rowsEditing});
    const [columnPinningState, setColumnPinningState] = useState<ColumnPinningState>({})
    const [data] = useState(() => [...props.data]);
    const [rowSelection, setRowSelection] = useState({});
    const [rowSelectionForHandle, setRowSelectionForHandle] = useState(rowSelection)
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>('onChange')
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: props.tableConfig.pageIndexDefault,
        pageSize: props.tableConfig.pageSizeDefault,
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns = useMemo<ColumnDef<T, any>[]>(
        () => {
            if (props.tableConfig.isShowSelectionColumn) {
                const selectionColumn: ColumnDef<T, any> = {
                    id: rowSelectionId,
                    accessorKey: rowSelectionId,
                    enableSorting: false,
                    enableColumnFilter: false,
                    size: 40,
                    minSize: 40,
                    maxSize: 40,
                    enableResizing: false,
                    meta: {
                        editable: false
                    },
                    header: ({ table }) => (
                        <div className='text-center px-0'>
                            <Checkbox
                                {...
                                (props.tableConfig.isSelectAllPages ? {
                                    checked: table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate"),
                                    onCheckedChange: (value) => handleSelection(value, RowSelectType.AllPages, undefined, table, props),
                                } : {
                                    checked: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate"),
                                    onCheckedChange: (value) => handleSelection(value, RowSelectType.OnePage, undefined, table, props),
                                })
                                }
                            />
                        </div>
                    ),
                    cell: ({ row }) => (
                        <div className='text-center px-0'>
                            <Checkbox
                                {...{
                                    checked: row.getIsSelected(),
                                    disabled: !row.getCanSelect(),
                                    onCheckedChange: (value) => handleSelection(value, RowSelectType.Row, row, undefined, props)
                                }}
                            />
                        </div>

                    ),
                }
                setColumnPinningState(old => {
                    old.left = [rowSelectionId, ...props.tableConfig.colsFixLeft];

                    return old;
                })
                columnPinningState.left = [rowSelectionId, ...props.tableConfig.colsFixLeft];
                props.tableConfig.cols = [selectionColumn, ...props.tableConfig.cols];
            }
            if (props.tableConfig.isShowActionColumn) {
                const actionColumn: ColumnDef<T, any> = {
                    id: rowActionId,
                    accessorKey: rowActionId,
                    enableSorting: false,
                    enableColumnFilter: false,
                    enableResizing: false,
                    size: 100,
                    minSize: 100,
                    maxSize: 100,
                    meta: {
                        editable: false
                    },
                    header: () => 'action',
                    cell: ({ row }) => {
                        const mode = props.tableConfig.rowsEditing[row.id] !== undefined ? ModeType.Edit : ModeType.View;
                        return GetActions(row, props, mode)
                    }
                }
                columnPinningState.right = [...props.tableConfig.colsFixRight, rowActionId];

                setColumnPinningState(old => {
                    old.right = [...props.tableConfig.colsFixRight, rowActionId];

                    return old;
                })
                props.tableConfig.cols.push(actionColumn);
            }

            return props.tableConfig.cols;
        }, []
    )

    useEffect(() => {
        setRowSelectionForHandle(old => {
            handleRowsSelectionChange(old, rowSelection, props);
            handleRowsSelectionChange(old, rowSelection, props);
            return rowSelection
        })

    }, [])

    const handleRowsIdEditingChange = (newValue: Record<string, T>) => {
        setRowsEditing({...newValue});
    }

    useEffect(() => {
        tableEventEmitter.on(rowIdsEditingChangeEvent, handleRowsIdEditingChange);
        return () => {
            tableEventEmitter.off(rowIdsEditingChangeEvent, handleRowsIdEditingChange);
        };
    }, []);

    props.tableConfig.table = useReactTable({

        data,
        state: {
            rowSelection,
            sorting,
            pagination,
            columnFilters,
            columnPinning: columnPinningState
        },
        defaultColumn: {
            filterFn: filterFns.includesString,
            maxSize: 200,
            minSize: 100
        },
        columns,
        columnResizeMode,
        enableRowSelection: (row) => { return props.tableConfig.allowSelectRow(row.original) },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getRowId: props.tableConfig.getRowId,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
    })

    return (
        <div className="max-w-7xl mx-auto mb-10 mt-5">
            {/* {JSON.stringify(rowIdsEditing)} */}
            <div className="flex items-center ">
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
                    Table
                </h1>
            </div>
            {/* <div className="flex items-center py-4">
                <Input
                    placeholder="Filtebr emails..."
                    value={(props.tableConfig.table!.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        props.tableConfig.table!.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div> */}
            <div className="rounded-md border mb-4">
                <ShadcnTable {...{
                    style: {
                        // width: props.gridConfig.table.getTotalSize(),
                    },
                }}>

                    <TableHeader className='b primary'>
                        <TableHeaderActions colspan={columns.length} table={props.tableConfig.table!} />
                        {props.tableConfig.table.getHeaderGroups().map(headerGroup => (
                            <BaseTableHeader key={headerGroup.id} headerGroup={headerGroup} tableConfig={props.tableConfig} columnResizeMode={columnResizeMode} />
                        ))}

                    </TableHeader>
                    <TableBody className="border-r-0">
                        {props.tableConfig.table.getRowModel().rows.map(row => (
                            <BaseTableRow key={row.id} row={row} tableConfig={props.tableConfig} />
                        ))}
                    </TableBody>
                    <TableFooter>
                        {props.tableConfig.table.getFooterGroups().map(footerGroup => (
                            <BaseTableFooter key={footerGroup.id} footerGroup={footerGroup} tableConfig={props.tableConfig} />
                        ))}
                    </TableFooter>
                </ShadcnTable>
                <BaseTablePagination table={props.tableConfig.table} />
            </div>
        </div>
    )
}

