


import { EnodeLogUsecase } from '@/domain/use-cases/enode-log-usecase'
import ENodeLogLimit from './enode-log-limit-component';
import ENodeLog from './enode-log-component';
import { PageSearchParamsProvider } from '@/components/base-table/context/search-params-context';
import { EnodeLogSearchComponent } from './enode-log-search-component';
import { Guid } from 'guid-typescript';
import { searchParamsPaginationPipe } from '@/core/helper/search-param-helper';
import { EnodeLogChartDateComponent } from './enode-log-chart-date';
import { EnodeLogChartServiceCodeComponent } from './enode-log-chart-service-code';

export async function EnodeLogLimitTable({
    searchParams,
}: {
    searchParams?: any;
}) {
    searchParamsPaginationPipe(searchParams);
    console.log('searchParams', searchParams);

    const state = await EnodeLogUsecase.getListLimit({ postPerPage: searchParams.pageSize, pageNumber: searchParams.page, totalPage: 10 })
    const stateId = Guid.create().toString();
    return (
        <PageSearchParamsProvider>
            <EnodeLogSearchComponent stateId={stateId} />
            {/* <EnodeLogChartDateComponent data={state.value || []} /> */}
            <EnodeLogChartServiceCodeComponent data={state.value || []}/>
            <ENodeLogLimit data={state.value || []} />
        </PageSearchParamsProvider>
    );
}




















export async function EnodeLogTable({
    searchParams,
}: {
    searchParams?: any;
}) {
    const state = await EnodeLogUsecase.getList({ postPerPage: 100, pageNumber: 0 })
    return <ENodeLog data={state.value || []} />
}
