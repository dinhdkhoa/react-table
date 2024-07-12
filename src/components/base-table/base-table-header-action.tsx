'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { CirclePlus, Download, Filter, AlignJustify, Columns3, Search } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { BaseTableConfig } from './base-table-config'
import { IBaseData } from '@/core/classes/base-data'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
export default function TableHeaderActions<T extends IBaseData<T>>({ tableConfig }: { tableConfig: BaseTableConfig<T> }) {
  const [dropDownOpen, setDropDownOpen] = useState(false)

  const showHideColumns = () => {
    return tableConfig.showHideColumnsAction.visibleFn && tableConfig.showHideColumnsAction.visibleFn({} as any) && (
      <DropdownMenu open={dropDownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='h-8 w-8 p-0'
            onClick={() => {
              setDropDownOpen(true)
            }}
          >
            <Columns3 className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onPointerDownOutside={() => setDropDownOpen(false)}>
          {tableConfig.table!
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

  const filter = () => {
    return tableConfig.filterAction.visibleFn && tableConfig.filterAction.visibleFn({} as any) &&
      (<TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              // disabled={isDisable}
              className='h-8 w-8 p-0'
              onClick={() => {
                // if (allowAction) {
                //   ac.action!(props.tableAction.data)
                // }
              }}
            >
              <Filter className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tableConfig.filterAction.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>)
  }

  const addNew = () => {
    return tableConfig.addNewAction.visibleFn && tableConfig.addNewAction.visibleFn({} as any) &&
      (<TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>
              Add <CirclePlus className=' ml-1 h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tableConfig.addNewAction.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>)
  }

  const quickSearch = () => {
    return tableConfig.showQuickSearch && <div className="relative flex items-center max-w-2xl ">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform opacity-60" />
      <Input
        placeholder="Quick search"
        className="max-w-sm pl-8"
      />
    </div>
  }

  if (!tableConfig.table)
    return null;

  return (
    <div className='flex justify-between p-2'>
      <div className='flex gap-2 items-center'>
        <h4 className='font-bold'>{tableConfig.tableName || ''}</h4>
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
