import { EnodeLogUsecase } from '@/domain/use-cases/enode-log-usecase'
import { defaultTablePaginatitonParams, pageSizeOptionsDefault } from '@/components/base-table/base-table-config';
import ENodeLogLimit from './enode-log-limit-component';
import ENodeLog from './enode-log-component';
import { PageSearchParamsProvider } from '@/components/base-table/context/search-params-context';

export async function EnodeLogLimitTable({
    searchParams,
}: {
    searchParams?: any;
}) {
    console.log(`searchParams: ${JSON.stringify(searchParams)}`)
    if (searchParams === undefined) {
        searchParams = {}
    }
    searchParams.pageSize = Number(searchParams?.pageSize ?? defaultTablePaginatitonParams.pageSize);
    searchParams.page = Number(searchParams?.page ?? defaultTablePaginatitonParams.page);
    if (!pageSizeOptionsDefault.includes(searchParams.pageSize)) {
        searchParams.pageSize = defaultTablePaginatitonParams.pageSize;
    }
    const state = await EnodeLogUsecase.getListLimit({ postPerPage: searchParams.pageSize, pageNumber: searchParams.page, totalPage: 10 })

    return (
        <PageSearchParamsProvider initValue={searchParams}>
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
