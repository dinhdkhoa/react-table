import ProductDetail from '../../[id]/page'

export default function EditProdutcDetail({ params }: { params: { id: string } }) {
  return (
    <>
      <ProductDetail params={params} />
    </>
  )
}
