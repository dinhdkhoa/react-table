'use client'

import * as React from 'react'

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
} from '@tanstack/react-table'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import GridActionColumn from './enode-grid-action'
import { GridFooter, GridHeader, GridRow } from './enode-grid-row'
import { BaseGridConfig, BaseGridData, RowSelectType } from './types'
import { Checkbox } from '@/components/ui/checkbox'
import { TableBody, TableFooter, Table as ShadcnTable, TableHeader } from '@/components/ui/table'
import GridPagination from './enode-grid-pagination'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Input } from '@/components/ui/input'
import GridHeaderActions from './enode-grid-header-action'

const rowActionId = 'rowAction';
const rowSelectionId = 'rowSelection';

type GridProps<T extends BaseGridData> = {
  data: Array<T>
  gridConfig: BaseGridConfig<T>
}
function handleRowsSelectionChange<T extends BaseGridData>(
  oldState: RowSelectionState,
  newState: RowSelectionState,
  props: GridProps<T>
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

  const rowsById = props.gridConfig.table?.getRowModel().rowsById
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

  if (props.gridConfig.handleRowsSelectionChange) {
    props.gridConfig.handleRowsSelectionChange(isSelected, rows, arrData)
  }
}

function getActions<T extends BaseGridData>(
  row: Row<T>,
  props: GridProps<T>
) {
  return (
    <GridActionColumn
      gridAction={{
        isExpanded: row.getIsExpanded(),
        toggleExpandedHandler: row.getToggleExpandedHandler(),
        data: row.original,
        actions: props.gridConfig.getActions()
      }}
      menuList={props.gridConfig.isActionColumListType}
    />
  )
}

function handleSelection<T extends BaseGridData>(
  checked: CheckedState,
  rowSelectType: RowSelectType,
  row?: Row<T>,
  table?: Table<T>,
  props?: GridProps<T>
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

  if (props?.gridConfig.onSelect) {
    props?.gridConfig.onSelect(checked, rowSelectType, row?.original as any, row?.id)
  }
}

export function ENodeGrid<T extends BaseGridData>(props: {
  data: Array<T>,
  gridConfig: BaseGridConfig<T>
}) {
  const [columnPinningState, setColumnPinningState] = useState<ColumnPinningState>({})
  const [data] = useState(() => [...props.data]);
  const [rowSelection, setRowSelection] = useState({});
  const [rowSelectionForHandle, setRowSelectionForHandle] = useState(rowSelection)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>('onChange')
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: props.gridConfig.pageIndexDefault,
    pageSize: props.gridConfig.pageSizeDefault,
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])



  const columns = useMemo<ColumnDef<T, any>[]>(
    () => {
      if (props.gridConfig.isShowSelectionColumn) {
        const selectionColumn: ColumnDef<T, any> = {
          id: rowSelectionId,
          accessorKey: rowSelectionId,
          enableSorting: false,
          enableColumnFilter: false,
          size: 40,
          minSize: 40,
          maxSize: 40,
          enableResizing: false,
          header: ({ table }) => (
            <div className='text-center px-0'>
              <Checkbox
                {...
                (props.gridConfig.isSelectAllPages ? {
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
          old.left = [rowSelectionId, ...props.gridConfig.colsFixLeft];

          return old;
        })
        columnPinningState.left = [rowSelectionId, ...props.gridConfig.colsFixLeft];
        props.gridConfig.cols = [selectionColumn, ...props.gridConfig.cols];
      }
      if (props.gridConfig.isShowActionColumn) {
        const actionColumn: ColumnDef<T, any> = {
          id: rowActionId,
          accessorKey: rowActionId,
          enableSorting: false,
          enableColumnFilter: false,
          enableResizing: false,
          size: 100,
          minSize: 100,
          maxSize: 100,
          header: () => 'action',
          cell: ({ row }) => {
            return getActions(row, props)
          }
        }
        columnPinningState.right = [...props.gridConfig.colsFixRight, rowActionId];

        setColumnPinningState(old => {
          old.right = [...props.gridConfig.colsFixRight, rowActionId];

          return old;
        })
        props.gridConfig.cols.push(actionColumn);
      }

      return props.gridConfig.cols;
    }, []
  )

  useEffect(() => {
    setRowSelectionForHandle(old => {
      handleRowsSelectionChange(old, rowSelection, props);
      handleRowsSelectionChange(old, rowSelection, props);
      return rowSelection
    })

  }, [rowSelection])

  props.gridConfig.table = useReactTable({

    data,
    state: {
      rowSelection,
      sorting,
      pagination,
      columnFilters,
      columnPinning: columnPinningState
    },
    defaultColumn: {
      filterFn: filterFns.equals,
      maxSize: 200,
      minSize:100
    },
    columns,
    columnResizeMode,
    enableRowSelection: (row) => { return props.gridConfig.allowSelectRow(row.original) },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: row => row.id,
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
      <div className="flex items-center ">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
          Table
        </h1>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(props.gridConfig.table!.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            props.gridConfig.table!.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border mb-4">
        <ShadcnTable {...{
          style: {
            // width: props.gridConfig.table.getTotalSize(),
          },
        }}>

          <TableHeader className='b primary'>
            <GridHeaderActions colspan={columns.length} table={props.gridConfig.table!} />
            {props.gridConfig.table.getHeaderGroups().map(headerGroup => (
              <GridHeader key={headerGroup.id} headerGroup={headerGroup} gridConfig={props.gridConfig} columnResizeMode={columnResizeMode} />
            ))}

          </TableHeader>
          <TableBody className="border-r-0">
            {props.gridConfig.table.getRowModel().rows.map(row => (
              <GridRow key={row.id} row={row} gridConfig={props.gridConfig} />
            ))}
          </TableBody>
          <TableFooter>
            {props.gridConfig.table.getFooterGroups().map(footerGroup => (
              <GridFooter key={footerGroup.id} footerGroup={footerGroup} gridConfig={props.gridConfig} />
            ))}
          </TableFooter>
        </ShadcnTable>
        <GridPagination table={props.gridConfig.table}
        ></GridPagination>
      </div>
    </div>
  )
}

