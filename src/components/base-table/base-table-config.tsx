import { getKeys } from "@/common/anotations/key";
import { BaseData } from "@/common/classes/base-data";
import { IActivator } from "@/common/interfaces/activator";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ColumnDef, Row, SortingFn, Table, createColumnHelper } from "@tanstack/react-table";
import { FormatColumnType, RowSelectType } from "./enums";
import { Delete, List, Pencil } from "lucide-react";
import { filterCheckbox, filterNumber, filterOnDate } from "./base-table-filter";
import { DefaultCell } from "./base-table-cell";


export const showChildButtonId = '_row_action_show_child';

export interface BaseRowAction<BaseData> {
    id: string,
    name: string,
    iconChild?: any,
    action?: (data: BaseData) => void,
    disableFn?: (data: BaseData) => boolean,
    visibleFn?: (data: BaseData) => boolean,
}

export const isNumberColumn = (columnType: FormatColumnType | undefined) => {
    return columnType && [FormatColumnType.Decimal, FormatColumnType.Integer].includes(columnType);
}

export const isDateColumn = (columnType: FormatColumnType | undefined) => {
    return columnType && [FormatColumnType.Date, FormatColumnType.DateTime].includes(columnType);
}

export class BaseTableConfig<T extends BaseData> {
    keys: string[] = [];

    constructor(classT: IActivator<T>) {
        const t = new classT();
        this.keys.push(...getKeys(t))
    }

    //
    table: Table<T> | undefined;
    columnHelper = createColumnHelper<T>()
    cols: ColumnDef<T>[] = [];
    colsFixLeft: string[] = [];
    colsFixRight: string[] = [];

    //Pagination
    pageIndexDefault = 0;
    pageSizeDefault = 10;
    rowsPerPageOptionsDefault = [10, 25, 50, 100]

    //Selection
    isShowSelectionColumn = false;
    isSelectAllPages = false; //Default là checkbox SelectAll ở header chỉ chọn ở trang hiện tại
    allowSelectRow = (data: T) => true;
    onSelect: ((checked: CheckedState, rowSelectType: RowSelectType, data?: T, id?: any) => void) | undefined;
    handleRowsSelectionChange: ((checked: boolean, rows: Row<T>[], arrData: T[]) => void) | undefined;

    //Action Column
    isActionColumListType = true;
    isShowActionColumn = true;
    isShowChild = false;
    editButton: BaseRowAction<T> = { id: '_row_action_edit', name: 'Edit', iconChild: <Pencil fontSize='inherit' /> };
    detailButton: BaseRowAction<T> = { id: '_row_action_detail', name: 'Detail', iconChild: <List fontSize='inherit' /> };
    deleteButton: BaseRowAction<T> = { id: '_row_action_delete', name: 'Delete', iconChild: <Delete fontSize='inherit' /> };
    showChildButton: BaseRowAction<T> = {
        id: showChildButtonId, name: 'Show Child'
    };
    otherButton: Array<BaseRowAction<T>> = []

    getActions() {
        let actions = [this.editButton,
        this.detailButton,
        this.deleteButton, ...this.otherButton];

        if (this.isShowChild) {
            actions = [this.showChildButton, ...actions];
        }

        return actions;
    }

    sortingBoolean: SortingFn<T> = (rowA: Row<T>, rowB: Row<T>, columnId: string) => {
        const valueRowA = ((rowA.original as any)[columnId] ?? false).toString();
        const valueRowB = ((rowB.original as any)[columnId] ?? false).toString();
        const val = (valueRowA == valueRowB) ? 0 : ((valueRowA > valueRowB) ? 1 : -1);
        return val;
    }

    init() {
        this.cols.forEach(col => {
            if (col.meta?.formatColumnType) {
                if (!col.filterFn) {
                    if (isDateColumn(col.meta!.formatColumnType!)) {
                        col.filterFn = filterOnDate
                    }
                    if ([FormatColumnType.Boolean].includes(col.meta!.formatColumnType!)) {
                        col.filterFn = filterCheckbox
                    }
                    if (isNumberColumn(col.meta!.formatColumnType!)) {
                        col.filterFn = filterNumber
                    }
                }
                if (!col.sortingFn) {
                    if ([FormatColumnType.Boolean].includes(col.meta!.formatColumnType!)) {
                        col.sortingFn = this.sortingBoolean;
                    }
                }
            }

            if (!col.cell) {
                col.cell = (info) => DefaultCell(info);
            }
        })
    }
}

