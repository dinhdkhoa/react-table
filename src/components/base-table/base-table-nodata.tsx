import { TableCell, TableRow } from '../ui/table'

export function BaseTableNodata({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>No Data</TableCell>
    </TableRow>
  )
}
