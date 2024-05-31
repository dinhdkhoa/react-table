'use client'

import { CellContext } from "@tanstack/react-table";
import { BaseGridData, FormatColumnType } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

export function DefaultCell<TData extends BaseGridData>(cellContext: CellContext<TData, any>) {
    const { formatColumnType } = cellContext.column.columnDef.meta ?? {}
    if (!formatColumnType) {
        const value = Value<TData, any>(cellContext);

        const type = typeof value;
        if (type === 'string')
            return StringCell(cellContext);
        if (type === "number" || type === "bigint") {
            return DecimalCell(cellContext);
        }
        if (type === "boolean") {
            return BooleanCell(cellContext);
        }
        if (value instanceof Date) {
            return DateTimeCell(cellContext);
        }

        return Value<TData, any>(cellContext) || '';
    }

    switch (formatColumnType) {
        case FormatColumnType.String:
            return StringCell(cellContext);
        case FormatColumnType.Integer:
            return IntegerCell(cellContext);
        case FormatColumnType.Decimal:
            return DecimalCell(cellContext);
        case FormatColumnType.Date:
            return DateCell(cellContext);
        case FormatColumnType.DateTime:
            return DateTimeCell(cellContext);
        case FormatColumnType.Boolean:
            return BooleanCell(cellContext);
        default:
            return Value<TData, any>(cellContext) || '';
    }
}


export function StringCell<TData extends BaseGridData>(
    cellContext: CellContext<TData, string | null | undefined>) {
    const value = Value<TData, string | null | undefined>(cellContext);

    return value || '';
}

export function IntegerCell<TData extends BaseGridData>(
    cellContext: CellContext<TData, number | null | undefined>) {
    const value = Value<TData, number | null | undefined>(cellContext);

    return <div style={{ textAlign: 'right' }} >{value?.toLocaleString() || ''}</div>
}

export function DecimalCell<TData extends BaseGridData>(
    cellContext: CellContext<TData, number | null | undefined>) {
    const value = Value<TData, number | null | undefined>(cellContext);

    return <div style={{ textAlign: 'right' }} >{value?.toLocaleString() || ''}</div>
}

export function DateCell<TData extends BaseGridData>(
    cellContext: CellContext<TData, Date | null | undefined>) {

    const value = Value<TData, Date | null | undefined>(cellContext);

    return value?.toLocaleDateString() || '';
}
export function DateTimeCell<TData extends BaseGridData>(
    cellContext: CellContext<TData, Date | null | undefined>) {
    const value = Value<TData, Date | null | undefined>(cellContext);

    return value?.toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short'
    }) || ''
}

export function BooleanCell<TData extends BaseGridData>(
    cellContext: CellContext<TData, boolean | null | undefined>) {
    const value = Value<TData, boolean | null | undefined>(cellContext);

    return <div style={{ textAlign: 'center' }} >
        <Checkbox checked={value || false} disabled />
    </div>
}

export function Value<TData extends BaseGridData, TValue>(cellContext: CellContext<TData, TValue>) {
    const colId = cellContext.column.id;
    const data = cellContext.row.original;
    if (colId && data) {
        const value = (data as any)[colId] as TValue;

        if (value)
            return value;
    }

    return null as TValue;
}