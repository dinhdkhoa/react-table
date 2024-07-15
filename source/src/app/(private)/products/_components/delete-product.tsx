'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import addProductsAPI from '../products.api'
import { handleApiError } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DeleteProduct({ productName, id }: { productName: string; id: number }) {
  const router = useRouter()
  const handleConfirm = async () => {
    try {
      const res = await addProductsAPI.deleteProduct(id)
      toast.success(res.payload.message)
      router.refresh()
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Data</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {productName}? This will permanently delete this data!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
