

import { PageSearchParamsProvider } from '@/components/base-table/context/search-params-provider'
import ENode from './_components/enode'
import { EnodeLogSearchComponent } from '../enode-log/_components/enode-log-search-component'
import { convertSearchParamsToFilterModel, searchParamsMergeDefaultEntityPipe, searchParamsPaginationPipe } from '@/core/helper/search-param-helper';
import { defaultEnodeLogSearchEntity, mapperFilterEnodeLogModel } from '@/domain/entities/enode-log/enode-log-search-entity';
import { FilterEnodeLogRequestModel } from '@/data/remote/enode-service/models/requests/get-enode-log-request.model';
import { PagePreventActionProvider } from '@/components/page-prevent-action-provider';

export default function DemoPage({
  searchParams,
}: {
  searchParams?: any;
}) {

  searchParamsPaginationPipe(searchParams);
  searchParamsMergeDefaultEntityPipe(defaultEnodeLogSearchEntity(), searchParams)
  const filterModel = convertSearchParamsToFilterModel<FilterEnodeLogRequestModel>(mapperFilterEnodeLogModel, searchParams);
  console.log('searchParams', searchParams);
  return (
    <PagePreventActionProvider>
      <PageSearchParamsProvider>
        <EnodeLogSearchComponent>
          <ENode />
        </EnodeLogSearchComponent>

      </PageSearchParamsProvider>
    </PagePreventActionProvider>
  )
}
