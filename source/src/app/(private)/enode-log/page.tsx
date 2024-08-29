import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import { EnodeLogLimitTable } from './_components/enode-log-table';
import { searchParamsMergeDefaultEntityPipe, searchParamsPaginationPipe } from '@/core/helper/search-param-helper';
import { defaultEnodeLogSearchEntity } from '@/domain/entities/enode-log/enode-log-search-entity';
import { PageSearchParamsProvider } from '@/components/base-table/context/search-params-provider';
import { EnodeLogSearchComponent } from './_components/enode-log-search-component';
import { PagePreventActionProvider } from '@/components/page-prevent-action-provider';

export default function EnodeLogPage({
  searchParams,
}: {
  searchParams?: any;
}) {

  searchParamsPaginationPipe(searchParams);
  searchParamsMergeDefaultEntityPipe(defaultEnodeLogSearchEntity(), searchParams);
  console.log('searchParams', searchParams);

  return <>
    <PagePreventActionProvider>
      <PageSearchParamsProvider>
        <EnodeLogSearchComponent>
          <Suspense fallback={<MySkeleton />}>
            <EnodeLogLimitTable searchParams={searchParams} />
          </Suspense>
          {/* <Suspense fallback={<MySkeleton />}>
            <EnodeLogLimitChartTable searchParams={searchParams} />
          </Suspense> */}
        </EnodeLogSearchComponent>
      </PageSearchParamsProvider>
    </PagePreventActionProvider>

    {/* <Suspense fallback={<MySkeleton />}>
      <EnodeLogTable searchParams={searchParams} />
    </Suspense> */}
  </>
}


const MySkeleton = () => {
  return (<Skeleton className="w-full h-[300px] rounded-sm mb-5 mt-5" />)
}
