import { EnodeLogUsecase } from '@/domain/use-cases/enode-log-usecase'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import ENodeLogLimit from './_components/enode-log-limit-component';
import { PaginationParams, TablePaginationParamsProvider } from '@/components/base-table/pagination-params-context';
import { defaultTablePaginatitonParams, pageSizeOptionsDefault } from '@/components/base-table/base-table-config';
import ENodeLog from './_components/enode-log-component';

export default function EnodeLogPage({
  searchParams,
}: {
  searchParams?: PaginationParams;
}) {
  console.log('searchParams', searchParams)
  return <>
    {/* <Suspense fallback={<MySkeleton />}>
      <EnodeLogLimitTable searchParams={searchParams} />
    </Suspense> */}
    <Suspense fallback={<MySkeleton />}>
      <EnodeLogTable searchParams={searchParams} />
    </Suspense>
  </>
}


async function EnodeLogTable({
  searchParams,
}: {
  searchParams?: PaginationParams;
}) {
  const state = await EnodeLogUsecase.getList({ postPerPage: 100, pageNumber: 0 })
  return <ENodeLog data={state.value || []} />
}

async function EnodeLogLimitTable({
  searchParams,
}: {
  searchParams?: PaginationParams;
}) {

  if (searchParams === undefined) {
    searchParams = {}
  }
  searchParams.pageSize = Number(searchParams?.pageSize ?? defaultTablePaginatitonParams.pageSize);
  searchParams.page = Number(searchParams?.page ?? defaultTablePaginatitonParams.page);
  if (!pageSizeOptionsDefault.includes(searchParams.pageSize)) {
    searchParams.pageSize = defaultTablePaginatitonParams.pageSize;
  }
  const state = await EnodeLogUsecase.getListLimit({ postPerPage: searchParams.pageSize, pageNumber: searchParams.page, totalPage: 10 })

  return (<TablePaginationParamsProvider initValue={{ page: searchParams.page, pageSize: searchParams.pageSize }}>
    <ENodeLogLimit data={state.value || []} />
  </TablePaginationParamsProvider>);
}










const MySkeleton = () => {
  return (<Skeleton className="w-full h-[300px] rounded-sm mb-5 mt-5" />)
}
