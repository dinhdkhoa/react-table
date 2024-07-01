
import {  IBaseData } from "@/core/classes/base-data"
import { Column } from "@tanstack/react-table"
import { CSSProperties } from "react"
export function getCommonPinningStyles<T extends IBaseData<T>>(column: Column<T>): CSSProperties {
    const isPinned = column.getIsPinned()
    return {
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        opacity: 1,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        minWidth: `${column.columnDef.minSize}px`,
        maxWidth: `${column.columnDef.maxSize}px`,
        zIndex: isPinned ? 1 : 0,
    }
}