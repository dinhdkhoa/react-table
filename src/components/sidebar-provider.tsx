"use client"
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react"

interface SidebarContextProps {
  isOpen: boolean
  setIsOpen: () => void
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)
export const useSidebarContext = () => useContext(SidebarContext)

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpenState] = useState<boolean>(() => {
    const savedState = typeof window !== 'undefined' ? localStorage.getItem("sidebarOpen") : null
    return savedState ? JSON.parse(savedState) : true
  })

  const setIsOpen = () => {
    setIsOpenState((prev) => {
      const newState = !prev
      localStorage.setItem("sidebarOpen", JSON.stringify(newState))
      return newState
    })
  }

  useEffect(() => {
    const savedState = typeof window !== 'undefined' ? localStorage.getItem("sidebarOpen") : null
    if (savedState !== null) {
      setIsOpenState(JSON.parse(savedState))
    }
  }, [])
  const sidebar = { isOpen, setIsOpen }

  return (
    <SidebarContext.Provider value={sidebar}>
      {children}
    </SidebarContext.Provider>
  )
}
