// import { EnodeLogUsecase } from '@/domain/use-cases/enode-log-usecase'
// import ENodeLog from './_components/enode-log-component'

// export default async function DemoPage() {
//   const data=  await EnodeLogUsecase.getList({ postPerPage: 100, pageNumber: 0 })
//   const data1=  await EnodeLogUsecase.getList({ postPerPage: 100, pageNumber: 0 })
//   const data2=  await EnodeLogUsecase.getList({ postPerPage: 100, pageNumber: 0 })
//   const data3=  await EnodeLogUsecase.getList({ postPerPage: 100, pageNumber: 0 })
//   const data4=  await EnodeLogUsecase.getList({ postPerPage: 100, pageNumber: 0 })
//   return (
//     <>
//     <h2>Log</h2>
//        <ENodeLog  data={data.value || []}  />
//        <ENodeLog  data={data1.value || []}  />
//        <ENodeLog  data={data2.value || []}  />
//        <ENodeLog  data={data3.value || []}  />
//        <ENodeLog  data={data4.value || []}  />
//     </>
//   )
// }


import ENodeLog from './_components/enode-log-component'

export default function DemoPage() {
  return <ENodeLog data={[]} />
}
