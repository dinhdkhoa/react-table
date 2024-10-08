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
    const state = await EnodeLogUsecase.getListLimit({ postPerPage: searchParams.pageSize, pageNumber: searchParams.page, filter: filterModel })
    const stateId = Guid.create().toString();
    console.log('state', state.isError, state.message)
    console.log('stateId: ', stateId)
    return (
        <>
            <EnodeLogChartServiceCodeComponent entity={state.value} />
            <ENodeLogLimit entity={state.value} />
        </>
    );
}