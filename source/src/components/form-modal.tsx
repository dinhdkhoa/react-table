import React, { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'

type ModalProps = {
    open?: boolean, 
    onOpenChange?: (open:boolean) => {},
    children: ReactNode,
    disabled? : boolean
}

function Modal(props : ModalProps) {

  const {open, onOpenChange, children} = props

  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
    </Dialog>
  )
}


function ModalContent({...props} : { children: ReactNode,  title: string, description?: string}) {
    return  (  <DialogContent className="sm:max-w-[425px] mb-6">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>
            {props.description ?? ''}
          </DialogDescription>
        </DialogHeader>
        {props.children}
      </DialogContent>)
}

Modal.Content = ModalContent
Modal.Trigger = DialogTrigger
Modal.Footer = DialogFooter

export default Modal