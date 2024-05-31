import { ColumnDef, Row, RowData, SortingFn, Table, createColumnHelper } from "@tanstack/react-table"
import { filterCheckbox, filterNumber, filterOnDate } from "./enode-grid-filter"
import { DefaultCell } from "./enode-grid-cell"
import { Delete, List, Pencil } from "lucide-react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { isDateColumn, isNumberColumn } from "./utils";

export const showChildButtonId = '_row_action_show_child';

export enum RowSelectType {
    Row = 'Row',
    AllPages = 'AllPages',
    OnePage = 'OnePage',
}

export enum FormatColumnType {
    String = 'String',
    Integer = 'Integer',
    Decimal = 'Decimal',
    Date = 'Date',
    DateTime = 'DateTime',
    Boolean = 'Boolean'
}

declare module '@tanstack/react-table' {

    // allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
        formatColumnType?: FormatColumnType
    }
}

export interface Person extends BaseGridData {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
    date?: Date,
    active?: boolean
}

export interface BaseGridData {
    __id__?: string
    id?: any
}

export interface BaseRowAction<BaseGridData> {
    id: string,
    name: string,
    iconChild?: any,
    action?: (data: BaseGridData) => void,
    disableFn?: (data: BaseGridData) => boolean,
    visibleFn?: (data: BaseGridData) => boolean,
}


export class BaseGridConfig<T extends BaseGridData> {
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

