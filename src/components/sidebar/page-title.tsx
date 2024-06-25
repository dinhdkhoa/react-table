"use client"
import { getActiveMenuTitle } from "@/lib/menu-list"
import { usePathname } from "next/navigation"
import React from "react"

export default function Title() {
  const pathname = usePathname()
  const title = getActiveMenuTitle(pathname)
  return <h1 className="font-bold">{title}</h1>
}
