import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FormError, HttpError } from "./https"
import { UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import jwt from 'jsonwebtoken'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleApiError = (error: unknown, setError?: UseFormSetError<any>, duration = 5000) : void => {
  if (error instanceof FormError && setError && error.payload.errors.length > 0){
    error.payload.errors.forEach(error => {
      setError(error.field, {
        type: 'Server',
        message: error.message
      })
    })
  } else if (error instanceof HttpError){
    toast.error(error.message, {
      duration
    })
  } else if (error && typeof error === 'object' && 'message' in error){
    toast.error(String(error.message), {
      duration
    })
  }
}

export const isClient = typeof window !== 'undefined'

export const decodeJWT = <Payload>(token: string) => {
  return jwt.decode(token) as Payload
}