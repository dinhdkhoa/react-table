

import { PageSearchParamsProvider } from '@/components/base-table/context/search-params-context'
import ENode from './_components/enode'
import { EnodeLogSearchComponent } from '../enode-log/_components/enode-log-search-component'
import { convertSearchParamsToFilterModel, searchParamsMergeDefaultEntityPipe, searchParamsPaginationPipe } from '@/core/helper/search-param-helper';
import { defaultEnodeLogSearchEntity, mapperFilterEnodeLogModel } from '@/domain/entities/enode-log/enode-log-search-entity';
import { FilterEnodeLogModel } from '@/data/remote/enode-service/models/requests/get-enode-log-request.model';

export default function DemoPage({
  searchParams,
}: {
  searchParams?: any;
}) {

  searchParamsPaginationPipe(searchParams);
  searchParamsMergeDefaultEntityPipe(defaultEnodeLogSearchEntity(), searchParams)
  const filterModel = convertSearchParamsToFilterModel<FilterEnodeLogModel>(mapperFilterEnodeLogModel, searchParams);
  console.log('searchParams', searchParams);
  return (
    <PageSearchParamsProvider>
      <EnodeLogSearchComponent stateId={''} />
      <ENode />
    </PageSearchParamsProvider>
  )
}
