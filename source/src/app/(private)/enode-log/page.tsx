import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import { PaginationParams } from '@/components/base-table/pagination-params-context';
import { EnodeLogLimitTable, EnodeLogTable } from './_components/enode-log-table';

export default function EnodeLogPage({
  searchParams,
}: {
  searchParams?: PaginationParams;
}) {
  console.log('searchParams', searchParams)
  return <>
    <Suspense fallback={<MySkeleton />}>
      <EnodeLogLimitTable searchParams={searchParams} />
    </Suspense>
    {/* <Suspense fallback={<MySkeleton />}>
      <EnodeLogTable searchParams={searchParams} />
    </Suspense> */}
  </>
}


const MySkeleton = () => {
  return (<Skeleton className="w-full h-[300px] rounded-sm mb-5 mt-5" />)
}
