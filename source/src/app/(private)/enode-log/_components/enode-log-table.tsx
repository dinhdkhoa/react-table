import { EnodeLogUsecase } from '@/domain/use-cases/enode-log-usecase'
import ENodeLogLimit from './enode-log-limit-component';
import ENodeLog from './enode-log-component';
import { Guid } from 'guid-typescript';
import { convertSearchParamsToFilterModel } from '@/core/helper/search-param-helper';
import { EnodeLogChartServiceCodeComponent } from './enode-log-chart-service-code';
import { mapperFilterEnodeLogModel } from '@/domain/entities/enode-log/enode-log-search-entity';
import { FilterEnodeLogRequestModel } from '@/data/remote/enode-service/models/requests/get-enode-log-request.model';

export async function EnodeLogLimitTable({
    searchParams,
}: {
    searchParams?: any;
}) {
    const filterModel = convertSearchParamsToFilterModel<FilterEnodeLogRequestModel>(mapperFilterEnodeLogModel, searchParams);
    const state = await EnodeLogUsecase.getListLimit({ postPerPage: searchParams.pageSize, pageNumber: searchParams.page, totalPage: 10, filter: filterModel })
    const stateId = Guid.create().toString();
    console.log('state', state.isError, state.message)
    console.log('stateId: ', stateId)
    return (
        <>
            <EnodeLogChartServiceCodeComponent data={state.value || []} />
            <ENodeLogLimit data={state.value || []} />
        </>
    );
}


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export async function EnodeLogLimitChartTable({
    searchParams,
}: {
    searchParams?: any;
}) {
    const filterModel = convertSearchParamsToFilterModel<FilterEnodeLogRequestModel>(mapperFilterEnodeLogModel, searchParams);
    // await delay(10000); // 10,000 milliseconds = 10 seconds
    const state = await EnodeLogUsecase.getListLimit({ postPerPage: searchParams.pageSize, pageNumber: searchParams.page, totalPage: 10, filter: filterModel })
    const stateId = Guid.create().toString();
    console.log('state', state.isError, state.message)
    console.log('stateId: ', stateId)
    return (
        <>
            <EnodeLogChartServiceCodeComponent data={state.value || []} />
        </>
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
