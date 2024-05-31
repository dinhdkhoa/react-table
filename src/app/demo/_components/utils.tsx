import { FormatColumnType } from "./types"


export const isNumberColumn = (columnType: FormatColumnType | undefined) => {
    return columnType && [FormatColumnType.Decimal, FormatColumnType.Integer].includes(columnType);
}

export const isDateColumn = (columnType: FormatColumnType | undefined) => {
    return columnType && [FormatColumnType.Date, FormatColumnType.DateTime].includes(columnType);
}