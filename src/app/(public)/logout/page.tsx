'use client'

import logoutAPI from '@/app/api/auth/logout/logout.api'
import { clientSessionToken } from '@/lib/https'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Logout() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sessionToken = searchParams.get('sessionToken')
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    if (sessionToken === clientSessionToken.value) {
      logoutAPI.logoutClient(true, signal).then((res) => {
        router.push(`/login?sessionExpired=true`)
      })
    }
    return () => {
      controller.abort()
    }
  }, [sessionToken, router, pathname])
  return <div>Logout</div>
}
