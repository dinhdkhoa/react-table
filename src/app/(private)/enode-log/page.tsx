import { EnodeLogUsecase } from '@/domain/use-cases/enode-log-usecase'
import ENodeLog from './_components/enode-log-component'
import { Suspense } from 'react'

export default function EnodeLogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnodeLogTable />
    </Suspense>
  );
}
async function EnodeLogTable() {
  const data = await EnodeLogUsecase.getList({ postPerPage: 100, pageNumber: 0 })
  return <ENodeLog data={data.value || []} />
}