import React, { cache } from "react"
import addProductsAPI from "../products.api"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ProductDetailType,
  ProductResType
} from "@/schemaValidations/product.schema"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProductForm } from "../_components/product-form"
import { cookies } from "next/headers"

const getProductDetail = cache(addProductsAPI.getProductDetail)

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id
  const product = await getProductDetail(id)
  const { name } = product.payload.data
  return {
    title: `${name}`
  }
}

export default async function ProductDetail({
  params
}: {
  params: { id: string }
}) {
  const id = params.id
  let product: ProductDetailType | null = null
  const isAuthen = cookies().get("sessionToken")?.value ? true : false
  try {
    const res = await getProductDetail(id)
    if (res) {
      product = res.payload.data
    }
  } catch (error) {}
  return (
    <div>
      {!product && <span>Item Not Found</span>}
      {product && (
        <div className="flex gap-8">
          <Card className="w-[350px] h-auto">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src={product.image}
                width={180}
                height={180}
                alt={product.name}
              />
            </CardContent>
            <CardFooter>
              <span>{product.price}</span>
              {isAuthen && <Button variant={"destructive"}>Delete</Button>}
              {!isAuthen && <Button variant={"outline"}>Buy Now</Button>}
            </CardFooter>
          </Card>
          {isAuthen && <ProductForm product={product} />}
        </div>
      )}
    </div>
  )
}
