'use client'

import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { defaultTablePaginatitonParams, pageSizeDefault } from './base-table-config'
import { IBaseData } from '@/core/classes/base-data'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTablePaginatitonParams } from './pagination-params-context'
import { useEffect } from 'react'
import { useTableConfig } from './table-config-context'


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
  const tablePaginatitonParamsContext = useTablePaginatitonParams();

  const router = useRouter();
  const query = useSearchParams();

  const pageSize = Number(tablePaginatitonParamsContext?.paginationParamsContext?.pageSize ?? defaultTablePaginatitonParams.pageSize);
  const page = Number(tablePaginatitonParamsContext?.paginationParamsContext?.page ?? defaultTablePaginatitonParams.page);

  useEffect(() => {
    if (tablePaginatitonParamsContext) {
      if (!tableConfigContext.pageSizeOptionsDefault.includes(pageSize)) {
        tablePaginatitonParamsContext.setPaginationParamsContext!({ pageSize: pageSizeDefault, page: page });
        router.push(`?page=${page}`);
      }
    }
  }, [tablePaginatitonParamsContext])

  const handlePreviousPage = () => {
    if (page > 1 && tablePaginatitonParamsContext?.setPaginationParamsContext) {
      const previousPage = page - 1;
      tablePaginatitonParamsContext.setPaginationParamsContext!({ pageSize: pageSize, page: previousPage });
      if (pageSize != defaultTablePaginatitonParams.pageSize) {
        router.push(`?page=${previousPage}&pageSize=${pageSize}`);
      }
      else {
        router.push(`?page=${previousPage}`);
      }
    }
  }

  const handleFirstPage = () => {
    if (tablePaginatitonParamsContext?.setPaginationParamsContext) {
      const firstPage = 1;
      tablePaginatitonParamsContext.setPaginationParamsContext({ pageSize: pageSize, page: firstPage });
      if (pageSize != defaultTablePaginatitonParams.pageSize) {
        router.push(`?page=${firstPage}&pageSize=${pageSize}`);
      }
      else {
        router.push(`?page=${firstPage}`);
      }
    }
  }

  const handleNextPage = () => {
    if (tablePaginatitonParamsContext?.setPaginationParamsContext) {
      const nextPage = page + 1;
      tablePaginatitonParamsContext.setPaginationParamsContext!({ pageSize: pageSize, page: nextPage });
      if (pageSize != defaultTablePaginatitonParams.pageSize) {
        router.push(`?page=${nextPage}&pageSize=${pageSize}`);
      }
      else {
        router.push(`?page=${nextPage}`);
      }
    }
  }

  const handleNextToLastPage = () => {
    //TODO
    router.push(`?page=${page + 1}&pageSize=${pageSize}`);
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
      tablePaginatitonParamsContext?.setPaginationParamsContext({ page: page, pageSize: _pageSize })
      tableConfigContext.table?.setPageSize(_pageSize);
      router.push(`?page=${page}&pageSize=${_pageSize}`);
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
