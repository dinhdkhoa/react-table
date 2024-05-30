
import { Column } from "@tanstack/react-table"
import { CSSProperties } from "react"
import { BaseGridData } from "./types"

export function getCommonPinningStyles<T extends BaseGridData>(column: Column<T>): CSSProperties {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn =
        isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn =
        isPinned === 'right' && column.getIsFirstColumn('right')

    return {
        boxShadow: isLastLeftPinnedColumn
            ? '-4px 0 4px -4px gray inset'
            : isFirstRightPinnedColumn
                ? '4px 0 4px -4px gray inset'
                : undefined,
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        opacity: isPinned ? 0.95 : 1,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
    }
}

// export const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//         // color: theme.palette.common.black,
//         // backgroundColor: 'grey'
//         fontWeight: 'bold'
//     },
//     [`&.${tableCellClasses.body}`]: {
//         fontSize: 14
//     }
// }))

// export const StyledTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
//     // '&:nth-of-type(odd)': {
//     //     backgroundColor: theme.palette.action.hover
//     // },
//     // hide last border
//     '&:last-of-type td, &:last-of-type th': {
//         border: 0
//     }
// }))

// export const StyledPopper = styled(Popper)(({ theme }) => ({
//     width: 'auto !important',
// }));