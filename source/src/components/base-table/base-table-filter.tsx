'use client'

import { CellContext, Column, FilterFn, Row, RowData } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { IBaseData } from '@/core/classes/base-data'
import { isNumberColumn } from './base-table-config'
import { FormatColumnType } from './enums'
import { SelectOption } from '@/core/types/control.types'
import { Input } from '../ui/input'
import useDebounce from '@/core/hooks/useDebound'

import {
  RankingInfo,
  rankItem,
} from '@tanstack/match-sorter-utils'
import { StaticComboboxCell } from './base-table-cell'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'unique',
    breakAll?: boolean,
    staticSelectOption?: SelectOption<any, any>
    cacheDisplayText?: any
  }

  interface Row<TData> {
    cacheDisplay?: Record<string, any>;
  }

  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const { formatColumnType } = row._getAllCellsByColumnId()[columnId]?.column?.columnDef?.meta ?? {};
  if (formatColumnType == FormatColumnType.StaticCombobox) {
    if (row.cacheDisplay === undefined) {
      row.cacheDisplay = {}
    }
    if (row.cacheDisplay[columnId] === undefined) {
      const cellContext = row._getAllCellsByColumnId()[columnId]?.getContext();
      if (cellContext) {
        const comboboxDisplayValue = StaticComboboxCell(row._getAllCellsByColumnId()[columnId].getContext() as CellContext<any, any>);
        row.cacheDisplay[columnId] = comboboxDisplayValue;
      }
    }
    const itemRank = rankItem(row.cacheDisplay[columnId], value, { threshold: 3 })
    addMeta({
      itemRank,
    })
    return itemRank.passed
  }

  const itemRank = rankItem(row.getValue(columnId), value, { threshold: 3 })
  addMeta({
    itemRank,
  })
  return itemRank.passed
}


type CheckBoxFilterType = string | null | undefined
type DateFilterType = Date | null | undefined
type StaticComboboxFilterType = string | number | null | undefined

export function filterOnDate<T extends IBaseData<T>>(row: Row<T>, columnId: string, filterValue: DateFilterType) {
  if (!filterValue) {
    return true
  }

  const value = row.getValue<DateFilterType>(columnId)
  if (!value) return false

  const result =
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime() ===
    new Date(filterValue.getFullYear(), filterValue.getMonth(), filterValue.getDate()).getTime()

  return result

  // if (row.original && columnId in row.original) {
  //     // const value = row.original[columnId as keyof T] as (DateFilterType);
  //     const value = row.getValue<DateFilterType>(columnId);
  //     if (!value) return false;

  //     const result = new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime() ===
  //         new Date(filterValue.getFullYear(), filterValue.getMonth(), filterValue.getDate()).getTime();

  //     return result;
  // }

  // return false;
}

export function filterCheckbox<T extends IBaseData<T>>(row: Row<T>, columnId: string, filterValue: CheckBoxFilterType) {
  if (filterValue === 'any') return true

  const value = row.getValue(columnId)
  const filterValueBoolean = filterValue === 'true'
  return (value || false) === filterValueBoolean
  // row.getValue(columnId);
  // if (row.original && columnId in row.original) {
  //     const filterValueBoolean = filterValue === 'true';
  //     // const value = row.original[columnId as keyof T] as (boolean | null | undefined);
  //     const value = row.getValue(columnId);
  //     return (value || false) === filterValueBoolean;
  // }

  // return false;
}

export function filterNumber<T extends IBaseData<T>>(
  row: Row<T>,
  columnId: string,
  filterValue: StaticComboboxFilterType
) {
  if (!filterValue) {
    return true
  }

  const value = row.getValue(columnId)
  return !isNaN(Number(filterValue)) && value === Number(filterValue)

  // if (row.original && columnId in row.original && !isNaN(Number(filterValue))) {
  //     // const value = row.original[columnId as keyof T] as (number | null | undefined);
  //     const value = row.getValue(columnId);
  //     const filterValueNum = Number(filterValue)
  //     if (!value) return false;

  //     return value === filterValueNum;
  // }

  // return false;
}

export function filterStaticCombobox<T extends IBaseData<T>>(
  row: Row<T>,
  columnId: string,
  filterValue: StaticComboboxFilterType
) {
  if (!filterValue) {
    return true
  }

  const value = row.getValue(columnId)
  return value === filterValue

  // if (row.original && columnId in row.original) {
  //     // const value = row.original[columnId as keyof T] as StaticComboboxFilterType;
  //     const value = row.getValue(columnId);
  //     return value === filterValue;
  // }

  // return false;
}

