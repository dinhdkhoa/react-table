'use client'

import * as React from 'react'
import tableEventEmitter from './events'

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
  RowData
} from '@tanstack/react-table'

import { useEffect, useMemo, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { TableBody, TableFooter, Table as ShadcnTable, TableHeader } from '@/components/ui/table'
import { CheckedState } from '@radix-ui/react-checkbox'
import { IBaseData, getId } from '@/core/classes/base-data'
import { FormatColumnType, ModeType, RowSelectType } from './enums'
import TableActionColumn from './base-table-action'
import { BaseTableConfig, rowIdsEditingChangeEvent } from './base-table-config'
import { BaseTableFooter, BaseTableHeader, BaseTableRow } from './base-table-row'
import BaseTablePagination from './base-table-pagination'
import { BaseTableNodata } from './base-table-nodata'
import TableHeaderActions from './base-table-header-action'
import { fuzzyFilter } from './base-table-filter'
// import { useTablePaginatitonParams } from './pagination-params-context'
import { useTableConfig } from './table-config-context'
import { useCustomSearchParams } from '@/core/hooks/useCustomSearchParams'
// import { rankItem, compareItems } from '@tanstack/match-sorter-utils'

export const rowActionId = 'rowAction'
export const rowSelectionId = 'rowSelection'

declare module '@tanstack/react-table' {
  // allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    formatColumnType?: FormatColumnType
    editable?: boolean
  }
}

type TableProps<T extends IBaseData<T>> = {
  data: Array<T>
  tableConfig: BaseTableConfig<T>
}

