'use client'

import { Cell, CellContext, flexRender, Row } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { IBaseData } from '@/core/classes/base-data'
import { FormatColumnType } from './enums'
import { TableCell } from '../ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { rowActionId, rowSelectionId } from './base-table'
import BaseDynamicControl from '../base-form/form-controls/base-dynamic-control-form'
import { cn } from '@/lib/utils'
import { BaseTableConfig } from './base-table-config'
import { getCommonPinningStyles } from './styles'
import { useState } from 'react'
import { RHFOptions } from '@/core/anotations/rhf-field'

export function BaseTableCell<T extends IBaseData<T>>(props: { cell: Cell<T, unknown>; row: Row<T>; tableConfig: BaseTableConfig<T>; formField?: RHFOptions<T> }) {
  const { editable, breakAll } = props.cell.column.columnDef.meta ?? {};

  const className = useState(() => {
    const result: string[] = [];
    result.push('border-r last:border-r-0');
    if (props.cell.column.getIsPinned()) result.push('bg-background');
    if ([rowActionId, rowSelectionId].includes(props.cell.column.id)) {
      result.push('text-center');
    }
    else if (breakAll) {
      result.push('break-all');
    }
    else {
      result.push('truncate');
    }

    return result.join(' ');
  })

  const buildCell = () => {
    if ([rowActionId, rowSelectionId].includes(props.cell.column.id)) {
      return flexRender(props.cell.column.columnDef.cell, props.cell.getContext());
    }

    if (props.tableConfig.rowsEditing[props.row.id] !== undefined && (editable ?? false) && props.formField) {
      return (
        <div className='items-center'>
          <BaseDynamicControl name={props.cell.column.id} showLabel={'hidden'} />
        </div>
      );
    }

    return (<TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{flexRender(props.cell.column.columnDef.cell, props.cell.getContext())}</span>
        </TooltipTrigger>
        <TooltipContent>
          {flexRender(props.cell.column.columnDef.cell, props.cell.getContext())}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>)
  }

  return (<TableCell
    style={{ ...getCommonPinningStyles(props.cell.column) }}
    className={cn(className)}
  >
    {buildCell()}
  </TableCell>)
}

export function DefaultCell<TData extends IBaseData<TData>>(cellContext: CellContext<TData, any>) {
  const { formatColumnType } = cellContext.column.columnDef.meta ?? {}
  if (!formatColumnType) {
    const value = Value<TData, any>(cellContext)

    const type = typeof value
    if (type === 'string') return StringCell(cellContext)
    if (type === 'number' || type === 'bigint') {
      return DecimalCell(cellContext)
    }
    if (type === 'boolean') {
      return BooleanCell(cellContext)
    }
    if (value instanceof Date) {
      return DateTimeCell(cellContext)
    }
    if (type === 'object') {
      return JSON.stringify(Value<TData, any>(cellContext) || '')
    }

    return Value<TData, any>(cellContext) || ''
  }

  switch (formatColumnType) {
    case FormatColumnType.String:
      return StringCell(cellContext)
    case FormatColumnType.Integer:
      return IntegerCell(cellContext)
    case FormatColumnType.Decimal:
      return DecimalCell(cellContext)
    case FormatColumnType.Date:
      return DateCell(cellContext)
    case FormatColumnType.DateTime:
      return DateTimeCell(cellContext)
    case FormatColumnType.Boolean:
      return BooleanCell(cellContext)
    case FormatColumnType.StaticCombobox:
      return StaticComboboxCell(cellContext)
    default:
      return Value<TData, any>(cellContext) || ''
  }
}

export function StringCell<TData extends IBaseData<TData>>(cellContext: CellContext<TData, string | null | undefined>) {
  const value = Value<TData, string | null | undefined>(cellContext)

  return value || ''
}

export function IntegerCell<TData extends IBaseData<TData>>(
  cellContext: CellContext<TData, number | null | undefined>
) {
  const value = Value<TData, number | null | undefined>(cellContext)

  return <div style={{ textAlign: 'right' }}>{value?.toLocaleString() || ''}</div>
}

export function DecimalCell<TData extends IBaseData<TData>>(
  cellContext: CellContext<TData, number | null | undefined>
) {
  const value = Value<TData, number | null | undefined>(cellContext)

  return <div style={{ textAlign: 'right' }}>{value?.toLocaleString() || ''}</div>
}

export function DateCell<TData extends IBaseData<TData>>(cellContext: CellContext<TData, Date | null | undefined>) {
  const value = Value<TData, Date | null | undefined>(cellContext)

  return value?.toLocaleDateString() || ''
}
export function DateTimeCell<TData extends IBaseData<TData>>(cellContext: CellContext<TData, Date | null | undefined>) {
  const value = Value<TData, Date | null | undefined>(cellContext)

  return (
    value?.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }) || ''
  )
}

export function BooleanCell<TData extends IBaseData<TData>>(
  cellContext: CellContext<TData, boolean | null | undefined>
) {
  const value = Value<TData, boolean | null | undefined>(cellContext)

  return (
    <div style={{ textAlign: 'center' }}>
      <Checkbox checked={value || false} disabled />
    </div>
  )
}

export function StaticComboboxCell<TData extends IBaseData<TData>>(
  cellContext: CellContext<TData, string | number | null | undefined>
) {
  const { staticSelectOption } = cellContext.column.columnDef.meta ?? {}
  if (staticSelectOption) {
    const value = Value<TData, string | number | null | undefined>(cellContext)
    const findEntityCbo = staticSelectOption.data.find((w) => staticSelectOption.value(w) == value)
    if (!value && !findEntityCbo) return ''
    if (findEntityCbo) {
      const displayText = staticSelectOption.display(findEntityCbo);
      if (cellContext.row.cacheDisplay === undefined) { cellContext.row.cacheDisplay = {} }
      cellContext.row.cacheDisplay[cellContext.column.id] = displayText;
      return displayText;
    }
    return 'N/A'
  }

  return ''
}

export function Value<TData extends IBaseData<TData>, TValue>(cellContext: CellContext<TData, TValue>) {
  const colId = cellContext.column.id
  const data = cellContext.row.original
  if (colId && data) {
    const value = (data as any)[colId] as TValue

    if (value !== undefined && value !== null) return value
  }

  return null as TValue
}
