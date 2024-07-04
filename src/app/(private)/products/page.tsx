import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import addProductsAPI from './products.api'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DeleteProduct } from './_components/delete-product'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products'
}

export default async function ProductsPage() {
  const cookiesStore = cookies()
  const isAuthenticated = cookiesStore.get('sessionToken')?.value ? true : false
  const res = await addProductsAPI.getProductList()
  const productList = res.payload.data

  return (
    <>
      <Link href={`products/add`}>
        <Button variant={'outline'}>Add New Products</Button>
      </Link>

      <div className=' flex gap-2 '>
        {productList &&
          productList.length > 0 &&
          productList.map((product) => (
            <Card key={product.id} className='w-[350px] h-auto'>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`products/${product.id}`}>
                  <Image src={product.image} width={180} height={180} alt={product.name} />
                </Link>
              </CardContent>
              <CardFooter>
                <span className='mr-2'>{product.price}</span>
                {isAuthenticated && (
                  <>
                    <Link href={`products/edit/${product.id}`}>
                      <Button variant={'outline'}>Edit</Button>
                    </Link>
                    <DeleteProduct productName={product.name} id={product.id} />
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
      </div>
    </>
  )
}
