import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import { EnodeLogLimitTable, EnodeLogTable } from './_components/enode-log-table';
import { defaultTablePaginatitonParams } from '@/components/base-table/base-table-config';

export default function EnodeLogPage({
  searchParams,
}: {
  searchParams?: any;
}) {
  const _key = searchParams.page;
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
