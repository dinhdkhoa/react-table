import { getKeys } from "@/core/anotations/key";
import { BaseData } from "@/core/classes/base-data";
import { IActivator } from "@/core/types/activator.types";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ColumnDef, Row, SortingFn, Table, createColumnHelper } from "@tanstack/react-table";
import { FormatColumnType, ModeType, RowSelectType } from "./enums";
import { Delete, List, Pencil, Save, X } from "lucide-react";
import { filterCheckbox, filterNumber, filterOnDate } from "./base-table-filter";
import { DefaultCell } from "./base-table-cell";
import { ReactNode } from "react";
import tableEventEmitter from "./events";


export const showChildButtonId = '_row_action_show_child';
export const saveButtonId = '_row_action_save';
export const cancelButtonId = '_row_action_cancel';
export const rowIdsEditingChangeEvent = 'rowsIdsEditingChange'

export interface BaseRowAction<BaseData> {
    id: string,
    name: string,
    iconChild?: ReactNode,
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
    static defaultIconSize = "h-4 w-4";
    keys: string[] = [];
    data: T[] = [];
    rowIdsEditing: string[] = [];

    constructor(classT: IActivator<T>) {
        const t = new classT();
        this.keys.push(...getKeys(t))
    }

    setData(data: T[]) {
        this.data = data;
    }
    get getData() {
        return this.data;
    }

    //
    table: Table<T> | undefined;
    columnHelper = createColumnHelper<T>()
    cols: ColumnDef<T>[] = [];
    colsFixLeft: string[] = [];
    colsFixRight: string[] = [];

    //ModeType
    // mode = ModeType.View;
    allowEditInline = false;

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
    editButton: BaseRowAction<T> = {
        id: '_row_action_edit', name: 'Edit', iconChild: <Pencil className={BaseTableConfig.defaultIconSize} fontSize='inherit' />,
        action: (data) => {
            this._addRowEditing(data.getId(this.keys ?? '') || '');
        }
    };
    detailButton: BaseRowAction<T> = { id: '_row_action_detail', name: 'Detail', iconChild: <List className={BaseTableConfig.defaultIconSize} fontSize='inherit' /> };
    deleteButton: BaseRowAction<T> = { id: '_row_action_delete', name: 'Delete', iconChild: <Delete className={BaseTableConfig.defaultIconSize} fontSize='inherit' /> };

    saveButton: BaseRowAction<T> = {
        id: '_row_action_save', name: 'Save', iconChild: <Save className={BaseTableConfig.defaultIconSize} fontSize='inherit' />,
        action: (data) => {
            this._removeRowEditing(data.getId(this.keys ?? '') || '')
        }
    };
    cancelButton: BaseRowAction<T> = {
        id: '_row_action_cancel', name: 'Cancel', iconChild: <X className={BaseTableConfig.defaultIconSize} fontSize='inherit' />,
        action: (data) => {
            this._removeRowEditing(data.getId(this.keys ?? '') || '')
        }
    };

    showChildButton: BaseRowAction<T> = {
        id: showChildButtonId, name: 'Show Child'
    };
    otherButton: Array<BaseRowAction<T>> = [];

    getActions() {
        let actions = [this.editButton,
        this.detailButton,
        this.deleteButton, this.saveButton, this.cancelButton, ...this.otherButton];

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

    getRowId(originalRow: T, index: number, parent?: Row<T>): string {
        if (this.keys && Array.isArray(this.keys) && this.keys.length > 0) {
            let keyValues: string[] = [];
            this.keys.forEach(k => {
                keyValues.push(((originalRow as any)[k] ?? 'null').toString());
            })
            return keyValues.join('_');
        }
        return originalRow.__id__ || index.toString()
    }

    getEntityByRow(originalRow: T, index: number, parent?: Row<T>) {
        let rowId = this.getRowId(originalRow, index, parent);
        return this.data.find(w => w.getId && w.getId(this.keys) == rowId);
    }

    _addRowEditing(id: string) {
        if (id) {
            if (!this.rowIdsEditing.includes(id)) {
                this.rowIdsEditing.push(id);
                tableEventEmitter.emit(rowIdsEditingChangeEvent, this.rowIdsEditing)
            }
        }
    }
    _removeRowEditing(id: string) {
        if (id) {
            this.rowIdsEditing = this.rowIdsEditing.filter(w => w != id);
            tableEventEmitter.emit(rowIdsEditingChangeEvent, this.rowIdsEditing)
        }
    }
    _clearRowEditing() {
        this.rowIdsEditing = [];
        tableEventEmitter.emit(rowIdsEditingChangeEvent, this.rowIdsEditing)
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

