import { EnodeLogUsecase } from '@/domain/use-cases/enode-log-usecase'
import { PaginationParams } from '@/components/base-table/pagination-params-context';
import { defaultTablePaginatitonParams, pageSizeOptionsDefault } from '@/components/base-table/base-table-config';
import ENodeLogLimit from './enode-log-limit-component';
import ENodeLog from './enode-log-component';

export async function EnodeLogLimitTable({
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

    return (<ENodeLogLimit data={state.value || []} />);
}




















export async function EnodeLogTable({
    searchParams,
}: {
    searchParams?: PaginationParams;
}) {
    const state = await EnodeLogUsecase.getList({ postPerPage: 100, pageNumber: 0 })
    return <ENodeLog data={state.value || []} />
}
