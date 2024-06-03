
import { BaseData } from "@/common/classes/base-data"
import { Column } from "@tanstack/react-table"
import { CSSProperties } from "react"
export function getCommonPinningStyles<T extends BaseData>(column: Column<T>): CSSProperties {
    const isPinned = column.getIsPinned()
    // const isLastLeftPinnedColumn =
    //     isPinned === 'left' && column.getIsLastColumn('left')
    // const isFirstRightPinnedColumn =
    //     isPinned === 'right' && column.getIsFirstColumn('right')

    return {
        // boxShadow: isLastLeftPinnedColumn
        //     ? '-4px 0 4px -4px gray inset'
        //     : isFirstRightPinnedColumn
        //         ? '4px 0 4px -4px gray inset'
        //         : undefined,
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        opacity: isPinned ? 0.95 : 1,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        minWidth: `${column.columnDef.minSize}px`,
        maxWidth: `${column.columnDef.maxSize}px`,
        zIndex: isPinned ? 1 : 0,
    }
}