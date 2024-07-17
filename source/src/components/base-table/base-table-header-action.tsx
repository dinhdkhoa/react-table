'use client'

import { CirclePlus, Filter, Search, X, EyeOff, Eye, Settings2, FilterX } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useEffect, useState } from 'react'
import { IBaseData } from '@/core/classes/base-data'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useTableConfig } from './table-config-context'
export default function TableHeaderActions<T extends IBaseData<T>>({ searchGlobal }: { searchGlobal: string | number }) {
  const { tableConfigContext } = useTableConfig<T>();
  const [dropDownShowHideColumnOpen, setDropDownShowHideColumnOpen] = useState(false)
  const [dropDownFilter, setDropDownFilter] = useState(false)

  const showHideColumns = () => {
    return tableConfigContext.showHideColumnsAction.visibleFn && tableConfigContext.showHideColumnsAction.visibleFn({} as any) && (
      <DropdownMenu open={dropDownShowHideColumnOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='h-8 w-8 p-0'
            onClick={() => {
              setDropDownShowHideColumnOpen(true)
            }}
          >
            <Settings2 className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onPointerDownOutside={() => setDropDownShowHideColumnOpen(false)}>
          {tableConfigContext.table!
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  function handleOnSelectShowHideFilter(event: Event): void {
    setDropDownFilter(false);
    if (tableConfigContext.filterAction.onChangeShowHideFilter) {
      tableConfigContext.filterAction.onChangeShowHideFilter(!tableConfigContext.showFilterRow);
    }
  }
  function handleOnClearFilter(event: Event): void {
    setDropDownFilter(false);
  }

  const filter = () => {
    return tableConfigContext.filterAction.visibleFn && tableConfigContext.filterAction.visibleFn({} as any) &&
      <DropdownMenu open={dropDownFilter}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='h-8 w-8 p-0'
            onClick={() => {
              setDropDownFilter(true)
            }}
          >
           {tableConfigContext.showFilterRow ? <Filter className='h-4 w-4' /> : <FilterX className='h-4 w-4' />} 
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onPointerDownOutside={() => setDropDownFilter(false)}>
          <DropdownMenuItem
            key={'clear_filter'}
            onSelect={handleOnClearFilter}
          >
            <X
              className={'mr-2 min-h-4 min-w-4 h-4 w-4'}
            />  Clear filter
          </DropdownMenuItem>
          <DropdownMenuItem
            key={'show_hide_filter'}
            onSelect={handleOnSelectShowHideFilter}
          >
            {tableConfigContext.showFilterRow ? <EyeOff
              className={'mr-2 min-h-4 min-w-4 h-4 w-4'}
            /> : <Eye
              className={'mr-2 min-h-4 min-w-4 h-4 w-4'}
            />}
            {tableConfigContext.showFilterRow ? 'Hide filter' : 'Show filter'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu >
  }

  const addNew = () => {
    return tableConfigContext.addNewAction.visibleFn && tableConfigContext.addNewAction.visibleFn({} as any) &&
      (<TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>
              Add <CirclePlus className=' ml-1 h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tableConfigContext.addNewAction.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>)
  }

  const quickSearch = () => {
    return tableConfigContext.isShowQuickSearch && <div className="relative flex items-center max-w-2xl ">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform opacity-60" />
      <QuickSearchInput
        value={searchGlobal}
        onChange={value => tableConfigContext.table!.setGlobalFilter(String(value))}
      />

    </div>
  }

  if (!tableConfigContext.table)
    return null;

  return (
    <div className='flex justify-between p-2'>
      <div className='flex gap-2 items-center'>
        <h4 className='font-bold'>{tableConfigContext.tableName || ''}</h4>
      </div>
      <div className='flex justify-end gap-2 items-center'>
        {quickSearch()}
        {showHideColumns()}
        {filter()}
        {addNew()}
      </div>
    </div>
  )
}


function QuickSearchInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input
      {...props}
      value={value}
      placeholder="Quick search"
      className="max-w-sm pl-8"
      onChange={e => setValue(e.currentTarget.value)}
    />
  )
}