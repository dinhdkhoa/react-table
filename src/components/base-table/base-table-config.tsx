import { IBaseData, assignValue, clonePropToKeepData, getId } from '@/core/classes/base-data'
import { CheckedState } from '@radix-ui/react-checkbox'
import { AccessorKeyColumnDef, ColumnDef, Row, SortingFn, Table, createColumnHelper } from '@tanstack/react-table'
import { FormatColumnType, RowSelectType } from './enums'
import { Delete, List, Pencil, Save, X } from 'lucide-react'
import { filterCheckbox, filterNumber, filterOnDate, filterStaticCombobox } from './base-table-filter'
import { DefaultCell } from './base-table-cell'
import { ReactNode } from 'react'
import tableEventEmitter from './events'
import { FieldValues, UseFormReturn } from 'react-hook-form'
import { FieldNames } from '@/core/helper/helper'

export const showChildButtonId = '_row_action_show_child'
export const saveButtonId = '_row_action_save'
export const cancelButtonId = '_row_action_cancel'
export const rowIdsEditingChangeEvent = 'rowsIdsEditingChange'

export interface BaseRowAction<IBaseData extends FieldValues = FieldValues> {
  id: string
  name: string
  iconChild?: ReactNode
  action?: (data: IBaseData, form?: UseFormReturn<IBaseData>) => void
  disableFn?: (data: IBaseData) => boolean
  visibleFn?: (data: IBaseData) => boolean
}

export const isNumberColumn = (columnType: FormatColumnType | undefined) => {
  return columnType && [FormatColumnType.Decimal, FormatColumnType.Integer].includes(columnType)
}

export const isDateColumn = (columnType: FormatColumnType | undefined) => {
  return columnType && [FormatColumnType.Date, FormatColumnType.DateTime].includes(columnType)
}

export class BaseTableConfig<T extends IBaseData<T>> {
  static defaultIconSize = 'h-4 w-4'
  keys: FieldNames<T>[] = ['__id__']
  data: T[] = []
  rowsEditing: Record<string, T> = {}

  constructor(keys?: FieldNames<T>[]) {
    if (keys && keys.length > 0) {
      this.keys = keys
    }
  }

  setData(data: T[]) {
    this.data = data
  }
  get getData() {
    return this.data
  }

  //
  table: Table<T> | undefined
  columnHelper = createColumnHelper<T>()
  cols: AccessorKeyColumnDef<T, any>[] = []
  colsFixLeft: string[] = []
  colsFixRight: string[] = []

  //ModeType
  // mode = ModeType.View;
  allowEditInline = false

  //Pagination
  pageIndexDefault = 0
  pageSizeDefault = 10
  rowsPerPageOptionsDefault = [10, 25, 50, 100]

  //Selection
  isShowSelectionColumn = false
  isSelectAllPages = false //Default là checkbox SelectAll ở header chỉ chọn ở trang hiện tại
  allowSelectRow = (data: T) => true
  onSelect: ((checked: CheckedState, rowSelectType: RowSelectType, data?: T, id?: any) => void) | undefined
  handleRowsSelectionChange: ((checked: boolean, rows: Row<T>[], arrData: T[]) => void) | undefined

  //Action Column
  isActionColumListType = true
  isShowActionColumn = true
  isShowChild = false
  editButton: BaseRowAction<T> = {
    id: '_row_action_edit',
    name: 'Edit',
    iconChild: <Pencil className={BaseTableConfig.defaultIconSize} fontSize='inherit' />,
    action: (data) => {
      this.addRowEditing(getId(data, this.getKeys(data, this.keys), data.__id__) || '', data)
    }
  }
  detailButton: BaseRowAction<T> = {
    id: '_row_action_detail',
    name: 'Detail',
    iconChild: <List className={BaseTableConfig.defaultIconSize} fontSize='inherit' />
  }
  deleteButton: BaseRowAction<T> = {
    id: '_row_action_delete',
    name: 'Delete',
    iconChild: <Delete className={BaseTableConfig.defaultIconSize} fontSize='inherit' />
  }
  saveButton: BaseRowAction<T> = {
    id: '_row_action_save',
    name: 'Save',
    iconChild: <Save className={BaseTableConfig.defaultIconSize} fontSize='inherit' />,
    action: (data, form) => {
      if (form) {
        this.setAfterSaveRow(getId(data, this.getKeys(data, this.keys), data.__id__) || '', data, form)
      }
    }
  }
  cancelButton: BaseRowAction<T> = {
    id: '_row_action_cancel',
    name: 'Cancel',
    iconChild: <X className={BaseTableConfig.defaultIconSize} fontSize='inherit' />,
    action: (data, form) => {
      if (form) {
        this.removeRowEditing(getId(data, this.getKeys(data, this.keys), data.__id__) || '', data, false, form)
      }
    }
  }
  showChildButton: BaseRowAction<T> = {
    id: showChildButtonId,
    name: 'Show Child'
  }
  otherButton: Array<BaseRowAction<T>> = []

