


import { EnodeLogUsecase } from '@/domain/use-cases/enode-log-usecase'
import ENodeLogLimit from './enode-log-limit-component';
import ENodeLog from './enode-log-component';
import { PageSearchParamsProvider } from '@/components/base-table/context/search-params-context';
import { EnodeLogSearchComponent } from './enode-log-search-component';
import { Guid } from 'guid-typescript';
import { convertSearchParamsToFilterModel, searchParamsMergeDefaultEntityPipe, searchParamsPaginationPipe } from '@/core/helper/search-param-helper';
import { EnodeLogChartDateComponent } from './enode-log-chart-date';
import { EnodeLogChartServiceCodeComponent } from './enode-log-chart-service-code';
import { defaultEnodeLogSearchEntity, mapperFilterEnodeLogModel } from '@/domain/entities/enode-log/enode-log-search-entity';
import { FilterEnodeLogModel } from '@/data/remote/enode-service/models/requests/get-enode-log-request.model';

export async function EnodeLogLimitTable({
    searchParams,
}: {
    searchParams?: any;
}) {
    searchParamsPaginationPipe(searchParams);
    searchParamsMergeDefaultEntityPipe(defaultEnodeLogSearchEntity(), searchParams)
    console.log('searchParams', searchParams);
    const filterModel = convertSearchParamsToFilterModel<FilterEnodeLogModel>(mapperFilterEnodeLogModel, searchParams);
    const state = await EnodeLogUsecase.getListLimit({ postPerPage: searchParams.pageSize, pageNumber: searchParams.page, totalPage: 10, filter: filterModel })
    const stateId = Guid.create().toString();
    return (
        <PageSearchParamsProvider>
            <EnodeLogSearchComponent stateId={stateId} />
            {/* <EnodeLogChartDateComponent data={state.value || []} /> */}
            <EnodeLogChartServiceCodeComponent data={state.value || []} />
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