export function Filter({ column }: { column: Column<any, unknown> }) {
  const { filterVariant, formatColumnType } = column.columnDef.meta ?? {}
  const columnFilterValue = column.getFilterValue()

  const buildWidthPopOver = useMemo(() => {
    return `w-[${column.getSize()}px] max-w-[${column.columnDef.maxSize}px] min-w-[${column.columnDef.minSize}px]`
  }, [column])


  const sortedUniqueValues = useMemo(
    () => filterVariant === 'unique' ? Array.from(column.getFacetedUniqueValues().keys()) : []
      .sort()
      .slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant]
  );

  const isNumberCol = isNumberColumn(formatColumnType)

  if (!formatColumnType) {
    return (
      <FilterInput
        initValue={columnFilterValue as string | number | undefined}
        placeholder='Filter'
        column={column}
        isNumberCol={isNumberCol ?? false}
      />
    )
  }

  if (isNumberCol || [FormatColumnType.String].includes(formatColumnType)) {
    if (filterVariant === 'unique') {
      return (
        <FilterAutocomplete
          
          initValue={columnFilterValue}
          popOverContentWidth={buildWidthPopOver}
          options={sortedUniqueValues}
          onChange={value => {
            column.setFilterValue(value)
          }}
        />
      );
    }
    return (
      <FilterInput
        initValue={columnFilterValue as string | number | undefined}
        placeholder='Filter'
        column={column}
        isNumberCol={isNumberCol ?? false}
      />
    )
  }

  if ([FormatColumnType.StaticCombobox].includes(formatColumnType)) {
    const { staticSelectOption } = column.columnDef.meta ?? {}
    if (staticSelectOption) {
      return (
        <FilterStaticCombobox
          initValue={columnFilterValue as StaticComboboxFilterType}
          selectOption={staticSelectOption}
          onChange={(value) => {
            column.setFilterValue(value)
          }}
          popOverContentWidth={buildWidthPopOver}
        />
      )
    }
    return null
  }

  if ([FormatColumnType.Boolean].includes(formatColumnType)) {
    return <FilterCheckbox initValue={columnFilterValue === undefined ? 'any' : columnFilterValue as string} onChange={(value) => column.setFilterValue(value)} />
  }

  if ([FormatColumnType.Date, FormatColumnType.DateTime].includes(formatColumnType)) {
    return (
      <FilterDate
        initValue={(columnFilterValue) as DateFilterType}
        onChange={(value) => column.setFilterValue(value)}
      />
    )
  }
}

