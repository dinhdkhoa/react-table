import { TableSearchParamsProvider } from '../enode-log/_components/enode-log-limit-component'
import ENode from './_components/enode'

export default function DemoPage() {
  return (
    <TableSearchParamsProvider>
      <ENode />
    </TableSearchParamsProvider>
  )
}
