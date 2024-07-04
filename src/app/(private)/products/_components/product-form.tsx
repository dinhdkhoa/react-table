'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { handleApiError } from '@/lib/utils'
import { CreateProductBody, CreateProductBodyType, ProductDetailType } from '@/schemaValidations/product.schema'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import addProductsAPI from '../products.api'
import { useRouter } from 'next/navigation'

export function ProductForm({ product }: { product?: ProductDetailType }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()
  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: product?.name ?? '',
      price: product?.price ?? 0,
      description: product?.description ?? '',
      image: product?.image ?? ''
    }
  })
  const image = form.watch('image')
  // 2. Define a submit handler.
  async function onSubmit(values: CreateProductBodyType) {
    if (isLoading) return
    if (product) {
      await updateProduct(values)
    } else {
      await addProduct(values)
      router.push('/products')
    }
    router.refresh()
  }

  const updateProduct = async (values: CreateProductBodyType) => {
    if (!product) return
    setIsLoading(true)
    const _values = {
      ...values
    }
    try {
      if (file) {
        const formData = new FormData()
        formData.append('file', file as Blob)
        const resp = await addProductsAPI.uploadImage(formData)
        toast.success(resp.payload.message)
        _values.image = resp.payload.data
      }
      const updateProduct = await addProductsAPI.updateProduct(product?.id, {
        ..._values
      })
      toast.success(updateProduct.payload.message)
    } catch (error) {
      handleApiError(error, form.setError)
    } finally {
      setIsLoading(false)
    }
  }
  const addProduct = async (values: CreateProductBodyType) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file as Blob)
      const resp = await addProductsAPI.uploadImage(formData)
      toast.success(resp.payload.message)
      const createProduct = await addProductsAPI.add({
        ...values,
        image: resp.payload.data
      })
      toast.success(createProduct.payload.message)
      form.reset()
    } catch (error) {
      handleApiError(error, form.setError)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 w-full max-w-[400px]'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Name' {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder='Price' type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='Description' {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  ref={inputRef}
                  accept='image/*'
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.value = ''
                    }
                  }}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                      inputRef
                      setFile(file)
                      field.onChange('http://localhost:3000/' + file.name)
                    }
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {(file || image) && (
          <>
            <Image
              src={file ? URL.createObjectURL(file) : image}
              width={128}
              height={128}
              alt='Product Image'
              className='w-32 h-32 object-cover'
            />
            <Button
              type='button'
              variant={'destructive'}
              size={'sm'}
              onClick={() => {
                setFile(null)
                form.setValue('image', '')
                if (inputRef.current) {
                  inputRef.current.value = ''
                }
              }}
            >
              Reset File
            </Button>
          </>
        )}
        <Button type='submit' className='!mt-8 w-full' disabled={isLoading}>
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </form>
    </Form>
  )
}
