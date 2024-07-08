'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import dialogObserver from '@/core/classes/dialog-obserable'
import { useEffect, useState } from 'react'

const ConfirmDialog = () => {

  const dialogObserverData = dialogObserver.getData()

  const [open, setOpen] = useState(false) 
  const [data, setData] = useState(dialogObserverData)

  useEffect(() => {
    dialogObserver.subscribe((value: boolean) => setOpen(value))
    return () => {
      dialogObserver.unsubscribe()
    }
  }, [])

  useEffect(() => {
    setData(dialogObserverData)
  }, [dialogObserverData])


  const handleConfirm = async () => {
  const confirmResult = dialogObserver.confirm(data?.data);

  if (confirmResult instanceof Promise) {
    await confirmResult;
  }

  if (data.closeAfterConfirm) {
        setOpen(false)

  }
}

  return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle> {data?.title}</AlertDialogTitle>
            <AlertDialogDescription>{data?.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{data?.cancelBtnText}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{data?.confirmBtnText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}

 export default ConfirmDialog