function FilterCheckbox({ initValue, onChange }: { initValue: string, onChange: (value: CheckBoxFilterType) => void }) {
  const allValue = 'any'
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<CheckBoxFilterType>(allValue)

  useEffect(() => {
    onChange(value)
  }, [value])

  useEffect(() => {
    if ((initValue === 'any')) {
      setValue(allValue);
    }
  }, [initValue])

  const checkState = [
    { value: allValue, label: 'Any' },
    { value: 'true', label: 'Checked' },
    { value: 'false', label: 'Unchecked' }
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between bg-transparent border-x-0 rounded-none border-b-0'
        >
          <span className='truncate'>
            {value ? checkState.find((state) => state.value === value)?.label : 'Filter'}
          </span>
          {value !== allValue ? (
            clearFilter(() => setValue(allValue))
          ) : (
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-max p-0'>
        <Command>
          <CommandGroup>
            <CommandList>
              {checkState.map((state) => (
                <CommandItem
                  key={state.value}
                  value={state.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? allValue : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === state.value ? 'opacity-100' : 'opacity-0')} />
                  {state.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function FilterDate({ initValue, onChange }: { initValue: DateFilterType; onChange: (value: DateFilterType) => void }) {
  const [date, setDate] = useState<DateFilterType>(initValue)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    onChange(date)
  }, [date])

  useEffect(() => {
    if ((initValue === undefined)) {
      setDate(undefined);
    }
  }, [initValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='w-full justify-between bg-transparent border-x-0 rounded-none border-b-0'>
          <span className='truncate'>{date ? date.toLocaleDateString() : 'Filter'}</span>
          {initValue ? clearFilter(() => setDate(null)) : <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date || undefined}
          onSelect={(e) => {
            setDate(e)
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

const clearFilter = (onClick: () => void) => (
  <X
    onClick={(e) => {
      e.stopPropagation()
      onClick()
    }}
    className='ml-2 h-4 w-4 shrink-0'
  />
)

type OptionAutoComplete = {
  value: any,
  label: any
}

function FilterAutocomplete({
  initValue,
  options,
  onChange,
  popOverContentWidth
}: {
  initValue: any
  options: any[]
  onChange: (value: any) => void
  popOverContentWidth: string
}) {
  const [values, setValues] = useState<OptionAutoComplete[]>([])
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<any>(initValue)

  useEffect(() => {
    onChange(value)
  }, [value])

  useEffect(() => {
    const map = options.map<OptionAutoComplete>((option) => ({ value: option, label: option }));
    setValues(map);
  }, [options])

  useEffect(() => {
    if ((initValue === undefined)) {
      setValue(undefined);
    }
  }, [initValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between border-x-0 rounded-none border-b-0'>
          <span className='truncate'>
            {value ? values.find((option) => option.value == value)?.label?.toString() : 'Filter'}
          </span>
          {value ? (
            clearFilter(() => setValue(undefined))
          ) : (
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('max-w-sm p-0', popOverContentWidth)}>
        <Command>
          <CommandInput placeholder='Search...' />
          <CommandEmpty>No data found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {values.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue == value ? undefined : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn('mr-2 min-h-4 min-w-4 h-4 w-4', value == option.value ? 'opacity-100' : 'opacity-0')}
                  />
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function FilterStaticCombobox({
  initValue,
  selectOption,
  onChange,
  popOverContentWidth
}: {
  initValue: StaticComboboxFilterType
  selectOption: SelectOption<any, any>
  onChange: (value: any) => void
  popOverContentWidth: string
}) {
  const placeholder = 'Filter'
  const [open, setOpen] = useState(false)
  const [currentValue, setCurrentValue] = useState(initValue)

  const display = useMemo(() => {
    const _value = currentValue
    if (_value) {
      const findItem = selectOption.data.find((basicItem) => selectOption.value(basicItem) == _value)
      if (findItem) {
        return selectOption.display(findItem) || ''
      }
      return 'N/A'
    }

    return placeholder
  }, [currentValue, selectOption])

  const getKey = (item: any) => {
    return selectOption!.value(item)?.toString()
  }

  const getValue = (item: any) => {
    const value = selectOption.value(item)
    return value
  }

  const getItemDisplay = (item: any) => {
    const value = selectOption.display(item)
    return value
  }

  const handleChange = (e: any) => {
    setCurrentValue(e)
    onChange(e)
  }

  useEffect(() => {
    if ((initValue === undefined)) {
      setCurrentValue(undefined);
    }
  }, [initValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' role='combobox' className={cn('justify-between w-full bg-transparent border-x-0 rounded-none border-b-0')}>
          <span className='truncate'>{currentValue ? display : placeholder}</span>
          {currentValue ? (
            clearFilter(() => {
              handleChange(undefined)
            })
          ) : (
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('max-w-sm p-0', popOverContentWidth)}>
        <Command>
          <CommandInput placeholder='Search...' />
          <CommandList>
            <CommandEmpty>{`No data found`}</CommandEmpty>
            <CommandGroup>
              {selectOption.data.map((item) => (
                <CommandItem
                  value={getItemDisplay(item)}
                  key={getKey(item)}
                  onSelect={() => {
                    const val = getValue(item)
                    handleChange(val)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 min-h-4 min-w-4 h-4 w-4',
                      getValue(item) === currentValue ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {selectOption!.display(item)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


function FilterInput({ initValue, placeholder, column, isNumberCol }: { initValue: string | number | undefined, placeholder: string, column: Column<any, unknown>, isNumberCol: boolean }) {
  const [searchText, setSearchText] = useState(initValue || '');
  const debounceValue = useDebounce(searchText);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchText(value);
  }

  useEffect(() => {
    if ((initValue === undefined)) {
      setSearchText('');
    }
  }, [initValue])


  useEffect(() => {
    column.setFilterValue(searchText)
  }, [column, debounceValue, searchText]);

  return (
    <Input
      value={searchText}
      className='border-x-0 rounded-none border-b-0'
      name={column.id}
      placeholder={placeholder}
      onChange={handleChange}
      type={isNumberCol ? 'number' : 'text'}
    />
  );
};