  getKeys(data?: T, keys?: FieldNames<T>[]): string[] {
    const _keys = (keys || data?.__keys__ || []) as string[]
    return _keys
  }

  getActions() {
    let actions = [
      this.editButton,
      this.detailButton,
      this.deleteButton,
      this.saveButton,
      this.cancelButton,
      ...this.otherButton
    ]

    if (this.isShowChild) {
      actions = [this.showChildButton, ...actions]
    }

    return actions
  }

  sortingBoolean: SortingFn<T> = (rowA: Row<T>, rowB: Row<T>, columnId: string) => {
    const valueRowA = ((rowA.original as any)[columnId] ?? false).toString()
    const valueRowB = ((rowB.original as any)[columnId] ?? false).toString()
    const val = valueRowA == valueRowB ? 0 : valueRowA > valueRowB ? 1 : -1
    return val
  }

  getRowId(originalRow: T, index: number, parent?: Row<T>): string {
    const keys = this.getKeys(originalRow, this.keys)
    console.log('keys', keys)
    return getId(originalRow, keys, originalRow.__id__) || index.toString()
  }

  getEntityByRow(originalRow: T, index: number, parent?: Row<T>) {
    let rowId = this.getRowId(originalRow, index, parent)
    return this.data.find((w) => getId(w, this.getKeys(originalRow, this.keys), w.__id__) == rowId)
  }

  getEntityByIds(ids: string) {
    return this.data.find((w) => getId(w, this.getKeys(w, this.keys), w.__id__) == ids)
  }

  updateRowValuesCache(rowId: string, newValues: T) {
    if (this.table) {
      const row = this.table!.getRow(rowId)
      if (row) {
        row._valuesCache = { ...row._valuesCache, ...newValues }
      }
    }
  }

  addRowEditing(id: string, keepData: T) {
    if (id) {
      if (!this.rowsEditing[id]) {
        this.rowsEditing[id] = clonePropToKeepData(keepData)
        tableEventEmitter.emit(rowIdsEditingChangeEvent, this.rowsEditing)
      }
    }
  }

  removeRowEditing(id: string, entity: T, saveData?: boolean, form?: UseFormReturn<T>) {
    if (id) {
      delete this.rowsEditing[id]
      if (form) {
        if (saveData) {
          assignValue(entity, form.getValues())
        } else {
          form.reset()
        }
      }
      tableEventEmitter.emit(rowIdsEditingChangeEvent, this.rowsEditing)
    }
  }

  clearRowEditing() {
    const keys = Object.keys(this.rowsEditing)
    keys.forEach((key) => {
      const entity = this.getEntityByIds(key)
      if (entity) {
        this.removeRowEditing(key, entity, false)
      }
    })
    tableEventEmitter.emit(rowIdsEditingChangeEvent, this.rowsEditing)
  }

  setAfterSaveRow(id: string, data: T, form: UseFormReturn<T>) {
    this.removeRowEditing(id, data, true, form)
    this.updateRowValuesCache(id, data)
  }

  init() {
    this.cols.forEach((col) => {
      if (col.meta?.formatColumnType) {
        if (!col.filterFn) {
          if (isDateColumn(col.meta!.formatColumnType)) {
            col.filterFn = filterOnDate
          }
          if ([FormatColumnType.Boolean].includes(col.meta!.formatColumnType)) {
            col.filterFn = filterCheckbox
          }
          if (isNumberColumn(col.meta!.formatColumnType!)) {
            col.filterFn = filterNumber
          }
          if ([FormatColumnType.StaticCombobox].includes(col.meta!.formatColumnType)) {
            col.filterFn = filterStaticCombobox
          }
        }
        if (!col.sortingFn) {
          if ([FormatColumnType.Boolean].includes(col.meta!.formatColumnType!)) {
            col.sortingFn = this.sortingBoolean
          }
        }
      }

      if (!col.cell) {
        col.cell = (info) => DefaultCell(info)
      }
    })
  }
}