function handleRowsSelectionChange<T extends IBaseData<T>>(
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
    keys = newKeys.filter((w) => oldKeys.indexOf(w) < 0)
  } else {
    keys = oldKeys.filter((w) => newKeys.indexOf(w) < 0)
  }

  const rowsById = props.tableConfig.table?.getRowModel().rowsById
  if (rowsById && keys.length > 0) {
    keys.forEach((key) => {
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

function GetActions<T extends IBaseData<T>>(row: Row<T>, props: TableProps<T>, mode: ModeType) {
  return (
    <TableActionColumn
      tableAction={{
        isExpanded: row.getIsExpanded(),
        toggleExpandedHandler: row.getToggleExpandedHandler(),
        data: row.original,
        actions: props.tableConfig.getRowActions()
      }}
      menuList={props.tableConfig.isActionColumListType}
      mode={mode}
    />
  )
}

function handleSelection<T extends IBaseData<T>>(
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

export function BaseTable<T extends IBaseData<T>>({ ...props }: { loading: boolean, data: Array<T> }) {
  ///
  const { tableConfigContext, setTableConfigContext } = useTableConfig<T>();
  tableConfigContext.setData(props.data);
  ///
  // const tablePaginationParams = useTablePaginatitonParams();
  const [rowsEditing, setRowsEditing] = useState<Record<string, T>>({ ...tableConfigContext.rowsEditing })
  const [columnPinningState, setColumnPinningState] = useState<ColumnPinningState>({})
  // const [data] = useState(() => [...props.data])
  const [rowSelection, setRowSelection] = useState({})
  const [rowSelectionForHandle, setRowSelectionForHandle] = useState(rowSelection)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>('onChange')
  const { page: pageOnServer, pageSize: pageSizeOnServer } = useCustomSearchParams();
  const [pagination, setPagination] = useState<PaginationState>(() => {
    const value: PaginationState = { pageIndex: tableConfigContext.pageIndexDefault, pageSize: tableConfigContext.pageSizeDefault };
    if (tableConfigContext.pageOnServer) {
      value.pageSize = pageSizeOnServer;
    }
    return value;
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const columns = useMemo<ColumnDef<T, any>[]>(() => {
    if (tableConfigContext.isShowSelectionColumn && tableConfigContext.cols.findIndex(w => w.id == rowSelection) == -1) {
      const selectionColumn: ColumnDef<T, any> = {
        id: rowSelectionId,
        accessorKey: rowSelectionId,
        enableSorting: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
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
              {...(tableConfigContext.isSelectAllPages
                ? {
                  checked: table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && 'indeterminate'),
                  onCheckedChange: (value) => handleSelection(value, RowSelectType.AllPages, undefined, table, { data: props.data, tableConfig: tableConfigContext })
                }
                : {
                  checked: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
                  onCheckedChange: (value) => handleSelection(value, RowSelectType.OnePage, undefined, table, { data: props.data, tableConfig: tableConfigContext })
                })}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className='text-center px-0'>
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                onCheckedChange: (value) => handleSelection(value, RowSelectType.Row, row, undefined, { data: props.data, tableConfig: tableConfigContext })
              }}
            />
          </div>
        )
      }
      setColumnPinningState((old) => {
        old.left = [rowSelectionId, ...tableConfigContext.colsFixLeft]

        return old
      })
      columnPinningState.left = [rowSelectionId, ...tableConfigContext.colsFixLeft]
      tableConfigContext.cols = [selectionColumn, ...tableConfigContext.cols]
    }
    if (tableConfigContext.isShowActionColumn && tableConfigContext.cols.findIndex(w => w.id == rowActionId) == -1) {
      const actionColumn: ColumnDef<T, any> = {
        id: rowActionId,
        accessorKey: rowActionId,
        enableSorting: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        enableResizing: false,
        size: 100,
        minSize: 100,
        maxSize: 100,
        meta: {
          editable: false
        },
        header: () => 'action',
        cell: ({ row }) => {
          const mode = tableConfigContext.rowsEditing[row.id] !== undefined ? ModeType.Edit : ModeType.View
          return GetActions(row, { data: props.data, tableConfig: tableConfigContext }, mode)
        }
      }
      columnPinningState.right = [...tableConfigContext.colsFixRight, rowActionId]

      setColumnPinningState((old) => {
        old.right = [...tableConfigContext.colsFixRight, rowActionId]

        return old
      })
      tableConfigContext.cols.push(actionColumn)
    }

    return tableConfigContext.cols
  }, [tableConfigContext.isShowSelectionColumn, tableConfigContext.isShowActionColumn])

  useEffect(() => {
    setRowSelectionForHandle((old) => {
      handleRowsSelectionChange(old, rowSelection, { data: props.data, tableConfig: tableConfigContext })
      return rowSelection
    })
  }, [props.data, rowSelection, tableConfigContext])


  const handleRowsIdEditingChange = (newValue: Record<string, T>) => {
    setRowsEditing({ ...newValue })
  }

  useEffect(() => {
    tableEventEmitter.on(rowIdsEditingChangeEvent, handleRowsIdEditingChange)
    return () => {
      tableEventEmitter.off(rowIdsEditingChangeEvent, handleRowsIdEditingChange)
    }
  }, [])

  function getRowId(originalRow: T, index: number, parent?: Row<T>): string {
    let keys = tableConfigContext.getKeys(originalRow, tableConfigContext.keys)
    return getId(originalRow, keys, originalRow.__id__)
  }

  tableConfigContext.table = useReactTable({
    data: props.data,
    state: {
      rowSelection,
      sorting,
      pagination,
      columnFilters,
      columnPinning: columnPinningState,
      globalFilter
    },
    filterFns: {
      fuzzy: fuzzyFilter
    },
    defaultColumn: {
      filterFn: filterFns.includesString,
      enableGlobalFilter: true,
      maxSize: 200,
      minSize: 100,

    },
    columns,
    columnResizeMode,
    enableRowSelection: (row) => {
      return tableConfigContext.allowSelectRow(row.original)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getRowId,
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
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy'
  })


  useEffect(() => {
    if (tableConfigContext.pageOnServer) {
      tableConfigContext.table?.setPageSize(pageSizeOnServer);
    }
  }, [pageOnServer, pageSizeOnServer])

  return (
    <div className='mx-auto mb-5 mt-5'>
      <div className='rounded-md border mb-4'>
        <TableHeaderActions<T> searchGlobal={globalFilter} />
        <ShadcnTable
          {...{
            style: {
              // width: props.gridConfig.table.getTotalSize(),
            }
          }}
        >
          <TableHeader className='b primary'>
            {tableConfigContext.table.getHeaderGroups().map((headerGroup) => (
              <BaseTableHeader
                key={headerGroup.id}
                headerGroup={headerGroup}
                columnResizeMode={columnResizeMode}
              />
            ))}
          </TableHeader>
          <TableBody className='border-r-0'>
            {tableConfigContext.table.getRowModel().rows.length === 0 ? (
              <BaseTableNodata colSpan={tableConfigContext.table.getAllColumns().length} />
            ) : (
              tableConfigContext.table
                .getRowModel()
                .rows.map((row) => <BaseTableRow key={row.id} row={row} />)
            )}
          </TableBody>
          <TableFooter>
            {tableConfigContext.table.getFooterGroups().map((footerGroup) => (
              <BaseTableFooter key={footerGroup.id} footerGroup={footerGroup} />
            ))}
          </TableFooter>
        </ShadcnTable>
        <div className='p-4'>
          <BaseTablePagination />
        </div>
      </div>
    </div>
  )
}