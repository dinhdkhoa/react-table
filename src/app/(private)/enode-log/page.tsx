import { EnodeLogUsecase } from '@/domain/use-cases/enode-log-usecase'
import ENodeLog from './_components/enode-log-component'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton';

export default function EnodeLogPage() {
  return (
    <Suspense fallback={<MySkeleton />}>
      <EnodeLogTable />
    </Suspense>
  );
}
async function EnodeLogTable() {
  const data = await EnodeLogUsecase.getList({ postPerPage: 100, pageNumber: 0 })
  return <ENodeLog data={data.value || []} />
}

const MySkeleton = () => {
  return (<Skeleton className="w-full h-[125px] rounded-sm mb-5 mt-5" />)
}
