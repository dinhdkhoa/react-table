"use client"

import slideSessionAPI from "@/app/api/auth/slide-session/silde-session.api"
import { clientSessionToken } from "@/lib/https"
import { differenceInHours } from "date-fns"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SlideSession() {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentTime = new Date()
      const expiresTime = new Date(clientSessionToken.expiresAt)
      if (differenceInHours(expiresTime, currentTime) < 1) {
        try {
          const result = await slideSessionAPI.slideSessionClient()
          if (result) {
            clientSessionToken.expiresAt = result.payload.data.expiresAt
          }
        } catch (error) {
          router.push("/login?sessionExpired=true")
        }
      }
    }, 1000 * 60 * 60)

    return () => clearInterval(interval)
  }, [])
  return null
}
