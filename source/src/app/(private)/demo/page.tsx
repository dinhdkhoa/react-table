
import { TablePaginationParamsProvider } from '@/components/base-table/pagination-params-context'
import ENode from './_components/enode'
import { defaultTablePaginatitonParams } from '@/components/base-table/base-table-config'

export default function DemoPage() {
  return (
    <TablePaginationParamsProvider initValue={defaultTablePaginatitonParams}>
      <ENode />
    </TablePaginationParamsProvider>
  )
}
