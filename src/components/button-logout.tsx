"use client"

import React from "react"
import { Button } from "./ui/button"
import logoutAPI from "@/app/api/auth/logout/logout.api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { handleApiError } from "@/lib/utils"

export default function ButtonLogout() {
  const router = useRouter()
  const logout = async () => {
    try {
      const result = await logoutAPI.logoutClient()
      if (result) {
        toast.success(result.payload.message)
        router.push("/login")
        router.refresh()
      }
    } catch (error) {
      handleApiError(error)
    }
  }
  return (
    <div>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}
