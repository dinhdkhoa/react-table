'use client'

import { Cell, ColumnResizeMode, HeaderGroup, Row, SortDirection, flexRender } from '@tanstack/react-table'
import { TableCell, TableHead, TableRow } from '@/components/ui/table'
import React, { useState } from 'react'
import { ArrowDownNarrowWide, ArrowUpDown, ArrowUpNarrowWide } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IBaseData } from '@/core/classes/base-data'
import { getCommonPinningStyles } from './styles'
import { Filter } from './base-table-filter'
import { cn } from '@/lib/utils'
import BaseForm from '../base-form'
import useBaseForm from '@/core/hooks/useBaseForm'
import { IBaseEntityForm } from '@/core/classes/base-entity-form'
import { rowSelectionId } from './base-table'
import { BaseTableCell } from './base-table-cell'
import { useTableConfig } from './table-config-context'


function TableSortLabel(props: { active: boolean; direction: SortDirection }) {
  const size = 'ml-2 h-4 w-4'

  if (!props.active) {
    return <ArrowUpDown className={size} />
  }

  if (props.direction == 'asc') {
    return <ArrowDownNarrowWide className={size} />
  }

  if (props.direction == 'desc') {
    return <ArrowUpNarrowWide className={size} />
  }
}

export function BaseTableHeader<T extends IBaseData<T>>(props: {
  headerGroup: HeaderGroup<T>
  columnResizeMode: ColumnResizeMode
}) {
  const { tableConfigContext } = useTableConfig<T>();
  const [showFilterRow, setShowFilterRow] = useState(tableConfigContext.showFilterRow);

  tableConfigContext.filterAction.onChangeShowHideFilter = (value: boolean) => {
    tableConfigContext.showFilterRow = value;
    setShowFilterRow(value)
  }

  return (
    <TableRow>
      {props.headerGroup.headers.map((header) => {
        const { column } = header
        const firstSort = column.getFirstSortDir()

        return (
          <TableHead
            key={header.id}
            style={{ ...getCommonPinningStyles(column) }}
            className={cn('border first:border-l-0 last:border-r-0', 'bg-background', 'text-center', header.id == rowSelectionId ? '[&:has([role=checkbox])]:pr-2' : '')}
            colSpan={header.colSpan}
          >
            {header.isPlaceholder ? null : (
              column.id == rowSelectionId ? flexRender(header.column.columnDef.header, header.getContext())
                : (<Button
                  variant='ghost'
                  className='capitalize'
                  onClick={(e) => {
                    if (column.getCanSort()) {
                      const toggleSortingHandler = column.getToggleSortingHandler();
                      if (toggleSortingHandler) {
                        toggleSortingHandler(e);
                      }
                    }
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}

                  {column.getCanSort() &&
                    TableSortLabel({
                      active: column.getIsSorted() !== false,
                      direction: column.getIsSorted() == false ? firstSort : (column.getIsSorted() as SortDirection)
                    })}
                </Button>)


            )}
            {header.column.getCanFilter() ? (
              <div hidden={!showFilterRow}>
                <Filter column={header.column} />
              </div>
            ) : null}
          </TableHead>
        )
      })}
    </TableRow>
  )
}

export function BaseTableFormRow<T extends IBaseEntityForm<T>>(props: {
  row: Row<T>
}) {
  const { tableConfigContext } = useTableConfig<T>();
  const [entity] = useState<T>(
    () => tableConfigContext.getEntityByRow(props.row.original, props.row.index, props.row.getParentRow())!
  )
  const { ...baseFormProps } = useBaseForm<T>(entity, false)
  const buildCell = (cell: Cell<T, unknown>) => {
    const formField = baseFormProps.rhf && baseFormProps.rhf[cell.column.id]
    return <BaseTableCell key={cell.id} cell={cell} row={props.row} formField={formField} />
  }

  return (
    <>
      <TableRow>
        <BaseForm<T> {...baseFormProps}>
          {props.row.getVisibleCells().map((cell) => buildCell(cell))}
        </BaseForm>
      </TableRow>
    </>
  )
}

export function BaseTableRow<T extends IBaseData<T>>(props: { row: Row<T> }) {
  const { tableConfigContext } = useTableConfig<T>();
  const rowEditing = tableConfigContext.rowsEditing[props.row.id]

  const buildRow = () => {
    if (rowEditing) {
      return <BaseTableFormRow key={props.row.id} row={props.row as any} />
    }
    return (
      <TableRow>
        {props.row.getVisibleCells().map((cell) => (
          <BaseTableCell key={cell.id} cell={cell} row={props.row} />
        ))}
      </TableRow>
    )
  };

  return (
    <>
      {buildRow()}
      {props.row.getIsExpanded() && tableConfigContext.showChildButton.children != undefined && (
        <TableRow>
          <TableCell colSpan={props.row.getVisibleCells().length}>{tableConfigContext.showChildButton.children(props.row.original)}</TableCell>
        </TableRow>
      )}
    </>
  )
}

export function BaseTableFooter<T extends IBaseData<T>>(props: {
  footerGroup: HeaderGroup<T>
}) {
  return (
    <TableRow>
      {props.footerGroup.headers.map((header) => (
        <TableCell key={header.id} style={{ ...getCommonPinningStyles(header.column) }}>
          {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}
