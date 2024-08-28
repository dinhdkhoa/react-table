

import { PageSearchParamsProvider } from '@/components/base-table/context/search-params-context'
import ENode from './_components/enode'
import { EnodeLogSearchComponent } from '../enode-log/_components/enode-log-search-component'

export default function DemoPage() {
  return (
    // <TablePaginationParamsProvider initValue={defaultTablePaginatitonParams}>
    <PageSearchParamsProvider>
      <EnodeLogSearchComponent stateId={''}/>
      <ENode />
      </PageSearchParamsProvider>
    // </TablePaginationParamsProvider>
  )
}
