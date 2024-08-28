'use client'

import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { defaultTablePaginatitonParams } from './base-table-config'
import { IBaseData } from '@/core/classes/base-data'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTableConfig } from './table-config-context'
import { useCustomSearchParams } from '@/core/hooks/useCustomSearchParams'
import { usePageSearchParams } from './context/search-params-context'


export default function BaseTablePagination<T extends IBaseData<T>>() {
  const { tableConfigContext } = useTableConfig<T>();
  if (tableConfigContext.pageOnServer) {
    return <BaseTableServerPagination />
  }
  return <BaseTableClientPagination />
}

function BaseTableClientPagination<T extends IBaseData<T>>() {
  const { tableConfigContext } = useTableConfig<T>()
  return (
    <div className='flex items-center justify-between px-2 '>
      <div className='flex-1 text-sm text-muted-foreground'>
        {tableConfigContext.table!.getFilteredSelectedRowModel().rows.length} of {tableConfigContext.table!.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select
            value={`${tableConfigContext.table!.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              tableConfigContext.table!.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={tableConfigContext.table!.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {tableConfigContext.pageSizeOptionsDefault.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Page {tableConfigContext.table!.getState().pagination.pageIndex + 1} of {tableConfigContext.table!.getPageCount()}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => tableConfigContext.table!.setPageIndex(0)}
            disabled={!tableConfigContext.table!.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => tableConfigContext.table!.previousPage()}
            disabled={!tableConfigContext.table!.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => tableConfigContext.table!.nextPage()}
            disabled={!tableConfigContext.table!.getCanNextPage()}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => tableConfigContext.table!.setPageIndex(tableConfigContext.table!.getPageCount() - 1)}
            disabled={!tableConfigContext.table!.getCanNextPage()}
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}

function BaseTableServerPagination<T extends IBaseData<T>>() {
  const { tableConfigContext } = useTableConfig<T>();
  const router = useRouter();
  const pathname = usePathname();
  const { paginationParams, setPaginationParams, urlSearchParams, setUrlSearchParams, updateSearchParams } = usePageSearchParams();
  // const { updateSearchParams, urlSearchParams, page, pageSize } = useCustomSearchParams();

  const page = (paginationParams.page ?? 0);
  const pageSize = (paginationParams.pageSize ?? 0)

  useEffect(() => {
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  }, [paginationParams])


  const handlePreviousPage = () => {
    if (page > 1) {
      const previousPage = page - 1;
      if (pageSize != defaultTablePaginatitonParams.pageSize) {
        updateSearchParams([{ key: 'pageSize', value: pageSize.toString() }, { key: 'page', value: previousPage.toString() }]);
      }
      else {
        updateSearchParams([{ key: 'page', value: previousPage.toString() }]);
      }
    }
  }

  const handleFirstPage = () => {
    const firstPage = 1;
    if (pageSize != defaultTablePaginatitonParams.pageSize) {
      updateSearchParams([{ key: 'pageSize', value: pageSize.toString() }, { key: 'page', value: firstPage.toString() }]);
    }
    else {
      updateSearchParams([{ key: 'page', value: firstPage.toString() }]);
      router.push(`?page=${firstPage}`);
    }
  }

  const handleNextPage = () => {
    const nextPage = page + 1;
    if (pageSize != defaultTablePaginatitonParams.pageSize) {
      updateSearchParams([{ key: 'pageSize', value: pageSize.toString() }, { key: 'page', value: nextPage.toString() }]);
    }
    else {
      updateSearchParams([{ key: 'page', value: nextPage.toString() }]);
    }
  }

  const handleNextToLastPage = () => {
    //TODO
    // router.push(`?page=${page + 1}&pageSize=${pageSize}`);
  }

  function getCanPreviousPage() {
    return page > 1
  }

  function getCanNextPage() {
    //TODO
    return true;
  }

  function handlePageSizeChanged(value: string): void {
    const _pageSize = Number(value);
    if (!isNaN(_pageSize)) {
      tableConfigContext.table?.setPageSize(_pageSize);
      updateSearchParams([{ key: 'pageSize', value: _pageSize.toString() }]);
    }
  }

  return (
    <div className='flex items-center justify-between px-2 '>
      <div className='flex-1 text-sm text-muted-foreground'>
        {tableConfigContext.table!.getFilteredSelectedRowModel().rows.length} of {tableConfigContext.table!.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={handlePageSizeChanged}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={tableConfigContext.table!.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {tableConfigContext.pageSizeOptionsDefault.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Page {page} of //TODO
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={handleFirstPage}
            disabled={!getCanPreviousPage()}
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={handlePreviousPage}
            disabled={!getCanPreviousPage()}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={handleNextPage}
            disabled={!getCanNextPage()}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={handleNextToLastPage}
            disabled={!getCanNextPage()}
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
